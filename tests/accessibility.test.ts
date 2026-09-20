import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Tier 4 - Accessibility Tests', () => {
    test('homepage has no accessbility violations', async ({ page }) => {
        await page.goto('/');

        const results = await new AxeBuilder({ page }).analyze();

        if (results.violations.length > 0) {
            console.log(results.violations.map(v => ({
                rule: v.id,
                description: v.description,
                affectedElements: v.nodes.length,
            })));
        }

        expect(results.violations).toEqual([]);
    });

    test('booking from has no accessbility violations', async ({ page }) => {
        await page.goto('/booking');

        const results = await new AxeBuilder({ page }).analyze();

        if (results.violations.length > 0) {
            console.log(results.violations.map(v => ({
                rule: v.id,
                description: v.description,
                affectedElements: v.nodes.length,
            })));
        }

        expect(results.violations).toEqual([]);
    })
})