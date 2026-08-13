import { test, expect } from '@playwright/test';

test.describe('Flaky Test Case Study', () => {
    test('booking confirmationshows a booking ID(fixed version)', async ({ page }) => {
        await page.goto('/booking/1');
        await page.fill('[data-testid="firstname"]', 'John');
        await page.fill('[data-testid="lastname"]', 'Doe');
        await page.fill('[data-testid="email"]', 'john.doe@example.com');
        await page.fill('[data-testid="phone"]', '5551234567');
        await page.fill('[data-testid="checkin"]', '2026-09-01');
        await page.fill('[data-testid="checkout"]', '2026-09-05');
        await page.click('[data-testid="submit-booking"]');

        const confirmationModal = page.locator('[data-testid="confirmation-modal"]');
        await expect(confirmationModal).toBeVisible();

        const bookingId = page.locator('[data-testid="booking-id"]');
        await expect(bookingId).toBeVisible();
        await expect(bookingId).not.toBeEmpty();
    });

    test('booking confimation survices a slow backend (cold start simulation)', async ({ page }) => {
        await page.goto('/booking/1');
        await page.fill('[data-testid="firstname"]', 'Jane');
        await page.fill('[data-testid="lastname"]', 'Smith');
        await page.fill('[data-testid="email"]', 'jane.smith@example.com');
        await page.fill('[data-testid="phone"]', '5551234568');
        await page.fill('[data-testid="checkin"]', '2026-09-01');
        await page.fill('[data-testid="checkout"]', '2026-09-05');
        await page.click('[data-testid="submit-booking"]');

        const bookingId = page.locator('[data-testid="booking-id"]');

        await expect(bookingId).toBeVisible({ timeout: 60_000 });

    });

})