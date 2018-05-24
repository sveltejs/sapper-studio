import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import * as child_process from 'child_process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import exec from './shared/exec';
import readJSON from './shared/readJSON';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let launcherWindow;
let projectWindow;
let processes = {};

const userData = app.getPath('userData');
const recent = readJSON(path.join(userData, 'recent.json')) || [];

const mode = process.env.NODE_ENV;

function reloadOnChange(win) {
	if (mode !== 'development') return { close: () => {} };

	const watcher = require('chokidar').watch(path.join(__dirname, '**'), { ignoreInitial: true });

	watcher.on('change', () => {
		win.reload();
	});

	return watcher;
}

function launch() {
	launcherWindow = new BrowserWindow({
		width: 800,
		height: 600,
		minWidth: 600,
		backgroundColor: 'white',
		titleBarStyle: 'hidden'
	});

	launcherWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, '../pages/launcher.html'),
			protocol: 'file:',
			slashes: true
		})
	);

	const watcher = reloadOnChange(launcherWindow);

	launcherWindow.on('closed', function() {
		launcherWindow = null;
		watcher.close();
	});
}

function openProject(dir) {
	launcherWindow.close();

	const index = recent.indexOf(dir);
	if (index !== -1) recent.splice(index, 1);
	recent.unshift(dir);
	while (recent.length > 5) recent.pop();
	fs.writeFileSync(path.join(userData, 'recent.json'), JSON.stringify(recent));

	projectWindow = new BrowserWindow({
		title: dir,
		backgroundColor: '#111',
		width: 1024,
		height: 768,
		titleBarStyle: 'hidden'
	});

	projectWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, `../pages/project.html`),
			protocol: 'file:',
			slashes: true
		})
	);

	const watcher = reloadOnChange(projectWindow);

	projectWindow.on('closed', function() {
		// shut down child processes
		Object.keys(processes).forEach(dir => {
			processes[dir].kill();
			processes[dir] = null;
		});

		projectWindow = null;
		watcher.close();
	});

	projectWindow.on('reload', function() {
		// shut down child processes
		Object.keys(processes).forEach(dir => {
			processes[dir].kill();
			processes[dir] = null;
		});
	});

	projectWindow.dir = dir;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', launch);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (launcherWindow === null) {
		launch();
	}
});

ipcMain.on('create-new-project', event => {
	// dialog.showSaveDialog(launcherWindow, {
	dialog.showOpenDialog(launcherWindow, {
		title: 'Create project',
		buttonLabel: 'Create project',
		properties: ['openDirectory', 'createDirectory'],
	}, async (filenames) => {
		if (!filenames) return;

		const [filename] = filenames;

		event.sender.send('status', `cloning repo to ${path.basename(filename)}...`);

		// clone repo
		const degit = require('degit');
		const emitter = degit('sveltejs/sapper-template');
		await emitter.clone(filename);

		event.sender.send('status', `installing dependencies...`);

		// install dependencies
		await exec(`npm install`, { cwd: filename });

		openProject(filename);
	});
});

ipcMain.on('open-existing-project', (event, dir) => {
	if (dir) {
		openProject(dir);
	} else {
		dialog.showOpenDialog(launcherWindow, {
			title: 'Open project',
			buttonLabel: 'Open project',
			properties: ['openDirectory'],
		}, async (filenames) => {
			if (!filenames) return;

			// bizarrely, without the setTimeout the launcher
			// window doesn't close. ????
			setTimeout(() => {
				openProject(filenames[0]);
			}, 0);
		});
	}
});