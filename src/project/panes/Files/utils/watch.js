import path from 'path';
import child_process from 'child_process';

let watcherProc;
const subscribers = {};

export default function watch(dir, component) {
	if (!watcherProc) {
		const worker = path.resolve(__dirname, '../workers/watch-directory.js');
		watcherProc = child_process.fork(worker, {
			cwd: process.cwd()
		});

		watcherProc.on('message', message => {
			if (message.type === 'directory-changed') {
				const components = subscribers[message.dir];
				if (components) {
					components.forEach(component => {
						component.updateContents();
					});
				}
			}
		});
	}

	const components = (subscribers[dir] || (subscribers[dir] = []));
	components.push(component);

	if (components.length === 1) {
		watcherProc.send({
			command: 'start-watching',
			dir
		});
	}

	return {
		close() {
			const index = components.indexOf(component);
			if (index !== -1) components.splice(index, 1);

			if (components.length === 0) {
				watcherProc.send({
					command: 'stop-watching',
					dir
				});
			}
		}
	};
}