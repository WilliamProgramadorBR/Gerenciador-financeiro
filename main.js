const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const http = require('http');


const setupDatabase = require('./backend/conexao_db');
const routes = require('./backend/apis');
let mainWindow;
let server;
const REACT_URL = 'http://localhost:3000'; // URL da interface React
const iconPath = path.join(__dirname, 'imgelectron', 'image.png');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false,
      enableRemoteModule: false,
    }
  });

  // Exibir a página de carregamento
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  // Quando a aplicação estiver pronta, escutar o evento do React para redirecionar
  ipcMain.on('react-ready', () => {
    mainWindow.loadURL('http://localhost:3000'); // Substitua com a URL correta
  });

  // Interceptar a abertura de novos links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' }; // Impede que o link seja aberto na janela do Electron
    }
    return { action: 'allow' }; // Permite a abertura na janela do Electron se não for um link externo
  });

  // Adicionar o menu de desenvolvimento apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const menu = Menu.buildFromTemplate([
      {
        label: 'DevTools',
        submenu: [
          { role: 'reload' },
          { role: 'toggleDevTools' }
        ]
      }
    ]);
    Menu.setApplicationMenu(menu);
  } else {
    Menu.setApplicationMenu(null); // Remove o menu da aplicação na produção
  }

  // Opcional: Esconder o menu de contexto
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });
}

app.whenReady().then(createWindow);

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

async function startServer() {
  const app = express();
  const db = await setupDatabase();

  app.use(cors());
  app.use(express.json());

  app.use('/', routes);
  // Iniciar o servidor
  const PORT = process.env.PORT || 3008;
  server = app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
} 


function startReactServer() {
  const projectRoot = path.join(__dirname); 

  exec('npm start', { cwd: projectRoot }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao executar o comando: ${error}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

async function checkServerStatus() {
  const check = () => {
    return new Promise((resolve) => {
      http.get(REACT_URL, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          console.log(`Status code recebido: ${res.statusCode}`);
          resolve(false);
        }
      }).on('error', (err) => {
        console.error(`Erro durante a requisição: ${err.message}`);
        resolve(false);
      });
    });
  };

  while (true) {
    const isServerUp = await check();
    if (isServerUp) {
      console.log('Servidor React iniciado com sucesso!');
      mainWindow.loadURL(REACT_URL); // Carrega o URL da interface React
      break;
    }
    console.log('Aguardando servidor React iniciar...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguardar 1 segundo antes de verificar novamente
  }
}

app.on('ready', async () => {
  await startServer();
  startReactServer();
  checkServerStatus(); // Verifica se o servidor React está rodando
});
