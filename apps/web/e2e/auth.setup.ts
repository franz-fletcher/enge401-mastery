import { test as setup, expect } from '@playwright/test';
import { authenticateAsTestUser } from './auth-helper';

/**
 * Setup project that authenticates once and saves state
 * Run this before other tests to create a shared authenticated state
 */
setup('authenticate as test user', async ({ page, context }) => {
  await authenticateAsTestUser(page, context);

  // Verify we're authenticated
  await expect(page.getByTestId('user-status')).toContainText('Guest User');
  await expect(page.getByTestId('user-name')).toBeVisible();
});
