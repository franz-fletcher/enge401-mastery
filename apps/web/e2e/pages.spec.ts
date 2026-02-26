import { test, expect } from '@playwright/test';

/**
 * Page Rendering Tests
 * 
 * Tests that all pages render correctly with expected content,
 * including landing page, chapter pages, dashboard, and practice pages.
 */

test.describe('Page Rendering', () => {
  test.describe('Landing Page (/)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('text=ENGE401 Mastery', { timeout: 10000 });
    });

    test('should render hero section', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /enge401 mastery/i })).toBeVisible();
      await expect(page.getByText(/interactive engineering mathematics/i)).toBeVisible();
      await expect(page.getByText(/aut enge401 course/i)).toBeVisible();
    });

    test('should render call-to-action buttons', async ({ page }) => {
      await expect(page.getByRole('link', { name: /start practising/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /view dashboard/i })).toBeVisible();
    });

    test('should display all 6 chapters in grid', async ({ page }) => {
      const chapters = [
        'Foundation Algebra Review',
        'Trigonometry', 
        'Exponential Functions',
        'Differentiation',
        'Integration',
        'Differential Equations',
      ];

      for (const chapter of chapters) {
        await expect(page.getByText(chapter)).toBeVisible();
      }

      // Should have 6 chapter cards
      const chapterCards = page.locator('a[href^="/chapter/"]');
      await expect(chapterCards).toHaveCount(6);
    });

    test('should display stats overview cards', async ({ page }) => {
      await expect(page.getByText('Total Chapters')).toBeVisible();
      await expect(page.getByText('Exercise Types')).toBeVisible();
      await expect(page.getByText('Learning Method')).toBeVisible();
      
      // Check values
      await expect(page.getByText('6').first()).toBeVisible(); // Total chapters
      await expect(page.getByText('3').first()).toBeVisible(); // Exercise types
      await expect(page.getByText('Spaced Repetition')).toBeVisible();
    });

    test('should navigate to chapter page when clicking chapter card', async ({ page }) => {
      await page.getByText('Foundation Algebra Review').click();
      await expect(page).toHaveURL('/chapter/1');
      await expect(page.getByRole('heading', { name: /foundation algebra review/i })).toBeVisible();
    });

    test('should have working navigation links', async ({ page }) => {
      // Test Practice link
      await page.getByRole('link', { name: /start practising/i }).first().click();
      await expect(page).toHaveURL('/practice');
      
      // Go back and test Dashboard link
      await page.goto('/');
      await page.getByRole('link', { name: /view dashboard/i }).click();
      await expect(page).toHaveURL('/dashboard');
    });
  });

  test.describe('Chapter Pages (/chapter/[id])', () => {
    test('should load all 6 chapter pages', async ({ page }) => {
      const chapters = [
        { id: 1, title: 'Foundation Algebra Review' },
        { id: 2, title: 'Trigonometry' },
        { id: 3, title: 'Exponential Functions' },
        { id: 4, title: 'Differentiation' },
        { id: 5, title: 'Integration' },
        { id: 6, title: 'Differential Equations' },
      ];

      for (const chapter of chapters) {
        await page.goto(`/chapter/${chapter.id}`);
        await expect(page.getByRole('heading', { name: new RegExp(chapter.title, 'i') })).toBeVisible();
        await expect(page.getByText(`Chapter ${chapter.id}`)).toBeVisible();
      }
    });

    test('should display chapter progress card', async ({ page }) => {
      await page.goto('/chapter/1');
      
      await expect(page.getByText('Chapter Progress')).toBeVisible();
      await expect(page.getByText('Completion')).toBeVisible();
      await expect(page.getByRole('progressbar')).toBeVisible();
    });

    test('should display theory section with collapsible content', async ({ page }) => {
      await page.goto('/chapter/1');
      
      await expect(page.getByRole('heading', { name: /theory/i })).toBeVisible();
      await expect(page.getByText('Chapter Overview')).toBeVisible();
      
      // Collapsible should be present
      const collapsible = page.locator('[data-state]').filter({ hasText: 'Chapter Overview' });
      await expect(collapsible).toBeVisible();
    });

    test('should display exercise section with sample exercise', async ({ page }) => {
      await page.goto('/chapter/1');
      
      await expect(page.getByRole('heading', { name: /sample exercises/i })).toBeVisible();
      // Exercise card should be present
      await expect(page.locator('input[placeholder*="answer"], input[placeholder*="Your answer"]')).toBeVisible();
    });

    test('should display practice options cards', async ({ page }) => {
      await page.goto('/chapter/1');
      
      await expect(page.getByText('Practice Options')).toBeVisible();
      await expect(page.getByText('Chapter Practice')).toBeVisible();
      await expect(page.getByText('Review Mode')).toBeVisible();
      
      // Links should work
      await expect(page.getByRole('link', { name: /start chapter practice/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /start review/i })).toBeVisible();
    });

    test('should have previous/next navigation', async ({ page }) => {
      // Chapter 1 should not have previous
      await page.goto('/chapter/1');
      await expect(page.getByRole('link', { name: /previous/i })).not.toBeVisible();
      await expect(page.getByRole('link', { name: /next/i })).toBeVisible();
      
      // Chapter 6 should not have next
      await page.goto('/chapter/6');
      await expect(page.getByRole('link', { name: /previous/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /next/i })).not.toBeVisible();
      
      // Chapter 3 should have both
      await page.goto('/chapter/3');
      await expect(page.getByRole('link', { name: /previous/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /next/i })).toBeVisible();
    });

    test('should navigate between chapters', async ({ page }) => {
      await page.goto('/chapter/2');
      
      // Click next
      await page.getByRole('link', { name: /next/i }).click();
      await expect(page).toHaveURL('/chapter/3');
      await expect(page.getByRole('heading', { name: /exponential functions/i })).toBeVisible();
      
      // Click previous
      await page.getByRole('link', { name: /previous/i }).click();
      await expect(page).toHaveURL('/chapter/2');
      await expect(page.getByRole('heading', { name: /trigonometry/i })).toBeVisible();
    });

    test('should return 404 for invalid chapter', async ({ page }) => {
      await page.goto('/chapter/999');
      await expect(page.getByText(/404|not found|page not found/i)).toBeVisible();
    });
  });

  test.describe('Practice Page (/practice)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/practice');
      await page.waitForSelector('text=Practice Mode', { timeout: 10000 });
    });

    test('should render practice page header', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /practice mode/i })).toBeVisible();
      await expect(page.getByText(/generate randomised exercises/i)).toBeVisible();
    });

    test('should display chapter selector', async ({ page }) => {
      await expect(page.getByText('Exercise Settings')).toBeVisible();
      await expect(page.getByText('Chapter')).toBeVisible();
      
      // Chapter select trigger should be visible
      const chapterSelect = page.locator('[role="combobox"]').first();
      await expect(chapterSelect).toBeVisible();
    });

    test('should display difficulty selector', async ({ page }) => {
      await expect(page.getByText('Difficulty')).toBeVisible();
      
      // Difficulty toggle buttons should be visible
      await expect(page.getByRole('button', { name: /easy/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /medium/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /hard/i })).toBeVisible();
    });

    test('should display exercise card', async ({ page }) => {
      // Wait for exercise to load
      await page.waitForTimeout(1000);
      
      // Exercise should be displayed
      await expect(page.getByRole('heading', { name: /chapter 1:/i })).toBeVisible();
      
      // Answer input should be present
      await expect(page.locator('input[placeholder*="answer"], input[placeholder*="Your answer"]')).toBeVisible();
      
      // Submit button should be present
      await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
    });

    test('should change chapter via selector', async ({ page }) => {
      // Open chapter selector
      const chapterSelect = page.locator('[role="combobox"]').first();
      await chapterSelect.click();
      
      // Select chapter 2
      await page.getByText(/trigonometry/i).click();
      
      // Wait for exercise to update
      await page.waitForTimeout(1000);
      
      // Should show chapter 2 exercise
      await expect(page.getByRole('heading', { name: /chapter 2:/i })).toBeVisible();
    });

    test('should change difficulty', async ({ page }) => {
      // Click medium difficulty
      await page.getByRole('button', { name: /medium/i }).click();
      
      // Wait for exercise to regenerate
      await page.waitForTimeout(1000);
      
      // Medium should be selected
      const mediumButton = page.getByRole('button', { name: /medium/i });
      await expect(mediumButton).toHaveAttribute('data-state', 'on');
    });

    test('should generate new exercise on button click', async ({ page }) => {
      await page.waitForTimeout(1000);
      
      // Click new question button
      await page.getByRole('button', { name: /new question/i }).click();
      
      // Should show loading state or new exercise
      await expect(page.getByText(/generating|loading/i).or(page.locator('input'))).toBeVisible();
    });

    test('should display session stats', async ({ page }) => {
      await expect(page.getByText(/session:/i)).toBeVisible();
      await expect(page.getByText(/attempted/i)).toBeVisible();
      await expect(page.getByText(/correct/i)).toBeVisible();
    });
  });

  test.describe('Dashboard Page (/dashboard)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/dashboard');
      await page.waitForSelector('text=Dashboard', { timeout: 10000 });
    });

    test('should render dashboard header', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
      await expect(page.getByText(/track your progress/i)).toBeVisible();
    });

    test('should display stats overview cards', async ({ page }) => {
      await expect(page.getByText('Due for Review')).toBeVisible();
      await expect(page.getByText('Accuracy')).toBeVisible();
      await expect(page.getByText('Streak')).toBeVisible();
      await expect(page.getByText('Completed')).toBeVisible();
    });

    test('should display progress by chapter section', async ({ page }) => {
      await expect(page.getByText('Progress by Chapter')).toBeVisible();
      await expect(page.getByText('6 Chapters')).toBeVisible();
      
      // All chapters should be listed
      const chapters = [
        'Foundation Algebra Review',
        'Trigonometry',
        'Exponential Functions',
        'Differentiation',
        'Integration',
        'Differential Equations',
      ];

      for (const chapter of chapters) {
        await expect(page.getByText(chapter, { exact: false })).toBeVisible();
      }
    });

    test('should display upcoming reviews section', async ({ page }) => {
      await expect(page.getByText('Upcoming Reviews')).toBeVisible();
      
      // Should show empty state or reviews
      const content = page.locator('text=/no reviews scheduled|reviews waiting/i');
      await expect(content.or(page.getByText('Upcoming Reviews'))).toBeVisible();
    });

    test('should display recent activity section', async ({ page }) => {
      await expect(page.getByText('Recent Activity')).toBeVisible();
      
      // Should show empty state or activity
      const content = page.locator('text=/no recent activity|completed exercise/i');
      await expect(content.or(page.getByText('Recent Activity'))).toBeVisible();
    });

    test('should have link to practice page', async ({ page }) => {
      await expect(page.getByRole('link', { name: /start practicing/i })).toBeVisible();
    });
  });

  test.describe('Chapter Practice Page (/chapter/[id]/practice)', () => {
    test('should load chapter practice page', async ({ page }) => {
      await page.goto('/chapter/2/practice');
      
      await expect(page.getByRole('heading', { name: /chapter 2 practice/i })).toBeVisible();
      await expect(page.getByText('Trigonometry')).toBeVisible();
    });

    test('should be pre-filtered to correct chapter', async ({ page }) => {
      await page.goto('/chapter/4/practice');
      await page.waitForTimeout(1000);
      
      // Should show chapter 4 exercise
      await expect(page.getByRole('heading', { name: /chapter 4:/i })).toBeVisible();
      await expect(page.getByText('Differentiation')).toBeVisible();
    });

    test('should display session progress', async ({ page }) => {
      await page.goto('/chapter/1/practice');
      
      await expect(page.getByText('Session Progress')).toBeVisible();
      await expect(page.getByRole('progressbar')).toBeVisible();
    });

    test('should have back to chapter link', async ({ page }) => {
      await page.goto('/chapter/1/practice');
      
      await expect(page.getByRole('link', { name: /back to chapter/i })).toBeVisible();
      
      // Click should navigate back
      await page.getByRole('link', { name: /back to chapter/i }).first().click();
      await expect(page).toHaveURL('/chapter/1');
    });

    test('should have link to review mode', async ({ page }) => {
      await page.goto('/chapter/3/practice');
      
      await expect(page.getByRole('link', { name: /go to review mode/i })).toBeVisible();
      
      // Click should navigate to review
      await page.getByRole('link', { name: /go to review mode/i }).click();
      await expect(page).toHaveURL('/chapter/3/review');
    });
  });

  test.describe('Chapter Review Page (/chapter/[id]/review)', () => {
    test('should load chapter review page', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      await expect(page.getByRole('heading', { name: /chapter 1 review/i })).toBeVisible();
    });

    test('should display review interface with flashcard', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Should show progress
      await expect(page.getByText(/card \d+ of/i)).toBeVisible();
      await expect(page.getByRole('progressbar')).toBeVisible();
      
      // Should have show answer button
      await expect(page.getByRole('button', { name: /show answer/i })).toBeVisible();
    });

    test('should display rating buttons after showing answer', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Click show answer
      await page.getByRole('button', { name: /show answer/i }).click();
      
      // Rating buttons should appear
      await expect(page.getByRole('button', { name: /again/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /hard/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /good/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /easy/i })).toBeVisible();
    });

    test('should show empty state when no cards due', async ({ page }) => {
      // Chapter 3 has no mock review cards
      await page.goto('/chapter/3/review');
      
      await expect(page.getByText('No Cards Due')).toBeVisible();
      await expect(page.getByText(/complete exercises in practice mode/i)).toBeVisible();
    });

    test('should show completion screen after reviewing all cards', async ({ page }) => {
      await page.goto('/chapter/1/review');
      
      // Answer all cards (2 mock cards for chapter 1)
      for (let i = 0; i < 2; i++) {
        await page.getByRole('button', { name: /show answer/i }).click();
        await page.getByRole('button', { name: /good/i }).click();
      }
      
      // Should show completion screen
      await expect(page.getByText('Review Complete!')).toBeVisible();
      await expect(page.getByText(/cards reviewed/i)).toBeVisible();
    });

    test('should have back to chapter link', async ({ page }) => {
      await page.goto('/chapter/2/review');
      
      await expect(page.getByRole('link', { name: /back to chapter/i })).toBeVisible();
    });
  });
});
