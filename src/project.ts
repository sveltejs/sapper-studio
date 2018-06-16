import App from './project/App.html';
import store from './project/store.js';

const app = new App({
	target: document.body
});

store.set({ inited: true });

window.addEventListener('onbeforeunload', () => {
	app.destroy();
});