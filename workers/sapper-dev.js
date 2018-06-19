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
});

watcher.on('stdout', data => {
	process.stdout.write(data);
});

watcher.on('stderr', data => {
	process.stderr.write(data);
});

['error', 'fatal', 'invalid', 'build', 'basepath'].forEach(type => {
	watcher.on(type, event => {
		process.send({
			type,
			event
		});
	});
});

process.on('message', message => {
	if (message === 'close') {
		watcher.close();
		process.exit(0);
	}
});