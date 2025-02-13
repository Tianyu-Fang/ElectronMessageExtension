// main.js

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let flaskServer;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Load React app
    mainWindow.loadURL('http://localhost:5173'); // React dev server

    mainWindow.on('closed', function () {
        mainWindow = null;
        if (flaskServer) {
            flaskServer.kill();
        }
    });
}

function startFlaskServer() {
    const flaskPath = path.join(__dirname, 'backend', 'server.py');
    flaskServer = spawn('python', [flaskPath]);

    flaskServer.stdout.on('data', (data) => {
        console.log(`Flask: ${data}`);
    });

    flaskServer.stderr.on('data', (data) => {
        console.error(`Flask Error: ${data}`);
    });

    flaskServer.on('close', (code) => {
        console.log(`Flask server exited with code ${code}`);
    });
}

app.on('ready', () => {
    startFlaskServer();
    createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});
