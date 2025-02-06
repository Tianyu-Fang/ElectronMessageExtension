const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let floatingIcon;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('http://localhost:5173'); // React dev server

    // Floating icon window (will appear on text selection)
    floatingIcon = new BrowserWindow({
        width: 40,
        height: 40,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    floatingIcon.loadURL('http://localhost:5173/icon'); // React floating icon page
    floatingIcon.hide();

    ipcMain.on('show-icon', (event, { x, y }) => {
        floatingIcon.setBounds({ x, y, width: 40, height: 40 });
        floatingIcon.show();
    });

    ipcMain.on('hide-icon', () => {
        floatingIcon.hide();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
