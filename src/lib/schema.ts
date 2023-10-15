export type Schema = null | string | { url: string };

export function schemaEnabled(s: Schema): boolean {
	return s !== null;
}

export function schemaPath(s: Schema): string {
	return (typeof s === 'object' && s?.url) || '/.schema.json';
}

export function schemaContents(s: Schema): string {
	if (typeof s === 'string') {
		return s;
	}
	throw new Error('not implemented');
}
