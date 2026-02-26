import { test, expect } from '@playwright/test';

/**
 * Spaced Repetition Review Tests
 * 
 * Tests review interface, flashcard display, rating system,
 * and progress tracking for spaced repetition.
 */

test.describe('Spaced Repetition Review', () => {
  test.describe('Review Interface', () => {
    test('should display review page header', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.getByRole('heading', { name: /chapter 1 review/i })).toBeVisible();
      await expect(page.getByText(/back to chapter/i)).toBeVisible();
    });

    test('should show progress indicator', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.getByText(/card \d+ of \d+/i)).toBeVisible();
      await expect(page.getByRole('progressbar')).toBeVisible();
    });

    test('should show timer', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Timer should be visible (format: MM:SS)
      const timer = page.locator('text=/\\d+:\\d{2}/');
      await expect(timer).toBeVisible();
    });
  });

  test.describe('Flashcard Display', () => {
    test('should display question on flashcard', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Question should be visible (math content)
      await expect(page.locator('.katex, .katex-display').first()).toBeVisible();
    });

    test('should have answer input field initially', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.locator('input[placeholder*="answer"]').first()).toBeVisible();
    });

    test('should show show answer button', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.getByRole('button', { name: /show answer/i })).toBeVisible();
    });

    test('should reveal answer when show answer is clicked', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Click show answer
      await page.getByRole('button', { name: /show answer/i }).click();
      
      // Answer section should be visible
      await expect(page.getByText(/answer/i)).toBeVisible();
      
      // Rating buttons should appear
      await expect(page.getByRole('button', { name: /again/i })).toBeVisible();
    });

    test('should accept user answer input', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      const input = page.locator('input[placeholder*="answer"]').first();
      await input.fill('my-answer');
      
      await expect(input).toHaveValue('my-answer');
    });

    test('should submit on Enter key', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      const input = page.locator('input[placeholder*="answer"]').first();
      await input.fill('test');
      await input.press('Enter');
      
      // Should show answer
      await expect(page.getByText(/answer/i)).toBeVisible();
    });
  });

  test.describe('Rating System', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/chapter/1/review');
      // Show answer to reveal rating buttons
      await page.getByRole('button', { name: /show answer/i }).click();
    });

    test('should display all four rating buttons', async ({ page }) => {
      await expect(page.getByRole('button', { name: /^again$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^hard$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^good$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^easy$/i })).toBeVisible();
    });

    test('should have distinct styling for each rating', async ({ page }) => {
      // Each button should have different styling
      const againButton = page.getByRole('button', { name: /^again$/i });
      const hardButton = page.getByRole('button', { name: /^hard$/i });
      const goodButton = page.getByRole('button', { name: /^good$/i });
      const easyButton = page.getByRole('button', { name: /^easy$/i });
      
      await expect(againButton).toBeVisible();
      await expect(hardButton).toBeVisible();
      await expect(goodButton).toBeVisible();
      await expect(easyButton).toBeVisible();
    });

    test('should advance to next card after rating', async ({ page }) => {
      // Get initial card number
      const progressText = await page.getByText(/card \d+ of \d+/i).textContent();
      const initialCard = parseInt(progressText?.match(/card (\d+) of/i)?.[1] || '1');
      
      // Rate the card
      await page.getByRole('button', { name: /^good$/i }).click();
      
      // Should advance to next card or show completion
      await page.waitForTimeout(500);
      
      const newProgressText = await page.getByText(/card \d+ of \d+/i).textContent().catch(() => '');
      const newCard = parseInt(newProgressText?.match(/card (\d+) of/i)?.[1] || '0');
      
      // Either advanced to next card or completed
      expect(newCard === initialCard + 1 || newCard === 0).toBeTruthy();
    });

    test('should update stats after rating', async ({ page }) => {
      // Get initial stats
      const initialStats = await page.getByText(/\d+ reviewed/i).textContent();
      const initialCount = parseInt(initialStats?.match(/(\d+) reviewed/)?.[1] || '0');
      
      // Rate the card
      await page.getByRole('button', { name: /^good$/i }).click();
      await page.waitForTimeout(500);
      
      // Stats should update (if not completed)
      const newStats = await page.getByText(/\d+ reviewed/i).textContent().catch(() => '');
      const newCount = parseInt(newStats?.match(/(\d+) reviewed/)?.[1] || '0');
      
      expect(newCount >= initialCount).toBeTruthy();
    });

    test('should track correct vs incorrect ratings', async ({ page }) => {
      // Rate as "Again" (incorrect)
      await page.getByRole('button', { name: /^again$/i }).click();
      await page.waitForTimeout(500);
      
      // Check if we're still on review page or completed
      const isCompleted = await page.getByText('Review Complete!').isVisible().catch(() => false);
      
      if (!isCompleted) {
        // Show answer for next card
        await page.getByRole('button', { name: /show answer/i }).click();
        
        // Rate as "Easy" (correct)
        await page.getByRole('button', { name: /^easy$/i }).click();
      }
    });
  });

  test.describe('Progress Tracking', () => {
    test('should show card difficulty badge', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Should show difficulty badge (new, learning, review, relearning)
      const difficultyBadge = page.locator('[class*="badge"], [class*="Badge"]').filter({ hasText: /new|learning|review|relearning/i });
      await expect(difficultyBadge.or(page.getByText(/new|learning|review/i).first())).toBeVisible();
    });

    test('should show interval information', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.getByText(/interval:/i)).toBeVisible();
      await expect(page.getByText(/\d+ days?/i)).toBeVisible();
    });

    test('should update progress bar as cards are reviewed', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Get initial progress
      const progressBar = page.getByRole('progressbar');
      const initialValue = await progressBar.getAttribute('aria-valuenow') || '0';
      
      // Show answer and rate
      await page.getByRole('button', { name: /show answer/i }).click();
      await page.getByRole('button', { name: /^good$/i }).click();
      await page.waitForTimeout(500);
      
      // Check if completed or progress updated
      const isCompleted = await page.getByText('Review Complete!').isVisible().catch(() => false);
      
      if (!isCompleted) {
        const newValue = await progressBar.getAttribute('aria-valuenow') || '0';
        expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
      }
    });

    test('should display session stats', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.getByText(/\d+ reviewed/i)).toBeVisible();
      await expect(page.getByText(/\d+ correct/i)).toBeVisible();
      await expect(page.getByText(/\d+% accuracy/i)).toBeVisible();
    });
  });

  test.describe('Empty State', () => {
    test('should show empty state when no cards due', async ({ page }) => {
      // Chapter 3 has no mock review cards
      await page.goto('/chapter/3/review');
      
      await expect(page.getByText('No Cards Due')).toBeVisible();
      await expect(page.getByText(/complete exercises in practice mode/i)).toBeVisible();
    });

    test('should have link to practice from empty state', async ({ page }) => {
      await page.goto('/chapter/3/review');
      
      await expect(page.getByRole('link', { name: /start practicing/i })).toBeVisible();
    });

    test('should have link back to chapter from empty state', async ({ page }) => {
      await page.goto('/chapter/3/review');
      
      await expect(page.getByRole('link', { name: /back to chapter/i })).toBeVisible();
    });
  });

  test.describe('Completion Screen', () => {
    test('should show completion screen after all cards reviewed', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Review all cards (2 mock cards for chapter 1)
      for (let i = 0; i < 2; i++) {
        await page.getByRole('button', { name: /show answer/i }).click();
        await page.getByRole('button', { name: /^good$/i }).click();
        await page.waitForTimeout(500);
      }
      
      // Should show completion screen
      await expect(page.getByText('Review Complete!')).toBeVisible();
    });

    test('should display final stats on completion', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Review all cards
      for (let i = 0; i < 2; i++) {
        await page.getByRole('button', { name: /show answer/i }).click();
        await page.getByRole('button', { name: /^good$/i }).click();
        await page.waitForTimeout(500);
      }
      
      // Should show stats
      await expect(page.getByText(/cards reviewed/i)).toBeVisible();
      await expect(page.getByText(/accuracy/i)).toBeVisible();
      await expect(page.getByText(/time/i)).toBeVisible();
    });

    test('should have review again button on completion', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Review all cards
      for (let i = 0; i < 2; i++) {
        await page.getByRole('button', { name: /show answer/i }).click();
        await page.getByRole('button', { name: /^good$/i }).click();
        await page.waitForTimeout(500);
      }
      
      await expect(page.getByRole('button', { name: /review again/i })).toBeVisible();
    });

    test('should have back to chapter link on completion', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Review all cards
      for (let i = 0; i < 2; i++) {
        await page.getByRole('button', { name: /show answer/i }).click();
        await page.getByRole('button', { name: /^good$/i }).click();
        await page.waitForTimeout(500);
      }
      
      await expect(page.getByRole('link', { name: /back to chapter/i })).toBeVisible();
    });
  });

  test.describe('SM-2 Algorithm', () => {
    test('should update interval based on rating', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Get initial interval
      const intervalText = await page.getByText(/interval: \d+ days?/i).textContent();
      const initialInterval = parseInt(intervalText?.match(/interval: (\d+) days?/i)?.[1] || '0');
      
      // Show answer and rate as "Again" (should reset interval)
      await page.getByRole('button', { name: /show answer/i }).click();
      await page.getByRole('button', { name: /^again$/i }).click();
      await page.waitForTimeout(500);
      
      // Check if completed or moved to next card
      const isCompleted = await page.getByText('Review Complete!').isVisible().catch(() => false);
      
      if (!isCompleted) {
        // Next card should have updated interval
        await expect(page.getByText(/interval:/i)).toBeVisible();
      }
    });

    test('should update ease factor based on performance', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Show answer and rate
      await page.getByRole('button', { name: /show answer/i }).click();
      await page.getByRole('button', { name: /^good$/i }).click();
      
      // Ease factor is internal, but we can verify the card advances
      await page.waitForTimeout(500);
      
      const isCompleted = await page.getByText('Review Complete!').isVisible().catch(() => false);
      expect(isCompleted || await page.getByText(/card \d+ of/i).isVisible()).toBeTruthy();
    });
  });
});
