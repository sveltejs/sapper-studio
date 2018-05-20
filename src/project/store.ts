import { remote, ipcRenderer } from 'electron';
import { Store } from 'svelte/store.js';

const store = new Store({
	dir: remote.getCurrentWindow().dir,
	metaKey: /win/i.test(navigator.platform) ? 'Ctrl' : 'Cmd'
});

ipcRenderer.on('started-app', (event, port) => {
	store.set({
		running: true,
		port
	});
});

export default store;