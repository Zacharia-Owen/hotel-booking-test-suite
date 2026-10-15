import { test, expect } from '@playwright/test';

test.describe('Tier 6 - Mocked Network States', () => {
  test('shows "No rooms found" when there are zero rooms', async ({ page }) => {
    await page.route('**/api/rooms', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ rooms: [], page: 1, limit: 10, totalRooms: 0, totalPages: 0 }),
      });
    });

    await page.goto('/');

    await expect(page.getByText('No rooms found')).toBeVisible();
  });

  test('retry button recovers after a failed request', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/api/rooms', route => {
      requestCount++;

      if (requestCount === 1) {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Server error' }) });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            rooms: [{ id: 1, name: 'Standard Single Room', price: 85, description: 'A cosy single room.', image: '' }],
            page: 1,
            limit: 10,
            totalRooms: 1,
            totalPages: 1,
          }),
        });
      }
    });

    await page.goto('/');

    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    await page.locator('[data-testid="retry-button"]').click();
    await expect(page.getByText('Standard Single Room')).toBeVisible();

    });
});