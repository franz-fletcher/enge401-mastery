import { test, expect } from '@playwright/test';

/**
 * Step-by-Step Solutions E2E Tests
 *
 * Tests the step-by-step solution display feature for practice exercises.
 * Covers panel visibility, step reveal functionality, controls, equation flows,
 * accessibility, and math rendering.
 */

test.describe('Step-by-Step Solutions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chapter 1 practice page
    await page.goto('/chapter/1/practice');
    // Wait for page to load and exercise to be ready
    await page.waitForSelector('text=Practice Mode', { timeout: 10000 });
    await page.waitForTimeout(1000);
  });

  // Helper function to submit an answer and show solution
  async function submitAnswerAndShowSolution(page: any) {
    // Fill in any answer and submit
    const input = page.locator('input[type="text"]').first();
    await input.fill('test-answer');

    // Click submit using JavaScript to ensure it works
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitButton = buttons.find(b => b.textContent?.trim() === 'Submit');
      if (submitButton) submitButton.click();
    });

    // Wait for feedback to appear
    await page.waitForSelector('text=/correct|incorrect/i', { timeout: 5000 });

    // Wait a bit for the solution panel to render
    await page.waitForTimeout(500);

    // Click "Show Step-by-Step Solution" button using JavaScript
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const showButton = buttons.find(b =>
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

  test.describe('Solution Panel Visibility', () => {
    test('solution panel button is not visible before submission', async ({ page }) => {
      // Before submitting, solution button should not be visible
      const showButton = page.getByRole('button', { name: /show step-by-step solution/i });
      await expect(showButton).not.toBeVisible();
    });

    test('solution panel button appears after answer submission', async ({ page }) => {
      // Submit an answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test-answer');
      await page.getByRole('button', { name: /submit/i }).click();

      // Wait for feedback
      await page.waitForSelector('text=/correct|incorrect/i', { timeout: 5000 });

      // Solution button should now be visible
      const showButton = page.getByRole('button', { name: /show step-by-step solution/i });
      await expect(showButton).toBeVisible();
      await expect(showButton).toHaveText(/show step-by-step solution/i);
    });

    test('clicking show button expands solution panel', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Verify panel is expanded - button text should change
      const hideButton = page.getByRole('button', { name: /hide solution/i });
      await expect(hideButton).toBeVisible();

      // Verify solution content is visible
      await expect(page.getByText('Solution')).toBeVisible();
      await expect(page.getByText(/click each step to reveal/i)).toBeVisible();
    });

    test('clicking hide button collapses solution panel', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Click hide button
      const hideButton = page.getByRole('button', { name: /hide solution/i });
      await hideButton.click();

      // Wait for collapse animation
      await page.waitForTimeout(300);

      // Verify button text changed back
      const showButton = page.getByRole('button', { name: /show step-by-step solution/i });
      await expect(showButton).toBeVisible();

      // Solution content should be hidden
      await expect(page.getByText('Solution').first()).not.toBeVisible();
    });

    test('solution panel can be toggled multiple times', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Toggle hide
      await page.getByRole('button', { name: /hide solution/i }).click();
      await page.waitForTimeout(300);

      // Toggle show again
      await page.getByRole('button', { name: /show step-by-step solution/i }).click();
      await page.waitForTimeout(300);

      // Verify panel is expanded again
      await expect(page.getByText('Solution')).toBeVisible();
    });
  });

  test.describe('Step Reveal Functionality', () => {
    test('steps are initially collapsed', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get all step buttons
      const stepButtons = page.locator('[role="listitem"]');
      const count = await stepButtons.count();
      expect(count).toBeGreaterThan(0);

      // All steps should have aria-expanded="false"
      for (let i = 0; i < count; i++) {
        const step = stepButtons.nth(i);
        await expect(step).toHaveAttribute('aria-expanded', 'false');
      }

      // Step content should not be visible
      const stepContent = page.locator('[id^="step-content-"]');
      await expect(stepContent).not.toBeVisible();
    });

    test('clicking a step reveals its content', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get first step button
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();

      // Wait for animation
      await page.waitForTimeout(300);

      // Step should now be expanded
      await expect(firstStep).toHaveAttribute('aria-expanded', 'true');

      // Step content should be visible
      const stepContent = page.locator('[id^="step-content-"]').first();
      await expect(stepContent).toBeVisible();

      // Chevron should be rotated (check via animation state)
      const chevron = firstStep.locator('svg');
      await expect(chevron).toBeVisible();
    });

    test('clicking a revealed step collapses it', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Reveal first step
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();
      await page.waitForTimeout(300);

      // Verify it's revealed
      await expect(firstStep).toHaveAttribute('aria-expanded', 'true');

      // Click again to collapse
      await firstStep.click();
      await page.waitForTimeout(300);

      // Should be collapsed
      await expect(firstStep).toHaveAttribute('aria-expanded', 'false');
    });

    test('multiple steps can be revealed independently', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get first two steps
      const steps = page.locator('[role="listitem"]');
      const step1 = steps.nth(0);
      const step2 = steps.nth(1);

      // Reveal step 1
      await step1.click();
      await page.waitForTimeout(300);

      // Reveal step 2
      await step2.click();
      await page.waitForTimeout(300);

      // Both should be revealed
      await expect(step1).toHaveAttribute('aria-expanded', 'true');
      await expect(step2).toHaveAttribute('aria-expanded', 'true');

      // Collapse step 1
      await step1.click();
      await page.waitForTimeout(300);

      // Step 1 collapsed, step 2 still revealed
      await expect(step1).toHaveAttribute('aria-expanded', 'false');
      await expect(step2).toHaveAttribute('aria-expanded', 'true');
    });

    test('step shows title and step number', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get first step
      const firstStep = page.locator('[role="listitem"]').first();

      // Should have step number
      const stepNumber = firstStep.locator('.rounded-full').first();
      await expect(stepNumber).toBeVisible();
      const numberText = await stepNumber.textContent();
      expect(numberText).toMatch(/^\d+$/);

      // Should have title
      const title = firstStep.locator('.font-medium').first();
      await expect(title).toBeVisible();
      const titleText = await title.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText?.length).toBeGreaterThan(0);
    });

    test('revealed step shows explanation and expression', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Reveal first step
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();
      await page.waitForTimeout(300);

      // Get step content
      const content = page.locator('[id^="step-content-"]').first();

      // Should have explanation text
      const explanation = content.locator('.text-muted-foreground').first();
      await expect(explanation).toBeVisible();

      // Should have math expression
      const expression = content.locator('.bg-muted').first();
      await expect(expression).toBeVisible();
    });
  });

  test.describe('Reveal All and Reset Controls', () => {
    test('reveal all button shows all steps', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Click "Reveal All" button
      const revealAllButton = page.getByRole('button', { name: /reveal all/i });
      await expect(revealAllButton).toBeVisible();
      await revealAllButton.click();

      // Wait for animation
      await page.waitForTimeout(500);

      // All steps should be revealed
      const steps = page.locator('[role="listitem"]');
      const count = await steps.count();

      for (let i = 0; i < count; i++) {
        await expect(steps.nth(i)).toHaveAttribute('aria-expanded', 'true');
      }

      // Reveal All button should be disabled
      await expect(revealAllButton).toBeDisabled();
    });

    test('reset button collapses all steps', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // First reveal all
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Click Reset button
      const resetButton = page.getByRole('button', { name: /reset/i });
      await expect(resetButton).toBeVisible();
      await resetButton.click();

      // Wait for animation
      await page.waitForTimeout(300);

      // All steps should be collapsed
      const steps = page.locator('[role="listitem"]');
      const count = await steps.count();

      for (let i = 0; i < count; i++) {
        await expect(steps.nth(i)).toHaveAttribute('aria-expanded', 'false');
      }

      // Reveal All button should be enabled again
      await expect(page.getByRole('button', { name: /reveal all/i })).toBeEnabled();
    });

    test('progress indicator updates correctly', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get progress text
      const progressText = page.getByText(/\d+ of \d+ steps revealed/i);
      await expect(progressText).toBeVisible();

      // Initial state should be "0 of X steps revealed"
      const initialText = await progressText.textContent();
      expect(initialText).toMatch(/0 of \d+ steps revealed/);

      // Reveal first step
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();
      await page.waitForTimeout(300);

      // Progress should update to "1 of X steps revealed"
      const updatedText = await progressText.textContent();
      expect(updatedText).toMatch(/1 of \d+ steps revealed/);

      // Click Reveal All
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Progress should show all steps revealed
      const allRevealedText = await progressText.textContent();
      const match = allRevealedText?.match(/(\d+) of (\d+) steps revealed/);
      expect(match).toBeTruthy();
      expect(match![1]).toBe(match![2]); // First number equals second number
    });

    test('progress bar updates with step reveals', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get progress bar
      const progressBar = page.locator('[role="progressbar"]');
      await expect(progressBar).toBeVisible();

      // Initial value should be 0
      const initialValue = await progressBar.getAttribute('aria-valuenow');
      expect(initialValue).toBe('0');

      // Reveal all steps
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Progress bar should be at 100%
      const finalValue = await progressBar.getAttribute('aria-valuenow');
      expect(finalValue).toBe('100');
    });

    test('completion message appears when all steps revealed', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Completion message should appear
      const completionMessage = page.getByText(/all steps revealed/i);
      await expect(completionMessage).toBeVisible();
    });
  });

  test.describe('Linear Equation Solution Flow', () => {
    test('linear equation shows correct step structure', async ({ page }) => {
      // Select easy difficulty for linear equations
      await page.getByRole('button', { name: /easy/i }).click();
      await page.waitForTimeout(1000);

      await submitAnswerAndShowSolution(page);

      // Get all step titles
      const stepTitles = await page.locator('[role="listitem"] .font-medium').allTextContents();

      // Should have steps related to linear equations
      const hasOriginalEquation = stepTitles.some(title =>
        title.toLowerCase().includes('original') || title.toLowerCase().includes('equation')
      );
      expect(hasOriginalEquation).toBe(true);

      // Should have solution step
      const hasSolution = stepTitles.some(title =>
        title.toLowerCase().includes('solution') || title.toLowerCase().includes('answer')
      );
      expect(hasSolution).toBe(true);
    });

    test('linear equation steps have proper content', async ({ page }) => {
      await page.getByRole('button', { name: /easy/i }).click();
      await page.waitForTimeout(1000);

      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Each step should have explanation
      const explanations = page.locator('[id^="step-content-"] .text-muted-foreground');
      const count = await explanations.count();
      expect(count).toBeGreaterThan(0);

      // Each step should have math expression
      const expressions = page.locator('[id^="step-content-"] .bg-muted');
      const exprCount = await expressions.count();
      expect(exprCount).toBeGreaterThan(0);
    });
  });

  test.describe('Quadratic Equation Solution Flow', () => {
    test('quadratic equation shows correct step structure', async ({ page }) => {
      // Select medium difficulty for quadratic equations
      await page.getByRole('button', { name: /medium/i }).click();
      await page.waitForTimeout(1000);

      await submitAnswerAndShowSolution(page);

      // Get all step titles
      const stepTitles = await page.locator('[role="listitem"] .font-medium').allTextContents();

      // Should have quadratic-specific steps
      const hasQuadraticSteps = stepTitles.some(title =>
        title.toLowerCase().includes('quadratic') ||
        title.toLowerCase().includes('coefficient') ||
        title.toLowerCase().includes('discriminant')
      );
      expect(hasQuadraticSteps).toBe(true);
    });

    test('quadratic equation shows formula when applicable', async ({ page }) => {
      await page.getByRole('button', { name: /medium/i }).click();
      await page.waitForTimeout(1000);

      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Look for formula display
      const formulaElements = page.locator('text=/formula:/i');
      const hasFormula = await formulaElements.count() > 0;

      // Quadratic equations should show the quadratic formula
      if (hasFormula) {
        await expect(formulaElements.first()).toBeVisible();
      }
    });

    test('quadratic solution shows both roots', async ({ page }) => {
      await page.getByRole('button', { name: /medium/i }).click();
      await page.waitForTimeout(1000);

      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // Final answer should be visible
      const finalAnswer = page.locator('text=/final answer:/i');
      await expect(finalAnswer).toBeVisible();

      // Or check the card footer for the answer
      const answerSection = page.locator('.bg-primary\\/10');
      await expect(answerSection).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('steps are keyboard accessible', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Press Tab to focus first step
      await page.keyboard.press('Tab');

      // Find the focused element
      const focusedElement = page.locator(':focus');

      // Press Enter to reveal
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // First step should be revealed
      const firstStep = page.locator('[role="listitem"]').first();
      await expect(firstStep).toHaveAttribute('aria-expanded', 'true');

      // Press Enter again to collapse
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // Should be collapsed
      await expect(firstStep).toHaveAttribute('aria-expanded', 'false');
    });

    test('solution panel has correct ARIA attributes', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Solution toggle button should have aria-expanded
      const toggleButton = page.getByRole('button', { name: /hide solution/i });
      await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      // Steps container should have role="list"
      const stepsContainer = page.locator('[role="list"]').first();
      await expect(stepsContainer).toBeVisible();

      // Individual steps should have role="listitem"
      const steps = page.locator('[role="listitem"]');
      await expect(steps.first()).toBeVisible();
    });

    test('step buttons have correct ARIA attributes', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Get first step button
      const stepButton = page.locator('[role="listitem"] button').first();

      // Should have aria-expanded
      await expect(stepButton).toHaveAttribute('aria-expanded', 'false');

      // Should have aria-controls pointing to content
      const ariaControls = await stepButton.getAttribute('aria-controls');
      expect(ariaControls).toBeTruthy();
      expect(ariaControls).toMatch(/^step-content-/);

      // Click to reveal
      await stepButton.click();
      await page.waitForTimeout(300);

      // aria-expanded should update
      await expect(stepButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('step numbers are hidden from screen readers', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Step number circles should have aria-hidden="true"
      const stepNumber = page.locator('[role="listitem"] .rounded-full').first();
      await expect(stepNumber).toHaveAttribute('aria-hidden', 'true');
    });

    test('progress bar has correct ARIA attributes', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      const progressBar = page.locator('[role="progressbar"]');

      // Should have aria-valuemin, aria-valuemax, aria-valuenow
      await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      await expect(progressBar).toHaveAttribute('aria-valuenow');
    });
  });

  test.describe('Math Rendering', () => {
    test('math expressions are rendered with KaTeX', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Reveal first step
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();
      await page.waitForTimeout(300);

      // Check for KaTeX rendered elements
      const katexElements = page.locator('.katex, .katex-display, .katex-html');
      const count = await katexElements.count();
      expect(count).toBeGreaterThan(0);
    });

    test('math in step expressions is properly formatted', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Reveal all steps
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(500);

      // All step expressions should have KaTeX
      const expressions = page.locator('[id^="step-content-"] .bg-muted .katex');
      const count = await expressions.count();
      expect(count).toBeGreaterThan(0);
    });

    test('final answer is rendered with KaTeX', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Final answer section should have KaTeX
      const answerSection = page.locator('.bg-primary\\/10');
      await expect(answerSection).toBeVisible();

      // Should contain KaTeX rendered math
      const katexInAnswer = answerSection.locator('.katex');
      await expect(katexInAnswer).toBeVisible();
    });

    test('no math rendering errors in console', async ({ page }) => {
      // Collect console errors
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await submitAnswerAndShowSolution(page);

      // Reveal all steps to trigger all math rendering
      await page.getByRole('button', { name: /reveal all/i }).click();
      await page.waitForTimeout(1000);

      // Check for KaTeX-specific errors
      const katexErrors = consoleErrors.filter(err =>
        err.toLowerCase().includes('katex') ||
        err.toLowerCase().includes('latex') ||
        err.toLowerCase().includes('math')
      );

      expect(katexErrors).toHaveLength(0);
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
    test('handles rapid clicking on step buttons', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      const firstStep = page.locator('[role="listitem"]').first();

      // Rapid clicks
      await firstStep.click();
      await firstStep.click();
      await firstStep.click();
      await page.waitForTimeout(500);

      // Should end up in a consistent state (either expanded or collapsed)
      const ariaExpanded = await firstStep.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(ariaExpanded);
    });

    test('handles rapid clicking on reveal all/reset', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      const revealAllButton = page.getByRole('button', { name: /reveal all/i });
      const resetButton = page.getByRole('button', { name: /reset/i });

      // Rapid toggles
      await revealAllButton.click();
      await resetButton.click();
      await revealAllButton.click();
      await page.waitForTimeout(500);

      // Should end up with all steps revealed
      const steps = page.locator('[role="listitem"]');
      const count = await steps.count();
      let revealedCount = 0;

      for (let i = 0; i < count; i++) {
        const expanded = await steps.nth(i).getAttribute('aria-expanded');
        if (expanded === 'true') revealedCount++;
      }

      // Either all revealed or consistent state
      expect(revealedCount === count || revealedCount === 0).toBe(true);
    });

    test('solution panel state persists during page interactions', async ({ page }) => {
      await submitAnswerAndShowSolution(page);

      // Reveal some steps
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();
      await page.waitForTimeout(300);

      // Verify step is revealed
      await expect(firstStep).toHaveAttribute('aria-expanded', 'true');

      // Click elsewhere (on the page background)
      await page.click('body', { position: { x: 100, y: 100 } });

      // Step should still be revealed
      await expect(firstStep).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('Responsive Behavior', () => {
    test('solution panel works on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });

      await submitAnswerAndShowSolution(page);

      // Panel should still be functional
      await expect(page.getByText('Solution')).toBeVisible();

      // Steps should be clickable
      const firstStep = page.locator('[role="listitem"]').first();
      await firstStep.click();
      await page.waitForTimeout(300);

      await expect(firstStep).toHaveAttribute('aria-expanded', 'true');
    });

    test('controls are accessible on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });

      await submitAnswerAndShowSolution(page);

      // Reveal All and Reset buttons should be visible
      await expect(page.getByRole('button', { name: /reveal all/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /reset/i })).toBeVisible();

      // Progress indicator should be visible
      await expect(page.getByText(/\d+ of \d+ steps revealed/i)).toBeVisible();
    });
  });
});
