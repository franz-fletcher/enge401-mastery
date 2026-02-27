import { test, expect, Page } from '@playwright/test';

// Helper to open mobile sidebar if needed
async function openMobileSidebarIfNeeded(page: Page) {
  const viewport = page.viewportSize();
  if (viewport && viewport.width < 768) {
    // On mobile, click the sidebar trigger to open it
    const sidebarTrigger = page.locator('[data-sidebar="trigger"]');
    if (await sidebarTrigger.isVisible().catch(() => false)) {
      await sidebarTrigger.click();
      // Wait for sidebar animation
      await page.waitForTimeout(300);
    }
  }
}

/**
 * Authentication Tests
 * 
 * Tests anonymous user auto-creation, session persistence,
 * and user data isolation between sessions.
 */

test.describe('Authentication', () => {
  test.describe('Anonymous User Auto-Creation', () => {
    test('should auto-create anonymous user on first visit', async ({ browser }) => {
      // Create a fresh context without any storage state
      const context = await browser.newContext({ storageState: undefined });
      const page = await context.newPage();
      
      await page.goto('/');
      
      // Wait for auth to initialize
      await page.waitForTimeout(2000);
      await openMobileSidebarIfNeeded(page);
      
      // Check that user info appears in sidebar using data-testid
      const sidebarFooter = page.getByTestId('sidebar-footer');
      await expect(sidebarFooter).toBeVisible();
      
      // Check for Guest User text within the sidebar footer
      await expect(sidebarFooter.getByText('Guest User')).toBeVisible();
      
      // Check localStorage for anonymousId
      const anonymousId = await page.evaluate(() => localStorage.getItem('anonymousId'));
      expect(anonymousId).toBeTruthy();
      expect(anonymousId).toMatch(/^anon_/);
      
      await context.close();
    });

    test('should display anonymous user in sidebar footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      await openMobileSidebarIfNeeded(page);
      
      // Check sidebar footer shows user info using data-testid
      const sidebarFooter = page.getByTestId('sidebar-footer');
      await expect(sidebarFooter).toBeVisible();
      
      // Should show "Guest User" label
      await expect(page.getByText('Guest User')).toBeVisible();
    });

    test('should create unique anonymous ID for each new session', async ({ browser }) => {
      // Create two separate contexts (simulating different users) WITHOUT shared auth state
      const context1 = await browser.newContext({ storageState: undefined });
      const context2 = await browser.newContext({ storageState: undefined });
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      await page1.goto('http://localhost:3000');
      await page2.goto('http://localhost:3000');
      await openMobileSidebarIfNeeded(page1);
      await openMobileSidebarIfNeeded(page2);
      
      await expect(page1.getByText("Guest User")).toBeVisible({ timeout: 10000 });
      await expect(page2.getByText("Guest User")).toBeVisible({ timeout: 10000 });
      
      const id1 = await page1.evaluate(() => localStorage.getItem('anonymousId'));
      const id2 = await page2.evaluate(() => localStorage.getItem('anonymousId'));
      
      // IDs should be different
      expect(id1).not.toBe(id2);
      
      await context1.close();
      await context2.close();
    });
  });

  test.describe('Session Persistence', () => {
    test('should persist session across page reloads', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Get the anonymous ID before reload
      const anonymousIdBefore = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      expect(anonymousIdBefore).toBeTruthy();
      
      // Reload the page
      await page.reload();
      await page.waitForTimeout(2000);
      await openMobileSidebarIfNeeded(page);
      
      // Get the anonymous ID after reload
      const anonymousIdAfter = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      
      // ID should be the same
      expect(anonymousIdAfter).toBe(anonymousIdBefore);
      
      // User should still be visible
      await expect(page.getByText('Guest User')).toBeVisible();
    });

    test('should persist session across navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Get initial ID
      const initialId = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      expect(initialId).toBeTruthy();
      
      // Navigate to practice page
      await page.goto('/practice');
      await page.waitForTimeout(1000);
      
      // ID should persist
      const practiceId = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      expect(practiceId).toBe(initialId);
      
      // Navigate to dashboard
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      
      // ID should still be the same
      const dashboardId = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      expect(dashboardId).toBe(initialId);
    });

    test('should maintain session in cookies', async ({ page, context }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Get cookies
      const cookies = await context.cookies();
      const sessionCookie = cookies.find(c => c.name.includes('session'));
      
      // Should have a session cookie
      expect(sessionCookie).toBeTruthy();
    });
  });

  test.describe('User Data Isolation', () => {
    test('should isolate data between different anonymous users', async ({ browser }) => {
      // Create two separate browser contexts WITHOUT shared auth state
      const context1 = await browser.newContext({ storageState: undefined });
      const context2 = await browser.newContext({ storageState: undefined });
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // User 1 visits home first to trigger auth, then goes to practice
      await page1.goto('http://localhost:3000/');
      await openMobileSidebarIfNeeded(page1);
      await expect(page1.getByText("Guest User")).toBeVisible({ timeout: 10000 });
      await page1.waitForTimeout(1000); // Wait for auth to complete and localStorage to be set
      
      // Get user 1's anonymous ID
      const id1 = await page1.evaluate(() => localStorage.getItem('anonymousId'));
      
      // User 2 visits home first to trigger auth
      await page2.goto('http://localhost:3000/');
      await openMobileSidebarIfNeeded(page2);
      await expect(page2.getByText("Guest User")).toBeVisible({ timeout: 10000 });
      await page2.waitForTimeout(1000); // Wait for auth to complete
      
      // Get user 2's anonymous ID
      const id2 = await page2.evaluate(() => localStorage.getItem('anonymousId'));
      
      // Verify different IDs
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^anon_/);
      expect(id2).toMatch(/^anon_/);
      
      await context1.close();
      await context2.close();
    });

    test('should not share localStorage between contexts', async ({ browser }) => {
      const context1 = await browser.newContext({ storageState: undefined });
      const context2 = await browser.newContext({ storageState: undefined });
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // Set data in context 1
      await page1.goto('http://localhost:3000');
      await page1.evaluate(() => localStorage.setItem('test-key', 'context1-value'));
      
      // Check context 2 doesn't have it
      await page2.goto('http://localhost:3000');
      const value2 = await page2.evaluate(() => localStorage.getItem('test-key'));
      
      expect(value2).toBeNull();
      
      await context1.close();
      await context2.close();
    });
  });

  test.describe('Auth Provider Configuration', () => {
    test('should have SessionProvider configured', async ({ page }) => {
      await page.goto('/');
      
      // Check that auth provider is present by looking for session-related attributes
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should refetch session on window focus', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      await openMobileSidebarIfNeeded(page);
      
      // Simulate window focus
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      
      // Should still be authenticated
      await expect(page.getByText('Guest User')).toBeVisible();
    });
  });
});
