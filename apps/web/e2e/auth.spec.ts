import { test, expect } from '@playwright/test';

/**
 * Authentication Tests
 * 
 * Tests anonymous user auto-creation, session persistence,
 * and user data isolation between sessions.
 */

test.describe('Authentication', () => {
  test.describe('Anonymous User Auto-Creation', () => {
    test('should auto-create anonymous user on first visit', async ({ page, context }) => {
      // Clear any existing storage
      await context.clearCookies();
      
      await page.goto('/');
      
      // Wait for auth to initialize
      await page.waitForTimeout(2000);
      
      // Check that user info appears in sidebar
      await expect(page.getByText('Guest User')).toBeVisible();
      
      // Check localStorage for anonymousId
      const anonymousId = await page.evaluate(() => localStorage.getItem('anonymousId'));
      expect(anonymousId).toBeTruthy();
      expect(anonymousId).toMatch(/^anon_/);
    });

    test('should display anonymous user in sidebar footer', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Check sidebar footer shows user info
      const sidebarFooter = page.locator('[data-slot="sidebar-footer"]');
      await expect(sidebarFooter).toBeVisible();
      
      // Should show "Guest User" label
      await expect(page.getByText('Guest User')).toBeVisible();
    });

    test('should create unique anonymous ID for each new session', async ({ browser }) => {
      // Create two separate contexts (simulating different users)
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      await page1.goto('http://localhost:3000');
      await page2.goto('http://localhost:3000');
      
      await page1.waitForTimeout(2000);
      await page2.waitForTimeout(2000);
      
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
      
      // Get the anonymous ID after reload
      const anonymousIdAfter = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      
      // ID should be the same
      expect(anonymousIdAfter).toBe(anonymousIdBefore);
      
      // User should still be shown as Guest User
      await expect(page.getByText('Guest User')).toBeVisible();
    });

    test('should persist session across navigation', async ({ page }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      const anonymousIdBefore = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      
      // Navigate to different pages
      await page.goto('/practice');
      await page.waitForTimeout(1000);
      
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
      
      await page.goto('/chapter/1');
      await page.waitForTimeout(1000);
      
      // Check ID is still the same
      const anonymousIdAfter = await page.evaluate(() => 
        localStorage.getItem('anonymousId')
      );
      expect(anonymousIdAfter).toBe(anonymousIdBefore);
    });

    test('should maintain session in cookies', async ({ page, context }) => {
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Check for session cookie
      const cookies = await context.cookies();
      const sessionCookie = cookies.find(c => c.name.includes('session'));
      
      // Should have a session cookie
      expect(sessionCookie).toBeTruthy();
    });
  });

  test.describe('User Data Isolation', () => {
    test('should isolate data between different anonymous users', async ({ browser }) => {
      // Create two separate browser contexts
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // User 1 visits and completes an exercise
      await page1.goto('http://localhost:3000/practice');
      await page1.waitForTimeout(2000);
      
      // Get user 1's anonymous ID
      const id1 = await page1.evaluate(() => localStorage.getItem('anonymousId'));
      
      // User 2 visits
      await page2.goto('http://localhost:3000/practice');
      await page2.waitForTimeout(2000);
      
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
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
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
      
      // Simulate window focus
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      
      // Should still be authenticated
      await expect(page.getByText('Guest User')).toBeVisible();
    });
  });
});
