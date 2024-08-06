const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

// Defina o caminho para o ícone PNG
const iconPath = path.join(__dirname, 'imgelectron', 'image.png'); // Atualize com o caminho correto para o seu ícone PNG

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath, // Use o caminho do ícone aqui
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Comunicação entre processos
ipcMain.on('toMain', (event, args) => {
  console.log(args);
  event.reply('fromMain', 'Pong');
});
