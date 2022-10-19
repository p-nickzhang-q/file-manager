const {app, BrowserWindow} = require('electron');


const NODE_ENV = process.env.NODE_ENV;
const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 2000,
        height: 1800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    require('@electron/remote/main').initialize()
    require('@electron/remote/main').enable(win.webContents)
    win.webContents.openDevTools()

    win.loadURL(
        NODE_ENV === "development" ? "http://localhost:3001" : `file://${path.join(__dirname, '../dist/index.html')}`
    );
    // win.loadURL("http://localhost:3000")
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
