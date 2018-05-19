import * as fs from 'fs';

export default function readJSON(file) {
	return fs.existsSync(file)
		? JSON.parse(fs.readFileSync(file, 'utf-8'))
		: null;
}