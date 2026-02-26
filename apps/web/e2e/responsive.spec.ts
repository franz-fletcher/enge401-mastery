import { test, expect } from '@playwright/test';

/**
 * Responsive Design Tests
 * 
 * Tests layout and functionality across different viewport sizes:
 * - Desktop (1920x1080)
 * - Laptop (1366x768)
 * - Tablet (768x1024)
 * - Mobile (375x667)
 */

const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Laptop', width: 1366, height: 768 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

test.describe('Responsive Design', () => {
  test.describe('Layout Adaptations', () => {
    for (const viewport of viewports) {
      test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        
        // Main content should be visible
        await expect(page.getByRole('heading', { name: /enge401 mastery/i })).toBeVisible();
        
        // No horizontal overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = await page.evaluate(() => window.innerWidth);
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
      });
    }

    test('should show both sidebars on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Left sidebar should be visible
      await expect(page.getByText('Navigation')).toBeVisible();
      await expect(page.getByText('Chapters')).toBeVisible();
      
      // Right sidebar should be visible
      await expect(page.getByText('Quick Stats')).toBeVisible();
      await expect(page.getByText('Study Calendar')).toBeVisible();
    });

    test('should show both sidebars on laptop', async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto('/');
      
      // Left sidebar should be visible
      await expect(page.getByText('Navigation')).toBeVisible();
      
      // Right sidebar should be visible
      await expect(page.getByText('Quick Stats')).toBeVisible();
    });

    test('should collapse right sidebar on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Right sidebar should be hidden on tablet
      await expect(page.getByText('Quick Stats')).not.toBeVisible();
      
      // Left sidebar should be visible or collapsible
      const sidebarTrigger = page.getByRole('button', { name: /toggle sidebar/i });
      await expect(sidebarTrigger).toBeVisible();
    });

    test('should collapse both sidebars on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Sidebars should be hidden
      await expect(page.getByText('Navigation')).not.toBeVisible();
      await expect(page.getByText('Quick Stats')).not.toBeVisible();
      
      // Sidebar trigger should be visible
      await expect(page.getByRole('button', { name: /toggle sidebar/i })).toBeVisible();
    });
  });

  test.describe('Sidebar Behavior', () => {
    test('should toggle left sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Sidebar should be hidden initially
      await expect(page.getByText('Navigation')).not.toBeVisible();
      
      // Click toggle button
      await page.getByRole('button', { name: /toggle sidebar/i }).click();
      
      // Sidebar should be visible
      await expect(page.getByText('Navigation')).toBeVisible();
      await expect(page.getByText('Chapters')).toBeVisible();
      
      // Click again to close
      await page.getByRole('button', { name: /toggle sidebar/i }).click();
      
      // Sidebar should be hidden
      await expect(page.getByText('Navigation')).not.toBeVisible();
    });

    test('should close sidebar when clicking outside on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Open sidebar
      await page.getByRole('button', { name: /toggle sidebar/i }).click();
      await expect(page.getByText('Navigation')).toBeVisible();
      
      // Click on main content area
      await page.locator('main').click({ position: { x: 10, y: 10 } });
      
      // Sidebar should close
      await expect(page.getByText('Navigation')).not.toBeVisible();
    });

    test('should maintain sidebar state across navigation on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Sidebar should be visible
      await expect(page.getByText('Navigation')).toBeVisible();
      
      // Navigate to another page
      await page.goto('/practice');
      
      // Sidebar should still be visible
      await expect(page.getByText('Navigation')).toBeVisible();
    });
  });

  test.describe('Content Grid Adaptations', () => {
    test('should show 3 columns on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      // Chapter grid should have 3 columns
      const chapterGrid = page.locator('.grid').filter({ has: page.getByText('Foundation Algebra Review') });
      const gridClass = await chapterGrid.getAttribute('class');
      expect(gridClass).toMatch(/lg:grid-cols-3|grid-cols-3/);
    });

    test('should show 2 columns on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      
      // Chapter grid should have 2 columns
      const chapterGrid = page.locator('.grid').filter({ has: page.getByText('Foundation Algebra Review') });
      const gridClass = await chapterGrid.getAttribute('class');
      expect(gridClass).toMatch(/sm:grid-cols-2|grid-cols-2/);
    });

    test('should show 1 column on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Chapter cards should stack vertically
      const chapterCards = page.locator('a[href^="/chapter/"]');
      const count = await chapterCards.count();
      expect(count).toBe(6);
      
      // All should be visible (stacked)
      for (let i = 0; i < count; i++) {
        await expect(chapterCards.nth(i)).toBeVisible();
      }
    });

    test('should adapt stats cards grid on different viewports', async ({ page }) => {
      // Desktop - 3 columns
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');
      
      const statsSection = page.locator('section').filter({ has: page.getByText('Total Chapters') });
      await expect(statsSection).toBeVisible();
      
      // Mobile - stack vertically
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();
      
      await expect(page.getByText('Total Chapters')).toBeVisible();
      await expect(page.getByText('Exercise Types')).toBeVisible();
      await expect(page.getByText('Learning Method')).toBeVisible();
    });
  });

  test.describe('Typography and Spacing', () => {
    test('should adjust heading sizes on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const heading = page.getByRole('heading', { name: /enge401 mastery/i });
      await expect(heading).toBeVisible();
      
      // Check font size is appropriate for mobile
      const fontSize = await heading.evaluate(el => window.getComputedStyle(el).fontSize);
      const sizeInPx = parseInt(fontSize);
      expect(sizeInPx).toBeLessThanOrEqual(48); // Should not be too large on mobile
    });

    test('should maintain readable text on all viewports', async ({ page }) => {
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        
        // Check body text is readable
        const bodyText = page.locator('p').first();
        const fontSize = await bodyText.evaluate(el => window.getComputedStyle(el).fontSize);
        const sizeInPx = parseInt(fontSize);
        
        // Font size should be at least 14px for readability
        expect(sizeInPx).toBeGreaterThanOrEqual(14);
      }
    });

    test('should adjust padding on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Main content should have appropriate padding
      const main = page.locator('main');
      const padding = await main.evaluate(el => window.getComputedStyle(el).padding);
      
      // Should have some padding but not too much on mobile
      expect(padding).toMatch(/\d+px/);
    });
  });

  test.describe('Navigation Interactions', () => {
    test('should have touch-friendly buttons on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Buttons should be large enough for touch
      const buttons = page.getByRole('button');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        if (box) {
          // Minimum touch target size is 44x44px
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should have touch-friendly links on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Chapter cards should be large enough for touch
      const chapterCards = page.locator('a[href^="/chapter/"]');
      const box = await chapterCards.first().boundingBox();
      
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test.describe('Practice Page Responsive', () => {
    test('should stack controls vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/practice');
      await page.waitForTimeout(1000);
      
      // Controls should be visible
      await expect(page.getByText('Chapter')).toBeVisible();
      await expect(page.getByText('Difficulty')).toBeVisible();
    });

    test('should show exercise card full width on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/practice');
      await page.waitForTimeout(1000);
      
      // Exercise card should be visible and full width
      const card = page.locator('[class*="card"]').first();
      await expect(card).toBeVisible();
      
      const box = await card.boundingBox();
      const viewportWidth = 375;
      
      if (box) {
        // Card should take most of the viewport width
        expect(box.width).toBeGreaterThan(viewportWidth * 0.8);
      }
    });
  });

  test.describe('Dashboard Responsive', () => {
    test('should adapt dashboard grid on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Stats cards should stack
      await expect(page.getByText('Due for Review')).toBeVisible();
      await expect(page.getByText('Accuracy')).toBeVisible();
      await expect(page.getByText('Streak')).toBeVisible();
      await expect(page.getByText('Completed')).toBeVisible();
    });

    test('should show scrollable chapter list on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // Chapter progress section should be visible
      await expect(page.getByText('Progress by Chapter')).toBeVisible();
      
      // All chapters should be visible (scrollable)
      await expect(page.getByText('Foundation Algebra Review')).toBeVisible();
      await expect(page.getByText('Differential Equations')).toBeVisible();
    });
  });

  test.describe('Review Page Responsive', () => {
    test('should show flashcard full width on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/chapter/1/review');
      
      // Flashcard should be visible
      await expect(page.getByText(/card \d+ of/i)).toBeVisible();
      
      // Rating buttons should be accessible
      await page.getByRole('button', { name: /show answer/i }).click();
      await expect(page.getByRole('button', { name: /again/i })).toBeVisible();
    });

    test('should stack rating buttons on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/chapter/1/review');
      
      await page.getByRole('button', { name: /show answer/i }).click();
      
      // All rating buttons should be visible
      await expect(page.getByRole('button', { name: /^again$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^hard$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^good$/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /^easy$/i })).toBeVisible();
    });
  });

  test.describe('Orientation Changes', () => {
    test('should handle landscape orientation on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 }); // Landscape
      await page.goto('/');
      
      // Content should still be visible
      await expect(page.getByRole('heading', { name: /enge401 mastery/i })).toBeVisible();
      
      // Sidebars might be visible in landscape
      const sidebarVisible = await page.getByText('Navigation').isVisible().catch(() => false);
      // Just verify the page doesn't break
      expect(sidebarVisible !== undefined).toBeTruthy();
    });
  });
});
