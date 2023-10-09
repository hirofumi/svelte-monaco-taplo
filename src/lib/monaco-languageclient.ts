import { MonacoLanguageClient, initServices } from 'monaco-languageclient';
import { type ExtensionHostKind, registerExtension } from 'vscode/extensions';
import { CloseAction, ErrorAction } from 'vscode-languageclient';
import {
	BrowserMessageReader,
	BrowserMessageWriter
} from 'vscode-languageserver-protocol/browser.js';
import TaploWorker from '$lib/taplo?worker';

(async () => {
	const name = 'TOML';
	const languageId = 'toml';

	if (!(window.MonacoEnvironment as { vscodeApiInitialised: boolean }).vscodeApiInitialised) {
		await initServices();
	}

	const worker = new TaploWorker();
	const reader = new BrowserMessageReader(worker);
	const writer = new BrowserMessageWriter(worker);

	const languageClient = new MonacoLanguageClient({
		name: name,
		clientOptions: {
			documentSelector: [{ language: languageId }],
			errorHandler: {
				error: () => ({ action: ErrorAction.Continue }),
				closed: () => ({ action: CloseAction.DoNotRestart })
			}
		},
		connectionProvider: {
			get: () => {
				return Promise.resolve({ reader: reader, writer: writer });
			}
		}
	});

	reader.onClose(() => languageClient.stop());

	await languageClient.start();

	const extension = {
		name: name,
		publisher: '',
		version: '0.0.1',
		engines: {
			vscode: '*'
		},
		contributes: {
			languages: [
				{
					id: languageId,
					extensions: [`.${languageId}`],
					aliases: [languageId]
				}
			]
		}
	};

	const extHostKind: ExtensionHostKind.LocalProcess = 1;
	registerExtension(extension, extHostKind, {});
})();
