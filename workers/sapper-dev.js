const relative = require('require-relative');

const { dev } = relative('sapper/api.js', process.cwd());

const watcher = dev({});

watcher.on('ready', event => {
	process.send({
		type: 'ready',
		port: event.port
	});

	event.process.stdout.on('data', data => {
		process.stdout.write('stdout' + data);
	});

	event.process.stderr.on('data', data => {
		process.stderr.write('stderr' + data);
	});
});

watcher.on('error', event => {
	process.send({
		type: 'error',
		event
	});
});

watcher.on('fatal', event => {
	process.send({
		type: 'fatal',
		event
	});
});

watcher.on('invalid', event => {
	process.send({
		type: 'invalid',
		event
	});
});

watcher.on('build', event => {
	process.send({
		type: 'build',
		event
	});
});