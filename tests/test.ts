import { expect, test } from '@playwright/test';

test('monaco editor should be created', async ({ page }) => {
	await page.goto('/');
	await page.locator('.monaco-editor').waitFor();
	const got = (await page.locator('.monaco-editor').allInnerTexts()).join('');
	expect(got).toContain('[package]');
});
