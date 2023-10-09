import type { Message } from 'vscode-languageserver-protocol';
import {
	BrowserMessageReader,
	BrowserMessageWriter
} from 'vscode-languageserver-protocol/browser.js';
import type { Environment } from '@taplo/core';
import type { LspInterface, RpcMessage } from '@taplo/lsp';
import { TaploLsp } from '@taplo/lsp';

const environment: Environment = {
	now: () => new Date(),
	envVar: (_name: string) => undefined,
	envVars: () => [],
	stdErrAtty: () => false,
	stdin: () => Promise.reject('not implemented'),
	stdout: async (bytes: Uint8Array) => bytes.length,
	stderr: async (bytes: Uint8Array) => bytes.length,
	glob: (_pattern: string) => [],
	readFile: (_path: string) => Promise.reject('not implemented'),
	writeFile: (_path: string, _bytes: Uint8Array) => Promise.reject('not implemented'),
	urlToFilePath: (url: string) => url.replace(/(?:file|inmemory):\/\//, '') + '.toml',
	isAbsolute: (_path: string) => true,
	cwd: () => '/',
	findConfigFile: (_from: string) => undefined
};

const worker: Worker = self as any; // eslint-disable-line
const reader = new BrowserMessageReader(worker);
const writer = new BrowserMessageWriter(worker);

const lspInterface: LspInterface = {
	onMessage(message: RpcMessage) {
		writer.write(message);
	}
};

let taplo: TaploLsp;

reader.listen(async (message: Message) => {
	if (taplo === undefined) {
		taplo = await TaploLsp.initialize(environment, lspInterface);
	}

	taplo.send(message as RpcMessage);
});
