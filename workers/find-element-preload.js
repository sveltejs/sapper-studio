// not technically a worker but whatever

const { ipcRenderer } = require('electron');

window.__selectElement = element => {
	ipcRenderer.sendToHost('select-element', element.__svelte_meta.loc);
};