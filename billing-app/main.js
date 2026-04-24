const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'build/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App ready aayal window open cheyyum
app.whenReady().then(createWindow);

// Mac support (optional but good)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Close all windows → app quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});