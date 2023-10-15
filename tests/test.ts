import { expect, test } from '@playwright/test';

test('monaco editor should load example', async ({ page }) => {
	await page.goto('/');
	const editor = page.locator('.monaco-editor');
	await editor.waitFor();
	await expect(editor).toContainText('[package]');
});

test('monaco editor should show tooltip', async ({ page }) => {
	await page.goto('/');
	await page.locator('.monaco-editor').waitFor();
	await page.getByText('[package]', { exact: true }).hover();
	const hover = page.locator('.monaco-hover-content');
	await hover.waitFor();
	await expect(hover).toContainText('The only fields required by Cargo are name and version.');
});
