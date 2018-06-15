const relative = require('require-relative');

const { dev } = relative('sapper/api.js', process.cwd());

const watcher = dev({
	port: process.env.PORT
});

watcher.on('ready', event => {
	process.send({
		type: 'ready',
		port: event.port
	});

	event.process.stdout.on('data', data => {
		process.stdout.write(data);
	});

	event.process.stderr.on('data', data => {
		process.stderr.write(data);
	});
});

['error', 'fatal', 'invalid', 'build', 'basepath'].forEach(type => {
	watcher.on(type, event => {
		process.send({
			type,
			event
		});
	});
});