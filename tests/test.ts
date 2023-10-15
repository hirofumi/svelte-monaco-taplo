import { expect, test } from '@playwright/test';

test('monaco editor should load example', async ({ page }) => {
	await page.goto('/');
	const editor = page.locator('.monaco-editor');
	await editor.waitFor();
	await expect(editor).toContainText('[package]');
});
