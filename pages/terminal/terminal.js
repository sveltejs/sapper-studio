const { Terminal } = require('xterm');
const { ipcRenderer } = require('electron');
const fit = require('xterm/lib/addons/fit/fit');
const WebfontLoader = require('xterm-webfont');
const pty = require('node-pty');
const defaultShell = require('default-shell');

let proc;
let terminal;
let dir;
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
		background: '#222'
	}
});

function init() {
	proc = pty.spawn(defaultShell, ['--login'], {
		name: 'xterm-color',
		cols: 80,
		rows: 40,
		cwd: dir,
		env: process.env
	});

	proc.on('data', data => {
		terminal.write(data);
	});

	terminal.on('resize', ({ cols, rows }) => {
		proc.resize(cols, Math.max(rows, 10));
	});

	terminal.fit();

	terminal.on('data', data => {
		proc.write(data);
	});

	terminal.on('title', title => {
		ipcRenderer.sendToHost('title', title);
	});

	window.addEventListener('resize', () => {
		terminal.fit();
	});
}

ipcRenderer.on('dir', (event, _dir) => {
	dir = _dir;
	if (ready) init();
});

terminal.loadWebfontAndOpen(document.querySelector('main')).then(() => {
	ready = true;
	if (dir) init();
});

window.addEventListener('focus', () => {
	terminal.focus();
});

window.addEventListener('blur', () => {
	terminal.blur();
});