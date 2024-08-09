const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let mainWindow;
let server;

// Defina o caminho para o ícone PNG
const iconPath = path.join(__dirname, 'imgelectron', 'image.png');

// Criar a janela do Electron
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

// Configurar e abrir o banco de dados
async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  // Criar as tabelas
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

// Configurar o servidor Express
async function startServer() {
  const app = express();
  const db = await setupDatabase();

  app.use(cors());
  app.use(express.json());

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

// Inicializar o Electron e o servidor
app.on('ready', async () => {
  createWindow();
  await startServer();
});

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
