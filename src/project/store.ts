import { remote, ipcRenderer } from 'electron';
import { Store } from 'svelte/store.js';

class StudioStore extends Store {
	constructor(data) {
		super(data);
	}

	send(message, data) {
		ipcRenderer.send(message, data);
	}
}

const store = new StudioStore({
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

ipcRenderer.on('stopped-app', () => {
	store.set({
		running: false,
		port: null
	});
});

export default store;