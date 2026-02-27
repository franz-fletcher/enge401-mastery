import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/test-user.json');

/**
 * Authenticates as an anonymous test user and saves the state
 * This should be run once in a setup project
 */
export async function authenticateAsTestUser(page: Page, context: BrowserContext) {
  // Clear any existing storage
  await context.clearCookies();

  // Navigate to home page which triggers auto-auth
  await page.goto('/');

  // Wait for auth to complete - look for "Guest User" text
  await expect(page.getByTestId('user-status')).toContainText('Guest User', { timeout: 10000 });

  // Save the authentication state
  await context.storageState({ path: authFile });

  return authFile;
}

/**
 * Check if auth file exists
 */
export function isAuthenticated(): boolean {
  return fs.existsSync(authFile);
}

/**
 * Get the path to the auth file
 */
export function getAuthFile(): string {
  return authFile;
}

/**
 * Create test fixture with pre-authenticated state
 */
export const test = base.extend<{
  authenticatedPage: Page;
}>({
  authenticatedPage: async ({ browser }, use) => {
    // Create context with saved auth state
    const context = await browser.newContext({
      storageState: isAuthenticated() ? authFile : undefined,
    });
    const page = await context.newPage();

    // If not authenticated, authenticate first
    if (!isAuthenticated()) {
      await authenticateAsTestUser(page, context);
    }

    await use(page);
    await context.close();
  },
});

export { expect };
