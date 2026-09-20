import { test, expect } from '../fixtures/auth';

test.describe('Tier 5 - Visual Regression Tests', () => {
    test('homepage visual appearance', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveScreenshot('homepage.png');
    });

    test('booking from visual appearance', async ({ page }) => {
        await page.goto('/booking');
        await expect(page).toHaveScreenshot('booking-form.png');
    })
})