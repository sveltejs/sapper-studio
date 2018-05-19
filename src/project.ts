import { remote } from 'electron';
import App from './project/App.html';
import { Store } from 'svelte/store.js';

const store = new Store({
	dir: remote.getCurrentWindow().dir
});

new App({
	target: document.body,
	store
});