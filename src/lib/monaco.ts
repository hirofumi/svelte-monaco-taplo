import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

if (!self.MonacoEnvironment) {
	self.MonacoEnvironment = {
		getWorker: function (_workerId: string, _label: string) {
			return new EditorWorker();
		}
	};
}

export { monaco };
