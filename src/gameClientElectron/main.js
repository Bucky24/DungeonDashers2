const electron = require('electron');
const ipc = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

app.on('ready', () => {
	const test = process.env.NODE_ENV === 'development';
	const normalWidth = test ? 1300 : 800;
	mainWindow = new BrowserWindow({
    	height: 800,
    	width: normalWidth
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