const path = require('path');
const chokidar = require('chokidar');

const watchers = {};

process.on('message', event => {
	const { dir, command } = event;

	if (command === 'start-watching') {
		const watcher = chokidar.watch(path.join(dir, '*'), {
			ignoreInitial: true
		});

		const handler = () => {
			process.send({
				type: 'directory-changed',
				dir
			});
		};

		watcher.on('add', handler);
		watcher.on('unlink', handler);
		watcher.on('addDir', handler);
		watcher.on('unlinkDir', handler);

		if (watchers[dir]) {
			throw new Error(`Watcher already exists`);
		}

		watchers[dir] = watcher;
	}

	if (command === 'stop-watching') {
		const watcher = watchers[dir];
		if (!watcher) {
			throw new Error(`Watcher does not exist`);
		}

		watcher.close();
		watchers[dir] = null;
	}
});