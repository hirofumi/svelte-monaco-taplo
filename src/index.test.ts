import { describe, it, expect } from 'vitest';
import TomlEditor from '$lib/TomlEditor.svelte';

describe('TomlEditor', () => {
	it('is a Component', () => {
		expect(`${TomlEditor}`).toContain('Component');
	});
});
