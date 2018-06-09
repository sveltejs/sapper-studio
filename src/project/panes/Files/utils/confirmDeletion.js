import { remote } from 'electron';

export default function confirmDeletion(file) {
	const { dialog } = remote;

	dialog.showMessageBox(remote.getCurrentWindow(), {
		type: 'question',
		buttons: ['Cancel', 'Move to trash'],
		defaultId: 1,
		cancelId: 0,
		message: `Are you sure?`,
		detail: `This will move '${file}' to the trash`
	}, async index => {
		if (index === 1) {
			const rimraf = await import('rimraf');
			rimraf(file, err => {
				if (err) console.error(err);
			});
		}
	});
}