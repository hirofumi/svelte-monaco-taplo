<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type * as Monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
	import type { Schema } from '$lib/schema.js';

	export let options: Monaco.editor.IStandaloneEditorConstructionOptions = {};
	export let schema: Schema = null;
	export let style: string = '';
	export let value: string = '';

	let container: HTMLDivElement;
	let monaco: typeof Monaco;
	let model: Monaco.editor.ITextModel;
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let edited = false;

	onMount(async () => {
		const { monaco: m } = await import('./monaco.js');
		const { start } = await import('./monaco-languageclient.js');
		await start(schema, 'off');
		monaco = m;
	});

	$: if (monaco) {
		editor?.dispose();
		editor = monaco.editor.create(container, options);
		editor.onDidChangeModelContent(() => {
			edited = true;
			value = editor.getModel()?.getValue() || '';
		});
	}

	$: if (edited) {
		edited = false;
	} else if (monaco) {
		model?.dispose();
		model = monaco.editor.createModel(value, 'toml');
	}

	$: if (editor && model) {
		editor.setModel(model);
	}

	onDestroy(() => {
		model?.dispose();
		editor?.dispose();
	});
</script>

<div bind:this={container} {style} />
