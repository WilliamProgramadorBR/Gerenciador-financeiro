const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      profile_picture TEXT  
    );
  `);
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS email_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service TEXT NOT NULL,
      user TEXT NOT NULL,
      pass TEXT NOT NULL,
      host TEXT,
      port INTEGER,
      secure INTEGER
    )
  `);
  await db.exec(`
     CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    frequency TEXT NOT NULL,
    date TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);
  

  console.log('Tabelas criadas com sucesso!');
  return db;
}

module.exports = setupDatabase;
