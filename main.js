const electron = require('electron');
const path = require('path');
const url = require('url');
require('electron-reload')(__dirname);
process.env.NODE_ENV = 'development'; // setting app environment 
const { app, BrowserWindow, Menu } = electron;
let mainWindow;
let addWindow;


// getting data from json file to find out if user is logged in or not
const fs = require('fs');
let rawData = fs.readFileSync('userLoginStatus.json');
let getUserLoginStatus = JSON.parse(rawData);


// Listen for app to be ready
app.on('ready', async () => {
	// Create new window
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			nativeWindowOpen: true,
		}
	});

	// based on if user is logged in or not, redirect to respective page
	if ((getUserLoginStatus.isUserLoggedIn) == "true") {
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'views', 'home.html'),
			protocol: 'file:',
			slashes: true
		}));
	} else {
		mainWindow.loadURL(url.format({
			pathname: path.join(__dirname, 'views', 'login.html'),
			protocol: 'file:',
			slashes: true
		}));
	}

	// Quit app when closed
	mainWindow.on('closed', function () {
		app.quit();
	});

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const mainMenuTemplate = [
	{
		label: ''
	}
];

// If OSX, add empty object to menu
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				role: 'reload'
			},
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}