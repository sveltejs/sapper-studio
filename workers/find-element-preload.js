// not technically a worker but whatever

const { ipcRenderer } = require('electron');

window.selectElement = element => {
	ipcRenderer.sendToHost('select-element', element.__svelte_meta);
};