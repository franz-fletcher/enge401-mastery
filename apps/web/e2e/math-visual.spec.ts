import { test, expect } from '@playwright/test';
import {
  waitForMathRendering,
  waitForAllMathRendered,
  monitorKaTeXErrors,
  checkKaTeXErrors,
  submitAnswerAndShowSolution,
  navigateToPracticePage,
} from './helpers/math-test-helpers';

/**
 * Math Visual Regression Tests
 *
 * These tests verify that math expressions render correctly visually
 * and that no KaTeX errors occur during rendering.
 */

test.describe('Math Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor console for KaTeX errors during each test
    monitorKaTeXErrors(page);
  });

  test.describe('Static Test Page - Deterministic Visual Regression', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/test/math-display');
      await waitForAllMathRendered(page);
    });

    test('mixed content text and math', async ({ page }) => {
      const section = page.locator('[data-testid="mixed-content-section"]');
      await expect(section).toHaveScreenshot('mixed-content-math.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    test('display mode math', async ({ page }) => {
      const section = page.locator('[data-testid="display-math-section"]');
      await expect(section).toHaveScreenshot('display-math.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    test('linear equation display', async ({ page }) => {
      const section = page.locator('[data-testid="linear-equation-section"]');
      await expect(section).toHaveScreenshot('linear-equation-math.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    test('quadratic equation display', async ({ page }) => {
      const section = page.locator('[data-testid="quadratic-equation-section"]');
      await expect(section).toHaveScreenshot('quadratic-equation-math.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    test('solution steps with math', async ({ page }) => {
      const section = page.locator('[data-testid="solution-steps-section"]');
      await expect(section).toHaveScreenshot('solution-steps-math.png', {
        maxDiffPixels: 150,
        threshold: 0.2,
      });
    });

    test('final answer section', async ({ page }) => {
      const section = page.locator('[data-testid="final-answer-section"]');
      await expect(section).toHaveScreenshot('final-answer-math.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });
  });

  test.describe('Practice Page Math Rendering', () => {
    test('practice page renders math correctly', async ({ page }) => {
      await navigateToPracticePage(page);

      // Wait for all math to be fully rendered
      await waitForAllMathRendered(page);

      // Verify math elements are present
      const mathElements = page.locator('.katex, .katex-display');
      const count = await mathElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('practice page with different chapters renders math', async ({ page }) => {
      // Test chapter 1 (Algebraic Foundations)
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      const mathElements = page.locator('.katex, .katex-display');
      const count = await mathElements.count();
      expect(count).toBeGreaterThan(0);

      // Test chapter 2 (Trigonometry)
      await navigateToPracticePage(page, 2);
      await waitForAllMathRendered(page);

      const mathElementsCh2 = page.locator('.katex, .katex-display');
      const countCh2 = await mathElementsCh2.count();
      expect(countCh2).toBeGreaterThan(0);
    });

    test('difficulty changes preserve math rendering', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Find difficulty buttons using more flexible selector
      const difficultyButtons = page.getByRole('button').filter({
        hasText: /easy|medium|hard/i,
      });

      // Change to a different difficulty if buttons exist
      const count = await difficultyButtons.count();
      if (count > 1) {
        await difficultyButtons.nth(1).click();
        await page.waitForTimeout(1000);
        await waitForAllMathRendered(page);

        // Verify math is still rendered
        const mathElements = page.locator('.katex, .katex-display');
        await expect(mathElements.first()).toBeVisible();
      }
    });
  });

  test.describe('Step-by-Step Solution Math Rendering', () => {
    test('solution panel renders math correctly', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps to trigger all math rendering
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(1000);
      await waitForAllMathRendered(page);

      // Verify solution panel has math
      const solutionPanel = page.locator('text=Solution').first().locator('..');
      const mathInSolution = solutionPanel.locator('.katex');
      await expect(mathInSolution.first()).toBeVisible();
    });

    test('individual steps render math when revealed', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Get first step and reveal it
      const firstStep = page.locator('[role="listitem"]').first();

      // Check if step exists before clicking
      if (await firstStep.isVisible().catch(() => false)) {
        await firstStep.click();
        await page.waitForTimeout(500);
        await waitForAllMathRendered(page);

        // Verify math is rendered in the step
        const stepContent = page.locator('[id^="step-content-"]').first();
        const mathInStep = stepContent.locator('.katex');
        await expect(mathInStep).toBeVisible();
      }
    });

    test('final answer renders with KaTeX', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps using flexible selector
      const revealAllButton = page.getByRole('button').filter({ hasText: /reveal all/i });
      if (await revealAllButton.isVisible().catch(() => false)) {
        await revealAllButton.click();
        await page.waitForTimeout(1000);
      }

      // Final answer section should have KaTeX (use data-testid for reliability)
      const answerSection = page.locator('[data-testid="final-answer-value"]').first();
      await expect(answerSection).toBeVisible();

      const katexInAnswer = answerSection.locator('.katex');
      await expect(katexInAnswer).toBeVisible();
    });
  });

  test.describe('Mixed Content Text and Math', () => {
    test('text and inline math render together', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Look for elements that contain both text and math
      const mixedContent = page.locator('.katex').first();
      await expect(mixedContent).toBeVisible();

      // Verify the parent container has text content
      const parent = mixedContent.locator('..');
      const textContent = await parent.textContent();
      expect(textContent).toBeTruthy();
      expect(textContent!.length).toBeGreaterThan(0);
    });

    test('display mode math renders correctly', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Check for display mode math (centered, block-level)
      const displayMath = page.locator('.katex-display');
      const count = await displayMath.count();

      // Display math may or may not be present depending on the exercise
      // If present, verify it's visible and properly styled
      if (count > 0) {
        await expect(displayMath.first()).toBeVisible();
      }

      // Always verify that inline math is present
      const inlineMath = page.locator('.katex:not(.katex-display)');
      await expect(inlineMath.first()).toBeVisible();
    });

    test('math in hints renders correctly', async ({ page }) => {
      await navigateToPracticePage(page, 1);

      // Show hint if available
      const hintButton = page.getByRole('button', { name: /show hint/i });
      if (await hintButton.isVisible().catch(() => false)) {
        await hintButton.click();
        await page.waitForTimeout(500);
        await waitForAllMathRendered(page);

        // Verify math in hint
        const hintMath = page.locator('[class*="hint"] .katex, [class*="Hint"] .katex');
        const count = await hintMath.count();

        // Hints may or may not have math, but if they do, it should render
        if (count > 0) {
          await expect(hintMath.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('KaTeX Error Monitoring', () => {
    test('no KaTeX errors on static test page', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/test/math-display');
      await waitForAllMathRendered(page);

      const katexErrors = checkKaTeXErrors(errors);
      expect(katexErrors).toHaveLength(0);
    });

    test('no KaTeX errors on practice page load', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      const katexErrors = checkKaTeXErrors(errors);
      expect(katexErrors).toHaveLength(0);
    });

    test('no KaTeX errors when revealing solution steps', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await navigateToPracticePage(page, 1);
      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      const revealAllButton = page.getByRole('button').filter({ hasText: /reveal all/i });
      if (await revealAllButton.isVisible().catch(() => false)) {
        await revealAllButton.click();
        await page.waitForTimeout(1000);
        await waitForAllMathRendered(page);
      }

      const katexErrors = checkKaTeXErrors(errors);
      expect(katexErrors).toHaveLength(0);
    });

    test('no KaTeX errors when changing exercises', async ({ page }) => {
      const errors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // Click new question multiple times
      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: /new question/i }).click();
        await page.waitForTimeout(1500);
        await waitForAllMathRendered(page);
      }

      const katexErrors = checkKaTeXErrors(errors);
      expect(katexErrors).toHaveLength(0);
    });
  });

  test.describe('Accessibility - Math Elements', () => {
    test('math elements are visible to screen readers', async ({ page }) => {
      await navigateToPracticePage(page, 1);
      await waitForAllMathRendered(page);

      // KaTeX generates elements with proper structure
      const katexElements = page.locator('.katex');
      const count = await katexElements.count();
      expect(count).toBeGreaterThan(0);

      // Each element should be visible
      for (let i = 0; i < Math.min(count, 5); i++) {
        await expect(katexElements.nth(i)).toBeVisible();
      }
    });

    test('math rendering does not cause layout shift', async ({ page }) => {
      await page.goto('/test/math-display');
      await page.waitForSelector('text=Math Display Test Page', { timeout: 10000 });

      // Measure layout stability
      const layoutShifts = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let shiftCount = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift') {
                shiftCount++;
              }
            }
          });
          observer.observe({ entryTypes: ['layout-shift'] as any });

          // Check after 2 seconds
          setTimeout(() => {
            observer.disconnect();
            resolve(shiftCount);
          }, 2000);
        });
      });

      // Math rendering should not cause excessive layout shifts
      expect(layoutShifts).toBeLessThan(10);
    });
  });
});
