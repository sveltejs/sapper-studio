const { Terminal } = require('xterm');
const { ipcRenderer } = require('electron');
const fit = require('xterm/lib/addons/fit/fit');
const WebfontLoader = require('xterm-webfont');
const defaultShell = require('default-shell');

let proc;
let terminal;
let buffered = null;
let ready;

Terminal.applyAddon(fit);
Terminal.applyAddon(WebfontLoader)

terminal = new Terminal({
	cursorBlink: true,
	cols: 80,
	rows: 40,
	fontFamily: 'Fira Code',
	fontWeight: 300,
	fontSize: 14,

	theme: {
		background: '#333'
	}
});

function init() {
	terminal.fit();

	window.addEventListener('resize', () => {
		terminal.fit();
	});

	terminal.write(buffered.replace(/\n/gm, '\r\n'));
}

ipcRenderer.on('buffered', (event, _buffered) => {
	buffered = _buffered;
	if (ready) init();
});

ipcRenderer.on('data', (event, data) => {
	if (ready) {
		terminal.write(data.replace(/\n/gm, '\r\n'));
	} else {
		buffered += data;
	}
});

terminal.loadWebfontAndOpen(document.querySelector('main')).then(() => {
	ready = true;
	if (buffered !== null) init();
});