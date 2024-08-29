const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');
const  setupDatabase  = require('../conexao_db/index');
const { calculatePercentages, analyzeFinancialHealth } = require('../algoritmos/index'); // Importe a função que configura o banco de dados
const IBGE_NEWS_API_URL = 'http://servicodados.ibge.gov.br/api/v3/noticias/'; // Defina a URL da API de notícias aqui

// Login
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await setupDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (user) {
      res.status(200).json({ message: 'Login bem-sucedido', user });
    } else {
      res.status(401).send('Credenciais inválidas');
    }
  } catch (err) {
    res.status(500).send('Erro ao autenticar o usuário');
  }
});

// Register
router.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const db = await setupDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (user) {
      return res.status(400).send('Usuário já cadastrado');
    }
    await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar o usuário');
  }
});

// Ganhos
router.get('/api/ganhos', async (req, res) => {
  try {
    const db = await setupDatabase();
    const ganhos = await db.all('SELECT * FROM ganhos');
    res.json(ganhos);
  } catch (err) {
    res.status(500).send('Erro ao buscar os ganhos');
  }
});

router.post('/api/ganhos', async (req, res) => {
  const { description, amount, type, frequency, date } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('INSERT INTO ganhos (description, amount, type, frequency, date) VALUES (?, ?, ?, ?, ?)', [description, amount, type, frequency, date]);
    res.status(201).send('Ganho adicionado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao adicionar o ganho');
  }
});

// Gastos
router.get('/api/gastos', async (req, res) => {
  try {
    const db = await setupDatabase();
    const gastos = await db.all('SELECT * FROM gastos');
    res.json(gastos);
  } catch (err) {
    res.status(500).send('Erro ao buscar os gastos');
  }
});
router.get('/api/report', async (req, res) => {
    try {
      // Obter todos os registros da tabela
      const db = await setupDatabase();
      const records = await db.all('SELECT * FROM ganhos');
    
      // Separar ganhos e gastos
      const ganhos = records.filter(record => record.type === 'entrada');
      const gastos = records.filter(record => record.type === 'saída');
    
      // Encontrar o gasto com o maior impacto
      const highestExpense = gastos.reduce((max, expense) => expense.amount > max.amount ? expense : max, { amount: 0 });
    
      // Calcular percentuais e gerar relatórios
      const result = calculatePercentages(ganhos, gastos, highestExpense);
      
      // Enviar o resultado como resposta
      res.json(result);
    } catch (err) {
      console.error('Erro ao buscar os dados do relatório:', err);
      res.status(500).send('Erro ao buscar os dados do relatório');
    }
  });
  router.get('/api/prevision', async (req, res) => {
    try {
      // Obter todos os registros da tabela
      const db = await setupDatabase();
      const records = await db.all('SELECT * FROM ganhos');
    
      // Separar ganhos e gastos
      const ganhos = records.filter(record => record.type === 'entrada');
      const gastos = records.filter(record => record.type === 'saída');
    const relatorio = analyzeFinancialHealth(ganhos, gastos)
  
      res.json(relatorio);
    } catch (err) {
      console.error('Erro ao buscar os dados do relatório:', err);
      res.status(500).send('Erro ao buscar os dados do relatório');
    }
  }); // Api responsável por analisar as informações geral do usuário de forma anual
router.post('/api/gastos', async (req, res) => {
  const { description, amount, type, frequency, date } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('INSERT INTO gastos (description, amount, type, frequency, date) VALUES (?, ?, ?, ?, ?)', [description, amount, type, frequency, date]);
    res.status(201).send('Despesa adicionada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao adicionar a despesa');
  }
});

// Atualizar ganhos
router.put('/api/ganhos/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, frequency, date } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('UPDATE ganhos SET description = ?, amount = ?, type = ?, frequency = ?, date = ? WHERE id = ?', [description, amount, type, frequency, date, id]);
    res.status(200).send('Ganho atualizado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar o ganho');
  }
});

// Atualizar gastos
router.put('/api/gastos/:id', async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, frequency, date } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('UPDATE gastos SET description = ?, amount = ?, type = ?, frequency = ?, date = ? WHERE id = ?', [description, amount, type, frequency, date, id]);
    res.status(200).send('Despesa atualizada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar a despesa');
  }
});

// Deletar ganhos
router.delete('/api/ganhos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await setupDatabase();
    await db.run('DELETE FROM ganhos WHERE id = ?', [id]);
    res.status(200).send('Ganho excluído com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir o ganho');
  }
});

// Deletar gastos
router.delete('/api/gastos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await setupDatabase();
    await db.run('DELETE FROM gastos WHERE id = ?', [id]);
    res.status(200).send('Despesa excluída com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir a despesa');
  }
});

// Relatório

  
  router.get('/api/email-settings', async (req, res) => {
    try {
      const db = await setupDatabase();
      const settings = await db.get('SELECT * FROM email_settings WHERE id = 1');
      res.json(settings || {});
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      res.status(500).json({ message: 'Erro ao buscar configurações.' });
    }
  });

// Configurações de e-mail
router.get('/api/email-settings', async (req, res) => {
  try {
    const db = await setupDatabase();
    const settings = await db.get('SELECT * FROM email_settings WHERE id = 1');
    res.json(settings || {});
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ message: 'Erro ao buscar configurações.' });
  }
});

router.put('/api/email-settings', async (req, res) => {
  try {
    const { service, user, pass, host, port, secure } = req.body;
    const db = await setupDatabase();
    await db.run('INSERT OR REPLACE INTO email_settings (id, service, user, pass, host, port, secure) VALUES (1, ?, ?, ?, ?, ?, ?)', [service, user, pass, host, port, secure]);
    res.json({ message: 'Configurações salvas com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    res.status(500).json({ message: 'Erro ao salvar configurações.' });
  }
});

// Notícias
router.get('/api/noticias', async (req, res) => {
  try {
    const response = await axios.get(IBGE_NEWS_API_URL);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao buscar dados da API');
  }
});

// Enviar relatório por e-mail
router.post('/api/send-report', async (req, res) => {
  try {
    const db = await setupDatabase();
    const settings = await db.get('SELECT * FROM email_settings WHERE id = 1');

    if (!settings) {
      return res.status(400).json({ message: 'Configurações de e-mail não encontradas.' });
    }

    const { reportText } = req.body;

    if (!reportText) {
      return res.status(400).json({ message: 'Texto do relatório não fornecido.' });
    }

    const transporter = nodemailer.createTransport({
      service: settings.service,
      auth: {
        user: settings.user,
        pass: settings.pass
      },
      host: settings.host,
      port: settings.port,
      secure: settings.secure
    });

    const mailOptions = {
      from: settings.user,
      to: settings.user,
      subject: 'Relatório Financeiro',
      text: reportText,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.' });
  }
});

module.exports = router;
