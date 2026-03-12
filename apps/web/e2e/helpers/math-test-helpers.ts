import { Page, Locator } from '@playwright/test';

/**
 * Math Test Helpers
 *
 * Reusable utilities for testing math rendering with KaTeX.
 * Provides functions for waiting, checking, and capturing math elements.
 */

/**
 * Wait for KaTeX math elements to be rendered on the page
 * @param page - Playwright page object
 * @param timeout - Maximum wait time in milliseconds (default: 10000)
 * @returns Promise that resolves when math elements are found
 */
export async function waitForMathRendering(page: Page, timeout = 10000): Promise<void> {
  await page.waitForSelector('.katex, .katex-display, .katex-html', {
    timeout,
    state: 'visible',
  });
}

/**
 * Get all KaTeX math elements on the page
 * @param page - Playwright page object
 * @returns Locator for all math elements
 */
export function getMathElements(page: Page): Locator {
  return page.locator('.katex, .katex-display, .katex-html');
}

/**
 * Get inline math elements only
 * @param page - Playwright page object
 * @returns Locator for inline math elements
 */
export function getInlineMathElements(page: Page): Locator {
  return page.locator('.katex:not(.katex-display)');
}

/**
 * Get display mode math elements only
 * @param page - Playwright page object
 * @returns Locator for display math elements
 */
export function getDisplayMathElements(page: Page): Locator {
  return page.locator('.katex-display');
}

/**
 * Check if text spans have proper white-space: pre-wrap style
 * This ensures spaces between text and math are preserved
 * @param element - Locator for the element to check
 * @returns Promise resolving to boolean indicating if pre-wrap is set
 */
export async function checkTextSpacing(element: Locator): Promise<boolean> {
  const whiteSpace = await element.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.whiteSpace;
  });
  return whiteSpace === 'pre-wrap';
}

/**
 * Get the computed white-space style of an element
 * @param element - Locator for the element
 * @returns Promise resolving to the white-space value
 */
export async function getWhiteSpaceStyle(element: Locator): Promise<string> {
  return await element.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.whiteSpace;
  });
}

/**
 * Capture a screenshot of the page with consistent settings for visual regression
 * @param page - Playwright page object
 * @param name - Screenshot name
 * @param options - Additional screenshot options
 */
export async function captureMathScreenshot(
  page: Page,
  name: string,
  options: { fullPage?: boolean; clip?: { x: number; y: number; width: number; height: number } } = {}
): Promise<void> {
  await page.screenshot({
    path: `e2e/__screenshots__/${name}.png`,
    fullPage: options.fullPage ?? false,
    clip: options.clip,
    animations: 'disabled',
  });
}

/**
 * Monitor console for KaTeX-specific errors
 * Call this before running tests that render math
 * @param page - Playwright page object
 * @returns Array to collect errors (check after test)
 */
export function monitorKaTeXErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (
        text.toLowerCase().includes('katex') ||
        text.toLowerCase().includes('latex') ||
        text.toLowerCase().includes('math') ||
        text.includes('ParseError')
      ) {
        errors.push(text);
      }
    }
  });

  page.on('pageerror', (error) => {
    const message = error.message;
    if (
      message.toLowerCase().includes('katex') ||
      message.toLowerCase().includes('latex') ||
      message.toLowerCase().includes('math')
    ) {
      errors.push(message);
    }
  });

  return errors;
}

/**
 * Check for KaTeX errors in the collected errors array
 * @param errors - Array of collected console errors
 * @returns Array of KaTeX-specific errors
 */
export function checkKaTeXErrors(errors: string[]): string[] {
  return errors.filter(
    (err) =>
      err.toLowerCase().includes('katex') ||
      err.toLowerCase().includes('latex') ||
      err.toLowerCase().includes('math') ||
      err.includes('ParseError')
  );
}

/**
 * Verify that text and math are properly separated (no missing spaces)
 * This checks for the critical bug: "Solve $x^2$" should NOT render as "Solvex^2"
 * @param page - Playwright page object
 * @param containerSelector - Selector for the container element
 * @returns Promise resolving to boolean indicating if spacing is correct
 */
export async function verifyTextMathSpacing(
  page: Page,
  containerSelector = 'body'
): Promise<boolean> {
  return await page.evaluate((selector) => {
    const container = document.querySelector(selector);
    if (!container) return false;

    // Get all text content
    const textContent = container.textContent || '';

    // Check for the specific bug pattern: text immediately followed by math without space
    // This regex looks for word characters immediately followed by math content
    const bugPattern = /[a-zA-Z]\$[a-zA-Z0-9]/;

    return !bugPattern.test(textContent);
  }, containerSelector);
}

/**
 * Get the text content of a MixedContent component
 * Useful for verifying text and math are rendered correctly
 * @param element - Locator for the MixedContent element
 * @returns Promise resolving to the text content
 */
export async function getMixedContentText(element: Locator): Promise<string> {
  return (await element.textContent()) || '';
}

/**
 * Check if an element contains the specific spacing bug
 * "Solve $x^2$" rendering as "Solvex^2"
 * @param element - Locator for the element to check
 * @returns Promise resolving to boolean (true if bug is present)
 */
export async function hasSpacingBug(element: Locator): Promise<boolean> {
  const text = await getMixedContentText(element);
  // Check for patterns like "Solvex^2" (missing space between text and math)
  return /[a-zA-Z][a-zA-Z0-9]*\^/.test(text) && !/[a-zA-Z]\s+[a-zA-Z0-9]*\^/.test(text);
}

/**
 * Wait for all math to be fully rendered (including async KaTeX)
 * @param page - Playwright page object
 * @param timeout - Maximum wait time in milliseconds (default: 5000)
 */
export async function waitForAllMathRendered(page: Page, timeout = 5000): Promise<void> {
  await page.waitForFunction(
    () => {
      // Check if all katex elements are present and have content
      const katexElements = document.querySelectorAll('.katex');
      if (katexElements.length === 0) return false;

      // Check if they have rendered content
      return Array.from(katexElements).every((el) => {
        const html = el.innerHTML;
        return html && html.length > 0 && html.includes('katex-html');
      });
    },
    { timeout }
  );
}

/**
 * Get accessibility information for math elements
 * @param page - Playwright page object
 * @returns Promise resolving to array of math element accessibility info
 */
export async function getMathAccessibilityInfo(
  page: Page
): Promise<Array<{ hasAriaLabel: boolean; ariaLabel?: string; textContent: string }>> {
  return await page.evaluate(() => {
    const mathElements = document.querySelectorAll('.katex, .katex-display');
    return Array.from(mathElements).map((el) => ({
      hasAriaLabel: el.hasAttribute('aria-label'),
      ariaLabel: el.getAttribute('aria-label') || undefined,
      textContent: el.textContent || '',
    }));
  });
}

/**
 * Helper to submit an answer and show step-by-step solution
 * @param page - Playwright page object
 */
export async function submitAnswerAndShowSolution(page: Page): Promise<void> {
  // Fill in any answer and submit
  const input = page.locator('input[type="text"]').first();
  await input.fill('test-answer');

  // Click submit using JavaScript to ensure it works
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitButton = buttons.find((b) => b.textContent?.trim() === 'Submit');
    if (submitButton) submitButton.click();
  });

  // Wait for feedback to appear
  await page.waitForSelector('text=/correct|incorrect/i', { timeout: 5000 });

  // Wait a bit for the solution panel to render
  await page.waitForTimeout(500);

  // Click "Show Step-by-Step Solution" button using JavaScript
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const showButton = buttons.find(
      (b) =>
        b.textContent?.toLowerCase().includes('show step-by-step') ||
        b.textContent?.toLowerCase().includes('solution')
    );
    if (showButton) {
      showButton.click();
      return 'Clicked solution button';
    }
    return 'Solution button not found';
  });

  // Wait for solution panel to expand
  await page.waitForTimeout(500);
}

/**
 * Navigate to practice page and wait for math to render
 * @param page - Playwright page object
 * @param chapterId - Optional chapter ID (default: 1)
 */
export async function navigateToPracticePage(page: Page, chapterId?: number): Promise<void> {
  const url = chapterId ? `/chapter/${chapterId}/practice` : '/practice';
  await page.goto(url);
  await page.waitForSelector('text=Practice Mode', { timeout: 10000 });
  await waitForMathRendering(page);
}
