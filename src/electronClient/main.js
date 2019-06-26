/**
 * This file serves as the entry point for both the editor and the game.
 */

const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const fs = require('fs');
const { Types } = require('../common/system/systemCommon');

const tempDir = process.env.APPDATA || (process.platform == 'darwin'
	? path.join(process.env.HOME, 'Library', 'Preferences')
	: path.join(process.env.HOME, '.local', 'share'));
const myTempDir = path.join(tempDir, 'dd2');

if (!fs.existsSync(myTempDir)) {
	console.log('Creating application directory', myTempDir);
	fs.mkdirSync(myTempDir);
}

const TypeDirMap = {
	[Types.MAP]: path.join(myTempDir, 'custom_maps')
}

Object.values(TypeDirMap).forEach((dir) => {
	if (!fs.existsSync(dir)) {
		console.log('Creating application directory', dir);
		fs.mkdirSync(dir);
	}
});

ipc.on('saveFile', (event, { id, __data }) => {
	try {
		const { type, data } = __data;
		let myPath = __data.path;
		// first remove any problem things in the filename
		myPath = myPath.replace(['..'], '');
	
		const dir = TypeDirMap[type];
	
		if (!dir) {
			throw new Error(`Invalid file type ${type}`);
		}
		
		const fullPath = path.join(dir, myPath);
		console.log('going to save file', fullPath);
		
		const dataJson = JSON.stringify(data, null, 4);
		
		fs.writeFileSync(fullPath, dataJson);
		
		event.sender.send('response', {
			id,
			success: true,
			data: fullPath
		});
	} catch (error) {
		console.error(error);
		event.sender.send('response', {
			id,
			success: false,
			error: error.message
		});
	}
});

app.on('ready', () => {
	const test = process.env.NODE_ENV === 'development';
	const normalWidth = test ? 1300 : 800;
	mainWindow = new BrowserWindow({
    	height: 800,
    	width: normalWidth,
		webPreferences: {
			nodeIntegration: true
		}
  	});
 
	// load the local HTML file
	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').resolve(__dirname, '../../build/index.html')
	});
	//console.log(url)
	mainWindow.loadURL(url);
	if (test) {
		mainWindow.webContents.openDevTools();
	}
})