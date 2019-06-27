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
	[Types.MAP]: {
		path: path.join(__dirname, '..', 'data', 'maps'),
		create: true,
		ext: 'map'
	},
	[Types.MAP_CUSTOM]: {
		path: path.join(myTempDir, 'custom_maps'),
		ext: 'map'
	}
}

Object.values(TypeDirMap).forEach(({ path, create }) => {
	if (!create) {
		return;
	}
	if (!fs.existsSync(path)) {
		console.log('Creating application directory', path);
		fs.mkdirSync(path);
	}
});

ipc.on('saveFile', (event, { id, __data }) => {
	try {
		const { type, data } = __data;
		let myPath = __data.path;
		// first remove any problem things in the filename
		myPath = myPath.replace(['..'], '');
	
		const dirObj = TypeDirMap[type];
	
		if (!dirObj) {
			throw new Error(`Invalid file type ${type}`);
		}
		
		const dir = dirObj.path;
		
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

ipc.on('loadFile', (event, { id, __data }) => {
	try {
		const { type } = __data;
		let myPath = __data.path;
		// first remove any problem things in the filename
		myPath = myPath.replace(['..'], '');
	
		const dirObj = TypeDirMap[type];
	
		if (!dirObj) {
			throw new Error(`Invalid file type ${type}`);
		}
		
		const dir = dirObj.path;
		
		const fullPath = path.join(dirObj.path, `${myPath}.${dirObj.ext}`);
		console.log('going to load file', fullPath);
		
		const data = fs.readFileSync(fullPath, 'utf8');
		let dataJson;
		try {
			dataJson = JSON.parse(data);
		} catch (error) {
			throw new Error('error processing json, got ', data);
		}
		
		event.sender.send('response', {
			id,
			success: true,
			data: dataJson
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

ipc.on('getFileList', (event, { id, __data }) => {
	try {
		const { type } = __data;
	
		const dirObj = TypeDirMap[type];
	
		if (!dirObj) {
			throw new Error(`Invalid file type ${type}`);
		}
		
		fs.readdir(dirObj.path, function(err, items) {
			try {
				const resultItems = [];
			    for (var i=0; i<items.length; i++) {
					const ext = path.extname(items[i]);
					if (ext === `.${dirObj.ext}`) {
						resultItems.push(path.basename(items[i], ext));
					}
			    }
			
				event.sender.send('response', {
					id,
					success: true,
					data: resultItems
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