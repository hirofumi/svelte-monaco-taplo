import * as monaco from 'monaco-editor';
import EditorWorker from '../../node_modules/monaco-editor-workers/dist/workers/editorWorker-es?worker';

if (!self.MonacoEnvironment) {
	self.MonacoEnvironment = {
		getWorker: function (_workerId: string, _label: string) {
			return new EditorWorker();
		}
	};
}

export { monaco };
