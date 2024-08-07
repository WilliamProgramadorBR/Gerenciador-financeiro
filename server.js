const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();

// Configurar CORS
app.use(cors());
app.use(express.json());

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

// Configurar o servidor
async function startServer() {
  const db = await setupDatabase();

  // Rotas
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

  // Iniciar o servidor
  const PORT = process.env.PORT || 3008;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar o servidor:', err);
});
