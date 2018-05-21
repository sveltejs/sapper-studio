import App from './project/App.html';

const app = new App({
	target: document.body
});

window.addEventListener('onbeforeunload', () => {
	app.destroy();
});