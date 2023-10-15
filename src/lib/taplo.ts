import type { Message } from 'vscode-languageserver-protocol';
import {
	BrowserMessageReader,
	BrowserMessageWriter
} from 'vscode-languageserver-protocol/browser.js';
import type { Environment } from '@taplo/core';
import type { LspInterface, RpcMessage } from '@taplo/lsp';
import { TaploLsp } from '@taplo/lsp';
import type { Schema } from '$lib/schema.js';
import { schemaContents, schemaEnabled, schemaPath } from '$lib/schema.js';
import { INITIALIZE_TAPLO, type RUST_LOG } from '$lib/taplo-initialize-method.js';

const CONFIG_FILE_PATH = '/.taplo.toml';

let schema: Schema = null;
let logLevel: RUST_LOG = 'off';

function envVars(): Array<[string, string]> {
	return [['RUST_LOG', logLevel]];
}

const environment: Environment = {
	now: () => new Date(),
	envVar: (name: string) => (envVars().find(([k, _]) => k === name) ?? [])[1],
	envVars: envVars,
	stdErrAtty: () => false,
	stdin: () => Promise.reject('not implemented'),
	stdout: async (bytes: Uint8Array) => {
		console.log(new TextDecoder().decode(bytes));
		return bytes.length;
	},
	stderr: async (bytes: Uint8Array) => {
		console.log(new TextDecoder().decode(bytes));
		return bytes.length;
	},
	glob: (_pattern: string) => [],
	readFile: (path: string) => {
		if (path === CONFIG_FILE_PATH) {
			const config = [
				'include = ["**/*"]',
				'[schema]',
				`path = "${schemaPath(schema).replaceAll('\\', '\\\\')?.replaceAll('"', '\\"')}"`,
				`enabled = ${schemaEnabled(schema)}`,
				''
			].join('\n');
			return Promise.resolve(new TextEncoder().encode(config));
		} else if (path === schemaPath(schema)) {
			return Promise.resolve(new TextEncoder().encode(schemaContents(schema)));
		} else {
			return Promise.reject('not implemented');
		}
	},
	writeFile: (_path: string, _bytes: Uint8Array) => Promise.reject('not implemented'),
	urlToFilePath: (url: string) => url.replace(/(?:file|inmemory):\/\//, ''),
	isAbsolute: (path: string) => path.startsWith('/'),
	cwd: () => '/',
	findConfigFile: (_from: string) => CONFIG_FILE_PATH
};

const worker: Worker = self as any; // eslint-disable-line
const reader = new BrowserMessageReader(worker);
const writer = new BrowserMessageWriter(worker);

const lspInterface: LspInterface = {
	onMessage(message: RpcMessage) {
		writer.write(message);
	}
};

let newTaplo: Promise<TaploLsp>;

reader.listen(async (message: Message) => {
	const rpcMessage = message as RpcMessage;

	if (rpcMessage.method === INITIALIZE_TAPLO) {
		[schema, logLevel] = rpcMessage.params;
		newTaplo = TaploLsp.initialize(environment, lspInterface);
		return;
	}

	const taplo = await newTaplo;

	taplo.send(rpcMessage);
});
