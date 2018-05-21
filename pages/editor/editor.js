// const require = global.nodeRequire;

const path = require('path');
const fs = require('fs');
const { ipcRenderer } = require('electron');

const container = document.querySelector('#container');

function uriFromPath(_path) {
	var pathName = path.resolve(_path).replace(/\\/g, '/');
	if (pathName.length > 0 && pathName.charAt(0) !== '/') {
		pathName = '/' + pathName;
	}
	return encodeURI('file://' + pathName);
}

// workaround monaco-css not understanding the environment
self.module = undefined;

// workaround monaco-typescript not understanding the environment
self.process.browser = true;

const languages = {
	'.js': 'javascript',
	'.css': 'css',
	'.html': 'html',
	'.md': 'markdown',
	'.yml': 'yaml'
};

let editor;
let initial;
let currentFile;

ipcRenderer.on('file', (event, file) => {
	currentFile = file;

	const value = fs.readFileSync(file, 'utf-8');
	const ext = path.extname(file);
	const lang = languages[ext] || ext.slice(1);

	if (editor) {
		editor.setValue(value);
		monaco.editor.setModelLanguage(editor.getModel(), lang);
	} else {
		initial = { value, lang };
	}
});

amdRequire.config({
	baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
});

amdRequire(['vs/editor/editor.main'], function() {
	editor = monaco.editor.create(container, {
		value: initial ? initial.value : '// loading...',
		language: initial ? initial.lang : 'javascript',
		theme: "vs-dark"
	});

	window.addEventListener('resize', () => {
		editor.layout();
	});

	const mac = navigator.platform === 'MacIntel';
	window.addEventListener('keydown', event => {
		if (event.keyCode === 83 && (mac ? event.metaKey : event.ctrlKey)) {
			// Cmd-S/Ctrl-S
			const value = editor.getModel().getValue();
			fs.writeFileSync(currentFile, value);
		}
	});
});