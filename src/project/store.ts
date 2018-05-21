import { remote, ipcRenderer } from 'electron';
import { Store } from 'svelte/store.js';

const store = new Store({
	dir: remote.getCurrentWindow().dir,
	metaKey: /win/i.test(navigator.platform) ? 'Ctrl' : 'Cmd'
});

store.on('update', ({ changed, current }) => {
	if (changed.selectedFile) {
		if (current.lastSelectedEditor) {
			current.lastSelectedEditor.load(current.selectedFile);
		}
	}
});

ipcRenderer.on('started-app', (event, port) => {
	store.set({
		running: true,
		port
	});
});

export default store;