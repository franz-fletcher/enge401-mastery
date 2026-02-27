import { test, expect } from '@playwright/test';

/**
 * Navigation and Layout Tests
 * 
 * Tests sidebar navigation, chapter navigation, breadcrumbs,
 * and mobile responsive behavior.
 */

test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the app to be fully loaded
    await page.waitForSelector('text=ENGE401 Mastery', { timeout: 10000 });
  });

  test.describe('Sidebar Navigation (Left)', () => {
    test('should display left sidebar with navigation items', async ({ page }) => {
      // Check sidebar header using data-testid
      const sidebarLeft = page.getByTestId('sidebar-left');
      await expect(sidebarLeft.getByText('ENGE401').first()).toBeVisible();
      await expect(sidebarLeft.getByText('Mastery').first()).toBeVisible();

      // Check main navigation items within sidebar
      await expect(sidebarLeft.getByRole('link', { name: /home/i })).toBeVisible();
      await expect(sidebarLeft.getByRole('link', { name: /practice/i }).first()).toBeVisible();
      await expect(sidebarLeft.getByRole('link', { name: /dashboard/i })).toBeVisible();
    });

    test('should navigate to Practice page from sidebar', async ({ page }) => {
      await page.getByRole('link', { name: /practice/i }).first().click();
      await expect(page).toHaveURL('/practice');
      await expect(page.getByRole('heading', { name: /practice mode/i })).toBeVisible();
    });

    test('should navigate to Dashboard page from sidebar', async ({ page }) => {
      await page.getByRole('link', { name: /dashboard/i }).first().click();
      await expect(page).toHaveURL('/dashboard');
      await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    });

    test('should display all 6 chapters in sidebar', async ({ page }) => {
      // Check that all chapter navigation items are present within the sidebar
      const sidebarLeft = page.getByTestId('sidebar-left');
      const chapters = [
        'Foundation Algebra Review',
        'Trigonometry',
        'Exponential Functions',
        'Differentiation',
        'Integration',
        'Differential Equations',
      ];

      for (const chapter of chapters) {
        await expect(sidebarLeft.getByText(chapter, { exact: false })).toBeVisible();
      }
    });

    test('should expand chapter to show sub-navigation', async ({ page }) => {
      const sidebarLeft = page.getByTestId('sidebar-left');
      
      // Click on first chapter to expand
      const firstChapter = sidebarLeft.getByText(/Foundation Algebra Review/i).first();
      await firstChapter.click();

      // Check that sub-navigation items appear within the expanded chapter
      await expect(sidebarLeft.getByRole('link', { name: /theory/i })).toBeVisible();
      await expect(sidebarLeft.getByRole('link', { name: /^practice$/i })).toBeVisible();
      await expect(sidebarLeft.getByRole('link', { name: /review/i })).toBeVisible();
    });

    test('should navigate to chapter theory page', async ({ page }) => {
      const sidebarLeft = page.getByTestId('sidebar-left');
      
      // Expand first chapter
      await sidebarLeft.getByText(/Foundation Algebra Review/i).first().click();
      
      // Click on Theory link within sidebar
      await sidebarLeft.getByRole('link', { name: /theory/i }).first().click();
      
      await expect(page).toHaveURL(/\/chapter\/1/);
      await expect(page.getByRole('heading', { name: /foundation algebra review/i })).toBeVisible();
    });

    test('should navigate to chapter practice page', async ({ page }) => {
      const sidebarLeft = page.getByTestId('sidebar-left');
      
      // Expand first chapter
      await sidebarLeft.getByText(/Foundation Algebra Review/i).first().click();
      
      // Click on Practice link within sidebar
      await sidebarLeft.getByRole('link', { name: /^practice$/i }).first().click();
      
      await expect(page).toHaveURL(/\/chapter\/1\/practice/);
      await expect(page.getByRole('heading', { name: /chapter 1 practice/i })).toBeVisible();
    });

    test('should navigate to chapter review page', async ({ page }) => {
      const sidebarLeft = page.getByTestId('sidebar-left');
      
      // Expand first chapter
      await sidebarLeft.getByText(/Foundation Algebra Review/i).first().click();
      
      // Click on Review link within sidebar
      await sidebarLeft.getByRole('link', { name: /review/i }).first().click();
      
      await expect(page).toHaveURL(/\/chapter\/1\/review/);
      await expect(page.getByRole('heading', { name: /chapter 1 review/i })).toBeVisible();
    });
  });

  test.describe('Sidebar Navigation (Right)', () => {
    test('should display right sidebar with quick stats', async ({ page }) => {
      // Right sidebar should be visible on desktop
      const sidebarRight = page.getByTestId('sidebar-right');
      await expect(sidebarRight.getByText('Quick Stats')).toBeVisible();
      await expect(sidebarRight.getByText('Day Streak')).toBeVisible();
      await expect(sidebarRight.getByText('Accuracy')).toBeVisible();
      await expect(sidebarRight.getByText('Due for Review')).toBeVisible();
    });

    test('should display study calendar in right sidebar', async ({ page }) => {
      const sidebarRight = page.getByTestId('sidebar-right');
      await expect(sidebarRight.getByText('Study Calendar')).toBeVisible();
      // Calendar should be rendered - look for calendar table structure
      await expect(sidebarRight.locator('table')).toBeVisible();
    });

    test('should display achievements section', async ({ page }) => {
      const sidebarRight = page.getByTestId('sidebar-right');
      await expect(sidebarRight.getByText('Achievements')).toBeVisible();
      await expect(sidebarRight.getByText('Getting Started')).toBeVisible();
    });
  });

  test.describe('Breadcrumb Navigation', () => {
    test('should not show breadcrumbs on home page', async ({ page }) => {
      // Breadcrumbs should not be visible on home
      await expect(page.locator('nav[aria-label="breadcrumb"]')).not.toBeVisible();
    });

    test('should show breadcrumbs on chapter page', async ({ page }) => {
      await page.goto('/chapter/1');
      
      const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText('Home').first()).toBeVisible();
      await expect(breadcrumb.getByText('Chapter 1')).toBeVisible();
    });

    test('should show breadcrumbs on practice page', async ({ page }) => {
      await page.goto('/practice');
      
      const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
      await expect(breadcrumb).toBeVisible();
      await expect(breadcrumb.getByText('Home').first()).toBeVisible();
      await expect(breadcrumb.getByText('Practice')).toBeVisible();
    });

    test('should navigate home via breadcrumb', async ({ page }) => {
      await page.goto('/chapter/1');
      
      const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
      await breadcrumb.getByText('Home').first().click();
      
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Mobile Responsive Behavior', () => {
    test('should collapse sidebars on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Sidebar trigger button should be visible (use first() to avoid strict mode violation)
      await expect(page.getByRole('button', { name: /toggle sidebar/i }).first()).toBeVisible();
      
      // Sidebars should be collapsed initially
      await expect(page.getByTestId('sidebar-right').getByText('Quick Stats')).not.toBeVisible();
    });

    test('should toggle sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Click sidebar trigger (use first() to avoid strict mode violation)
      await page.getByRole('button', { name: /toggle sidebar/i }).first().click();
      
      // Sidebar should now be visible
      await expect(page.getByText('Navigation').first()).toBeVisible();
    });

    test('should show hamburger menu on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Sidebar trigger should be visible on tablet (use first() to avoid strict mode violation)
      await expect(page.getByRole('button', { name: /toggle sidebar/i }).first()).toBeVisible();
    });
  });

  test.describe('Theme Toggle', () => {
    test('should have theme provider configured', async ({ page }) => {
      // Check that the html element has the theme classes
      const html = page.locator('html');
      const classAttribute = await html.getAttribute('class');
      
      // Should have light or dark class
      expect(classAttribute).toMatch(/light|dark/);
    });
  });
});
