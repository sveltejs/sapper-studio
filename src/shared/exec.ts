import * as child_process from 'child_process';

export default function exec(cmd, opts) {
	return new Promise((fulfil, reject) => {
		child_process.exec(cmd, opts, (err, stdout, stderr) => {
			if (err) reject(err);
			else fulfil({ stdout, stderr });
		});
	});
}