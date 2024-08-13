const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { exec } = require('child_process');
const http = require('http');

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
      nodeIntegration: false
    }
  });

  // Exibir a página de carregamento enquanto os servidores são iniciados
  mainWindow.loadFile(path.join(__dirname, 'loading.html'));

  ipcMain.on('focus-main-window', () => {
    if (mainWindow) {
      mainWindow.focus();
    }
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

async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      frequency TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ganhos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      frequency TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  console.log('Tabelas criadas com sucesso!');
  return db;
}

async function startServer() {
  const app = express();
  const db = await setupDatabase();

  app.use(cors());
  app.use(express.json());

  app.post('/api/login', async (req, res) => {
    const {email, password } = req.body;
    console.log("Bateu no banco " + email, password)
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
      if (user) {
      
        res.status(200).json({ message: 'Login bem-sucedido', user });
        console.log(user)
      } else {
        res.status(401).send('Credenciais inválidas');
      }
    } catch (err) {
      res.status(500).send('Erro ao autenticar o usuário');
    }
  });
  // Rota para cadastro de novos usuários
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password)
  try {
    // Verificar se o usuário já existe
    const user = await db.get('SELECT * FROM users WHERE username = ?', [email]);
    if (user) {
      return res.status(400).send('Usuário já cadastrado');
    }

    // Adicionar novo usuário
    await db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar o usuário');
  }
});


  // Rotas para ganhos
  app.get('/api/ganhos', async (req, res) => {
    try {
      const ganhos = await db.all('SELECT * FROM ganhos');
      res.json(ganhos);
    } catch (err) {
      res.status(500).send('Erro ao buscar os ganhos');
    }
  });

  app.post('/api/ganhos', async (req, res) => {
    const { description, amount, type, frequency, date } = req.body;
    try {
      await db.run(
        'INSERT INTO ganhos (description, amount, type, frequency, date) VALUES (?, ?, ?, ?, ?)',
        [description, amount, type, frequency, date]
      );
      res.status(201).send('Ganho adicionado com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao adicionar o ganho');
    }
  });

  // Rotas para gastos
  app.get('/api/gastos', async (req, res) => {
    try {
      const gastos = await db.all('SELECT * FROM gastos');
      res.json(gastos);
    } catch (err) {
      res.status(500).send('Erro ao buscar os gastos');
    }
  });

  app.post('/api/gastos', async (req, res) => {
    const { description, amount, type, frequency, date } = req.body;
    try {
      await db.run(
        'INSERT INTO gastos (description, amount, type, frequency, date) VALUES (?, ?, ?, ?, ?)',
        [description, amount, type, frequency, date]
      );
      res.status(201).send('Despesa adicionada com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao adicionar a despesa');
    }
  });
  app.put('/api/ganhos/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount, type, frequency, date } = req.body;
    try {
      await db.run(
        'UPDATE ganhos SET description = ?, amount = ?, type = ?, frequency = ?, date = ? WHERE id = ?',
        [description, amount, type, frequency, date, id]
      );
      res.status(200).send('Ganho atualizado com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao atualizar o ganho');
    }
  });
  
  // Atualizar gastos
  app.put('/api/gastos/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount, type, frequency, date } = req.body;
    try {
      await db.run(
        'UPDATE gastos SET description = ?, amount = ?, type = ?, frequency = ?, date = ? WHERE id = ?',
        [description, amount, type, frequency, date, id]
      );
      res.status(200).send('Despesa atualizada com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao atualizar a despesa');
    }
  });
  
  app.delete('/api/ganhos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.run('DELETE FROM ganhos WHERE id = ?', [id]);
      res.status(200).send('Ganho excluído com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao excluir o ganho');
    }
  });
  
  // Excluir gastos
  app.delete('/api/gastos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.run('DELETE FROM gastos WHERE id = ?', [id]);
      res.status(200).send('Despesa excluída com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao excluir a despesa');
    }
  });
  // Iniciar o servidor
  const PORT = process.env.PORT || 3008;
  server = app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
}

function startReactServer() {
  const projectRoot = path.join(__dirname); // Caminho para o diretório raiz do projeto

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
