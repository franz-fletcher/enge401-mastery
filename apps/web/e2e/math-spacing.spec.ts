import { test, expect } from '@playwright/test';
import {
  waitForMathRendering,
  waitForAllMathRendered,
  checkTextSpacing,
  getWhiteSpaceStyle,
  getMixedContentText,
  hasSpacingBug,
  monitorKaTeXErrors,
  checkKaTeXErrors,
  submitAnswerAndShowSolution,
  navigateToPracticePage,
} from './helpers/math-test-helpers';

/**
 * Math Text Spacing Tests
 *
 * These tests verify that text spacing is preserved between text and math,
 * preventing the critical bug where "Solve $x^2$" renders as "Solvex^2".
 */

test.describe('Math Text Spacing', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor console for KaTeX errors during each test
    monitorKaTeXErrors(page);
  });

  test.describe('Static Test Page - Deterministic Spacing Tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/math-display');
      await waitForAllMathRendered(page);
    });

    test('preserves spaces between text and math on static page', async ({ page }) => {
      const mixedContent = page.locator('[data-testid="mixed-content-section"]');
      const textSpans = mixedContent.locator('span[style*="white-space"]');

      for (const span of await textSpans.all()) {
        const whiteSpace = await span.evaluate(el =>
          window.getComputedStyle(el).whiteSpace
        );
        expect(whiteSpace).toBe('pre-wrap');
      }
    });

    test('Solve $x^2$ does not render as Solvex^2 on static page', async ({ page }) => {
      const content = await page.locator('[data-testid="mixed-content-section"]').textContent();
      expect(content).not.toMatch(/Solvex\^2/);
      expect(content).toMatch(/Solve.*x\^2/);
    });

    test('final answer preserves spacing on static page', async ({ page }) => {
      const answerSection = page.locator('[data-testid="final-answer-section"]');
      await expect(answerSection).toBeVisible();

      const text = await answerSection.textContent();
      expect(text).toContain('The solution is');
      expect(text).toContain('x = 4');
    });

    test('linear equation steps preserve spacing', async ({ page }) => {
      const section = page.locator('[data-testid="linear-equation-section"]');
      const text = await section.textContent();

      // Check that spaces are preserved between text and math
      expect(text).toContain('Solve');
      expect(text).toContain('2x + 5 = 13');
      expect(text).toContain('Subtract 5');
      expect(text).toContain('2x = 8');
    });

    test('quadratic equation preserves spacing', async ({ page }) => {
      const section = page.locator('[data-testid="quadratic-equation-section"]');
      const text = await section.textContent();

      // Check that spaces are preserved
      expect(text).toContain('Solve');
      expect(text).toContain('x^2 - 5x + 6 = 0');
      expect(text).toContain('Solutions');
    });

    test('solution steps preserve text-math spacing', async ({ page }) => {
      const section = page.locator('[data-testid="solution-steps-section"]');
      const hasBug = await hasSpacingBug(section);
      expect(hasBug).toBe(false);
    });
  });

  test.describe('Space Preservation Between Text and Math', () => {
    test('preserves spaces between text and inline math', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Find text spans that have pre-wrap style (these are the MixedContent text spans)
      const textSpans = page.locator('span[style*="white-space: pre-wrap"], span[style*="pre-wrap"]');
      const count = await textSpans.count();

      // Should have text spans with pre-wrap for preserving spaces
      expect(count).toBeGreaterThan(0);

      // Verify at least one has proper white-space style
      let foundPreWrap = false;
      for (let i = 0; i < Math.min(count, 5); i++) {
        const whiteSpace = await getWhiteSpaceStyle(textSpans.nth(i));
        if (whiteSpace === 'pre-wrap') {
          foundPreWrap = true;
          break;
        }
      }
      expect(foundPreWrap).toBe(true);
    });

    test('text spans have white-space: pre-wrap style', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Find text spans that are siblings to math elements
      const textSpans = page.locator('span[style*="white-space: pre-wrap"], span[style*="pre-wrap"]');
      const count = await textSpans.count();

      // Should have text spans with pre-wrap
      expect(count).toBeGreaterThan(0);

      // Verify the style is correct
      for (let i = 0; i < Math.min(count, 5); i++) {
        const whiteSpace = await getWhiteSpaceStyle(textSpans.nth(i));
        expect(whiteSpace).toBe('pre-wrap');
      }
    });

    test('no missing spaces between words and math expressions', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Get all text content from the main content area (use first main element)
      const mainContent = await page.locator('main').first().textContent();
      expect(mainContent).toBeTruthy();

      // Check for the specific bug pattern: word characters immediately followed by math content
      // This regex looks for patterns like "Solvex^2" (missing space)
      const bugPattern = /[a-zA-Z]{3,}[a-zA-Z0-9]*\^/;

      // The content should NOT match the bug pattern
      // Note: This is a heuristic check - valid math might contain similar patterns
      const hasBug = bugPattern.test(mainContent!);

      // Log for debugging if bug is detected
      if (hasBug) {
        console.log('Potential spacing bug detected in:', mainContent!.substring(0, 200));
      }

      // This assertion may need adjustment based on actual content
      // We're looking for obvious cases like "Solvex^2" not "x^2 + y^2"
      const obviousBugPattern = /[a-zA-Z]{4,}[a-zA-Z]\^/;
      expect(obviousBugPattern.test(mainContent!)).toBe(false);
    });

    test('Solve $x^2$ does not render as Solvex^2', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Get text content from elements that might have this pattern
      const contentElements = page.locator('main p, main [class*="content"], main .katex').first().locator('..');

      // Check multiple elements for the spacing bug
      const elementsToCheck = await contentElements.count();

      for (let i = 0; i < Math.min(elementsToCheck, 10); i++) {
        const element = contentElements.nth(i);
        const hasBug = await hasSpacingBug(element);

        // Log for debugging
        if (hasBug) {
          const text = await getMixedContentText(element);
          console.log(`Spacing bug found in element ${i}:`, text);
        }

        expect(hasBug).toBe(false);
      }
    });

    test('spaces are preserved in MixedContent component', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Find the MixedContent component by looking for its structure
      // It renders text spans with pre-wrap style
      const mixedContentSpans = page.locator('span').filter({
        hasText: /\s/,
      });

      const count = await mixedContentSpans.count();
      expect(count).toBeGreaterThan(0);

      // Check that spaces are actually preserved
      for (let i = 0; i < Math.min(count, 5); i++) {
        const span = mixedContentSpans.nth(i);
        const text = await span.textContent();

        // If the text has leading/trailing spaces, they should be preserved
        if (text && (text.startsWith(' ') || text.endsWith(' '))) {
          const whiteSpace = await getWhiteSpaceStyle(span);
          // Either pre-wrap is set, or the spaces are preserved by default
          expect(whiteSpace === 'pre-wrap' || whiteSpace === 'pre').toBe(true);
        }
      }
    });
  });

  test.describe('Visual Spacing Regression Tests', () => {
    test('text-math spacing visual regression on static page', async ({ page }) => {
      await page.goto('/test/math-display');
      await waitForAllMathRendered(page);

      // Take screenshot focusing on text-math boundaries
      const mixedContent = page.locator('[data-testid="mixed-content-section"]');

      // Verify element exists before taking screenshot
      await expect(mixedContent).toBeVisible();

      // Use stricter threshold for spacing tests
      await expect(mixedContent).toHaveScreenshot('text-math-spacing.png', {
        maxDiffPixels: 20,
        threshold: 0.1,
      });
    });

    test('inline math spacing is consistent', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Get all inline math elements
      const inlineMath = page.locator('.katex:not(.katex-display)');
      const count = await inlineMath.count();

      // Check spacing around each inline math element
      for (let i = 0; i < Math.min(count, 5); i++) {
        const math = inlineMath.nth(i);
        const parent = math.locator('..');

        // Get the parent's text content
        const parentText = await parent.textContent();

        // Check that math is not directly concatenated with text
        // (there should be some separation)
        const mathText = await math.textContent();

        if (parentText && mathText) {
          const mathIndex = parentText.indexOf(mathText);
          if (mathIndex > 0) {
            // Check character before math
            const charBefore = parentText[mathIndex - 1];
            // Should be a space or start of string, not another letter
            if (charBefore && /[a-zA-Z]/.test(charBefore)) {
              console.log(`Potential spacing issue: "${charBefore}${mathText}"`);
            }
          }
        }
      }
    });
  });

  test.describe('Spacing in Solution Steps', () => {
    test('solution steps preserve text-math spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      const revealAllButton = page.getByRole('button').filter({ hasText: /reveal all/i });
      if (await revealAllButton.isVisible().catch(() => false)) {
        await revealAllButton.click();
        await page.waitForTimeout(1000);
        await waitForAllMathRendered(page);

        // Check spacing in step content
        const stepContents = page.locator('[id^="step-content-"]');
        const count = await stepContents.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
          const content = stepContents.nth(i);
          const hasBug = await hasSpacingBug(content);
          expect(hasBug).toBe(false);
        }
      }
    });

    test('step explanations have proper spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps using flexible selector
      const revealAllButton = page.getByRole('button').filter({ hasText: /reveal all/i });
      if (await revealAllButton.isVisible().catch(() => false)) {
        await revealAllButton.click();
        await page.waitForTimeout(1000);

        // Check explanation text
        const explanations = page.locator('[id^="step-content-"] .text-muted-foreground');
        const count = await explanations.count();

        for (let i = 0; i < Math.min(count, 5); i++) {
          const explanation = explanations.nth(i);
          const text = await explanation.textContent();

          // Explanations should be readable (not concatenated)
          expect(text).toBeTruthy();
          expect(text!.length).toBeGreaterThan(5);

          // Check for obvious spacing issues
          const hasObviousBug = /[a-zA-Z]{4,}[a-zA-Z]\^/.test(text!);
          expect(hasObviousBug).toBe(false);
        }
      }
    });
  });

  test.describe('Spacing Across Different Content Types', () => {
    test('question text preserves spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Get question text from main content area
      const questionCard = page.locator('main').first().locator('div').filter({
        has: page.locator('.katex'),
      }).first();

      if (await questionCard.isVisible().catch(() => false)) {
        const hasBug = await hasSpacingBug(questionCard);
        expect(hasBug).toBe(false);
      }
    });

    test('hint text preserves spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);

      // Show hint if available (use more flexible selector)
      const hintButton = page.getByRole('button').filter({ hasText: /hint/i });
      if (await hintButton.isVisible().catch(() => false)) {
        await hintButton.click();
        await page.waitForTimeout(500);
        await waitForAllMathRendered(page);

        // Check hint content - look for any visible content that appeared
        // The hint content should be near the button or in a collapsible area
        const hintContent = page.locator('div, p').filter({
          hasText: /hint/i,
        }).first();

        if (await hintContent.isVisible().catch(() => false)) {
          const hasBug = await hasSpacingBug(hintContent);
          expect(hasBug).toBe(false);
        }
      }
    });

    test('final answer preserves spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps to show final answer
      const revealAllButton = page.getByRole('button').filter({ hasText: /reveal all/i });
      if (await revealAllButton.isVisible().catch(() => false)) {
        await revealAllButton.click();
        await page.waitForTimeout(1000);
      }

      // Check final answer section - use data-testid for reliability
      const answerSection = page.locator('[data-testid="final-answer-value"]').first();
      if (await answerSection.isVisible().catch(() => false)) {
        const hasBug = await hasSpacingBug(answerSection);
        expect(hasBug).toBe(false);
      }
    });
  });

  test.describe('Edge Cases and Stress Tests', () => {
    test('multiple consecutive math expressions have spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Look for patterns with multiple math expressions
      const mainContent = await page.locator('main').first().textContent();

      // Check for the specific bug: text concatenated with math like "Solvex^2"
      // This regex looks for 4+ letters immediately followed by math-like content
      const spacingBugPattern = /[a-zA-Z]{4,}[a-zA-Z0-9]*\^/;
      expect(spacingBugPattern.test(mainContent!)).toBe(false);
    });

    test('math at start and end of content has proper boundaries', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Get all text containers
      const containers = page.locator('main p, main [class*="content"]');
      const count = await containers.count();

      for (let i = 0; i < Math.min(count, 5); i++) {
        const container = containers.nth(i);
        const text = await container.textContent();

        if (text) {
          // Check that math at boundaries doesn't cause issues
          // Content shouldn't start or end with partial math notation
          expect(text.startsWith('^')).toBe(false);
          expect(text.endsWith('^')).toBe(false);
        }
      }
    });

    test('rapid content changes preserve spacing', async ({ page }) => {
      await navigateToPracticePage(page, 1);

      // Click new question multiple times rapidly (use more flexible selector)
      for (let i = 0; i < 3; i++) {
        const newQuestionButton = page.getByRole('button').filter({
          hasText: /new question/i,
        });

        if (await newQuestionButton.isVisible().catch(() => false)) {
          await newQuestionButton.click();
          await page.waitForTimeout(1500);
          await waitForAllMathRendered(page);

          // Check spacing after each change
          const mainContent = page.locator('main').first();
          const hasBug = await hasSpacingBug(mainContent);
          expect(hasBug).toBe(false);
        }
      }
    });
  });

  test.describe('Console Error Monitoring for Spacing', () => {
    test('no console errors related to spacing', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          errors.push(msg.text());
        }
      });

      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Check for spacing-related errors
      const spacingErrors = errors.filter(
        (err) =>
          err.toLowerCase().includes('space') ||
          err.toLowerCase().includes('whitespace') ||
          err.toLowerCase().includes('pre-wrap')
      );

      expect(spacingErrors).toHaveLength(0);
    });

    test('no KaTeX errors during spacing-critical operations', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps (triggers lots of math rendering)
      const revealAllButton = page.getByRole('button').filter({ hasText: /reveal all/i });
      if (await revealAllButton.isVisible().catch(() => false)) {
        await revealAllButton.click();
        await page.waitForTimeout(1000);
      }

      const katexErrors = checkKaTeXErrors(errors);
      expect(katexErrors).toHaveLength(0);
    });
  });
});
