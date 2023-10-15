<script lang="ts">
	import TomlEditor from '$lib/TomlEditor.svelte';

	let minimapEnabled = false;
	let schema = { url: 'https://taplo.tamasfe.dev/schemas/Cargo.toml.json' };
	let value = [
		'[package]',
		'name = "foo"',
		'version = "0.1.0"',
		'edition = "2021"',
		'',
		'[dependencies]',
		''
	].join('\n');
</script>

<div style="height:2rem;margin-bottom:.5rem;border-bottom:1px solid #ccc;">
	<input id="minimap" type="checkbox" bind:checked={minimapEnabled} />
	<label for="minimap">minimap</label>
	<div id="value" style="display:none">{value}</div>
</div>
<TomlEditor
	style="height:calc(100vh - 2.5rem)"
	options={{
		automaticLayout: true,
		minimap: {
			enabled: minimapEnabled
		},
		scrollBeyondLastLine: false
	}}
	{schema}
	bind:value
/>
