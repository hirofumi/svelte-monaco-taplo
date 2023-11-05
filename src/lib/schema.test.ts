import { describe, it, expect } from 'vitest';
import { schemaPath } from '$lib/schema.js';

describe('schemaPath', () => {
	it('returns url field for { url: "..." }', () => {
		const SCHEMA_URL = 'https://json.schemastore.org/cargo.json';
		expect(schemaPath({ url: SCHEMA_URL })).toBe(SCHEMA_URL);
	});
});
