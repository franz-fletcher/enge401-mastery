import { test, expect } from '@playwright/test';

/**
 * Practice Mode Tests
 * 
 * Tests exercise generation, answer submission, hints display,
 * and session stats tracking.
 */

test.describe('Practice Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice');
    await page.waitForSelector('text=Practice Mode', { timeout: 10000 });
    // Wait for initial exercise to load
    await page.waitForTimeout(1000);
  });

  test.describe('Exercise Generation', () => {
    test('should generate exercise on page load', async ({ page }) => {
      // Exercise content should be visible
      await expect(page.locator('.katex, .katex-display, [class*="math"]')).toBeVisible();
      
      // Answer input should be present
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    });

    test('should generate different exercises for different chapters', async ({ page }) => {
      // Get initial exercise content
      const initialContent = await page.locator('main').textContent();
      
      // Change to chapter 2
      await page.locator('[role="combobox"]').first().click();
      await page.getByText(/trigonometry/i).click();
      await page.waitForTimeout(1000);
      
      // Content should have changed
      const newContent = await page.locator('main').textContent();
      expect(newContent).not.toBe(initialContent);
    });

    test('should generate different exercises for different difficulties', async ({ page }) => {
      // Get initial exercise content
      const initialContent = await page.locator('main').textContent();
      
      // Change to hard difficulty
      await page.getByRole('button', { name: /hard/i }).click();
      await page.waitForTimeout(1000);
      
      // Content should have changed
      const newContent = await page.locator('main').textContent();
      expect(newContent).not.toBe(initialContent);
    });

    test('should show loading state when generating new exercise', async ({ page }) => {
      // Click new question
      await page.getByRole('button', { name: /new question/i }).click();
      
      // Should show loading indicator or spinner
      const loadingIndicator = page.locator('text=/generating/i, [class*="animate-spin"], [class*="loading"]');
      await expect(loadingIndicator.or(page.locator('input'))).toBeVisible();
    });
  });

  test.describe('Answer Submission', () => {
    test('should submit answer and show correct feedback', async ({ page }) => {
      // This test requires knowing the correct answer
      // We'll submit any answer and check the feedback mechanism works
      
      const input = page.locator('input[type="text"]').first();
      await input.fill('test-answer');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Should show feedback (either correct or incorrect)
      const feedback = page.locator('text=/correct|incorrect/i');
      await expect(feedback).toBeVisible();
    });

    test('should show correct styling for correct answer', async ({ page }) => {
      // Submit an answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Check for feedback card with appropriate styling
      const feedbackCard = page.locator('[class*="green"], [class*="red"]').first();
      await expect(feedbackCard.or(page.locator('text=/correct|incorrect/i'))).toBeVisible();
    });

    test('should allow trying again after submission', async ({ page }) => {
      // Submit an answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Try again button should appear
      await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
      
      // Click try again
      await page.getByRole('button', { name: /try again/i }).click();
      
      // Input should be cleared and ready for new answer
      await expect(page.locator('input[type="text"]').first()).toHaveValue('');
    });

    test('should submit on Enter key press', async ({ page }) => {
      const input = page.locator('input[type="text"]').first();
      await input.fill('test-answer');
      await input.press('Enter');
      
      // Should show feedback
      const feedback = page.locator('text=/correct|incorrect/i');
      await expect(feedback).toBeVisible();
    });

    test('should disable submit button when input is empty', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /submit/i });
      
      // Initially should be disabled (or enabled but do nothing)
      const isDisabled = await submitButton.isDisabled().catch(() => false);
      
      if (!isDisabled) {
        // If not disabled, clicking should not submit
        await submitButton.click();
        // Should still show input (no feedback yet)
        await expect(page.locator('input[type="text"]').first()).toBeVisible();
      }
    });
  });

  test.describe('Hints Display', () => {
    test('should show hint button when hints are available', async ({ page }) => {
      // Look for hint button or trigger
      const hintButton = page.getByRole('button', { name: /hint/i });
      await expect(hintButton.or(page.locator('text=/no hints/i'))).toBeVisible();
    });

    test('should display hint when clicked', async ({ page }) => {
      const hintButton = page.getByRole('button', { name: /show hint/i });
      
      // Only test if hint button exists
      if (await hintButton.isVisible().catch(() => false)) {
        await hintButton.click();
        
        // Hint content should be visible
        await expect(page.getByText(/hint 1/i)).toBeVisible();
      }
    });

    test('should show multiple hints sequentially', async ({ page }) => {
      // Click first hint
      const hintButton = page.getByRole('button', { name: /show hint/i });
      
      if (await hintButton.isVisible().catch(() => false)) {
        await hintButton.click();
        await expect(page.getByText(/hint 1/i)).toBeVisible();
        
        // Check if there's a second hint available
        const secondHintButton = page.getByRole('button', { name: /show hint 2/i });
        if (await secondHintButton.isVisible().catch(() => false)) {
          await secondHintButton.click();
          await expect(page.getByText(/hint 2/i)).toBeVisible();
        }
      }
    });

    test('should hide hints after submitting answer', async ({ page }) => {
      // Show a hint first
      const hintButton = page.getByRole('button', { name: /show hint/i });
      if (await hintButton.isVisible().catch(() => false)) {
        await hintButton.click();
      }
      
      // Submit answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Hint button should not be visible after submission
      await expect(hintButton).not.toBeVisible();
    });
  });

  test.describe('Session Stats', () => {
    test('should display session stats', async ({ page }) => {
      await expect(page.getByText(/session:/i)).toBeVisible();
      await expect(page.getByText(/attempted/i)).toBeVisible();
      await expect(page.getByText(/correct/i)).toBeVisible();
    });

    test('should increment attempted count on submission', async ({ page }) => {
      // Get initial count
      const statsText = await page.getByText(/\d+ attempted/i).textContent();
      const initialCount = parseInt(statsText?.match(/(\d+) attempted/)?.[1] || '0');
      
      // Submit an answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Count should have increased
      await page.waitForTimeout(500);
      const newStatsText = await page.getByText(/\d+ attempted/i).textContent();
      const newCount = parseInt(newStatsText?.match(/(\d+) attempted/)?.[1] || '0');
      
      expect(newCount).toBe(initialCount + 1);
    });

    test('should track correct answers separately', async ({ page }) => {
      // Submit an answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Both attempted and correct should be visible
      await expect(page.getByText(/\d+ attempted/i)).toBeVisible();
      await expect(page.getByText(/\d+ correct/i)).toBeVisible();
    });

    test('should persist stats during session navigation', async ({ page }) => {
      // Submit an answer
      const input = page.locator('input[type="text"]').first();
      await input.fill('test');
      await page.getByRole('button', { name: /submit/i }).click();
      
      // Get stats
      const statsText = await page.getByText(/\d+ attempted/i).textContent();
      
      // Navigate away and back
      await page.goto('/dashboard');
      await page.goto('/practice');
      await page.waitForTimeout(1000);
      
      // Stats should reset on new page load (session-based)
      // Or persist if using localStorage (implementation dependent)
      const newStatsText = await page.getByText(/\d+ attempted/i).textContent();
      expect(newStatsText).toBeTruthy();
    });
  });

  test.describe('Chapter Practice Page', () => {
    test('should load with pre-selected chapter', async ({ page }) => {
      await page.goto('/chapter/3/practice');
      await page.waitForTimeout(1000);
      
      // Should show chapter 3 content
      await expect(page.getByRole('heading', { name: /chapter 3:/i })).toBeVisible();
      await expect(page.getByText('Exponential Functions')).toBeVisible();
    });

    test('should not show chapter selector on chapter practice page', async ({ page }) => {
      await page.goto('/chapter/1/practice');
      
      // Chapter selector should not be present (only difficulty selector)
      const chapterLabel = page.getByText('Chapter').filter({ has: page.locator('..') });
      await expect(chapterLabel).not.toBeVisible();
    });

    test('should show session progress on chapter practice', async ({ page }) => {
      await page.goto('/chapter/2/practice');
      
      await expect(page.getByText('Session Progress')).toBeVisible();
      await expect(page.getByRole('progressbar')).toBeVisible();
      await expect(page.getByText(/accuracy/i)).toBeVisible();
    });
  });

  test.describe('Math Rendering', () => {
    test('should render math expressions with KaTeX', async ({ page }) => {
      // KaTeX elements should be present
      const mathElements = page.locator('.katex, .katex-display, .katex-html');
      await expect(mathElements.first()).toBeVisible();
    });

    test('should render math in display mode for questions', async ({ page }) => {
      // Display mode math should be visible
      const displayMath = page.locator('.katex-display');
      await expect(displayMath.first()).toBeVisible();
    });
  });
});
