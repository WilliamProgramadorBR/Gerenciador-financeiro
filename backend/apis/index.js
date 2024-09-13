const express = require('express');
const router = express.Router();
const axios = require('axios');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const  setupDatabase  = require('../conexao_db/index');
const { calculatePercentages } = require('../algoritmos/index');
const {analyzeFinancialTrendsIA} = require('../rede_neurais') // Importe a função que configura o banco de dados
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
router.get('/api/transactions', async (req, res) => {//ajustada
  try {
    const db = await setupDatabase();
    
    // Recuperar o id_user da query string
    const { id_user } = req.query;
    
    if (!id_user) {
      return res.status(400).send('Parâmetro id_user é obrigatório');
    }
    
    // Validar se id_user é um número
    if (isNaN(Number(id_user))) {
      return res.status(400).send('id_user deve ser um número válido');
    }
    
    // Consultar ganhos baseado no id_user
    const ganhos = await db.all('SELECT * FROM transactions WHERE user_id = ?', [id_user]);
    
    res.json(ganhos);
  } catch (err) {
    console.error(err); // Adicione um log para rastrear o erro
    res.status(500).send('Erro ao buscar os ganhos');
  }
});



router.post('/api/transactions', async (req, res) => {//ajustada
  const { description, amount, type, frequency, date, id_user } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('INSERT INTO transactions (description, amount, type, frequency, date, user_id) VALUES (?, ?, ?, ?, ?, ?)', [description, amount, type, frequency, date, id_user]);
    res.status(201).send('Ganho adicionado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao adicionar o ganho');
  }
});



router.put('/api/transactions/:id', async (req, res) => {//ajustado
  const { id } = req.params;
  const { description, amount, type, frequency, date } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('UPDATE transactions SET description = ?, amount = ?, type = ?, frequency = ?, date = ? WHERE id = ?', [description, amount, type, frequency, date, id]);
    res.status(200).send('Ganho atualizado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar o ganho');
  }
});

// Atualizar gastos
router.put('/api/gastos/:id', async (req, res) => {//ajustado
  const { id } = req.params;
  const { description, amount, type, frequency, date } = req.body;
  try {
    const db = await setupDatabase();
    await db.run('UPDATE transactions SET description = ?, amount = ?, type = ?, frequency = ?, date = ? WHERE id = ?', [description, amount, type, frequency, date, id]);
    res.status(200).send('Despesa atualizada com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao atualizar a despesa');
  }
});

// Deletar ganhos
router.delete('/api/transactions/:id', async (req, res) => {//ajustado
  const { id } = req.params;
  try {
    const db = await setupDatabase();
    await db.run('DELETE FROM transactions WHERE id = ?', [id]);
    res.status(200).send('Ganho excluído com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao excluir o ganho');
  }
});



router.get('/api/report', async (req, res) => {//ajustado
  try {
    // Obter o id_user da query string
    const { id_user } = req.query;

    // Verificar se id_user foi fornecido
    if (!id_user) {
      return res.status(400).send('ID do usuário é necessário');
    }

    // Verificar se id_user é um número
    if (isNaN(Number(id_user))) {
      return res.status(400).send('ID do usuário inválido');
    }

    const db = await setupDatabase();

    // Obter todos os registros da tabela filtrados pelo id_user
    const records = await db.all('SELECT * FROM transactions WHERE user_id = ?', [id_user]);

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

router.get('/api/prevision', async (req, res) => {//ajustado
  try {
    // Obter o id_user da query string
    const { id_user } = req.query;

    // Verificar se id_user foi fornecido
    if (!id_user) {
      return res.status(400).send('ID do usuário é necessário');
    }

    // Verificar se id_user é um número
    if (isNaN(Number(id_user))) {
      return res.status(400).send('ID do usuário inválido');
    }

    const db = await setupDatabase();

    // Obter todos os registros da tabela filtrados pelo id_user
    const records = await db.all('SELECT * FROM transactions WHERE user_id = ?', [id_user]);

    // Separar ganhos e gastos
    const ganhos = records.filter(record => record.type === 'entrada');
    const gastos = records.filter(record => record.type === 'saída');

    // Analisar tendências financeiras com IA
    const relatorio = analyzeFinancialTrendsIA(ganhos, gastos);

    // Enviar o relatório como resposta
    res.json(relatorio);
  } catch (err) {
    console.error('Erro ao buscar os dados do relatório:', err);
    res.status(500).send('Erro ao buscar os dados do relatório');
  }
});
 // Api responsável por analisar as informações geral do usuário de forma anual


// Atualizar ganhos


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


const uploadDirectory = path.join(__dirname, 'uploads'); // Defina o diretório de upload

// Middleware para upload de arquivos
router.use(fileUpload());

// Rota para upload da imagem de perfil
router.post('/api/upload-profile-picture', async (req, res) => {
  const userId = req.query.userId; // Obtém o ID do usuário a partir dos parâmetros da query
  console.log('User ID:', userId); // Log do ID do usuário para debug

  // Verifica se há um arquivo na requisição
  if (!req.files || !req.files.profile_picture) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  const profilePicture = req.files.profile_picture;
  if (!Array.isArray(profilePicture)) {
    const extension = path.extname(profilePicture.name); // Obtém a extensão do arquivo
    const fileName = `${userId}-${Date.now()}${extension}`; // Nome único baseado no ID do usuário e no timestamp
    const filePath = path.join(uploadDirectory, fileName);

    // Move o arquivo para o diretório de destino
    profilePicture.mv(filePath, async (err) => {
      if (err) {
        console.error('Erro ao mover o arquivo:', err);
        return res.status(500).send('Erro ao salvar o arquivo.');
      }

      try {
        // Atualiza o caminho da imagem no banco de dados
        const db = await setupDatabase();
        await db.run('UPDATE users SET profile_picture = ? WHERE id = ?', [filePath, userId]);
        
        res.json({ filePath });
      } catch (error) {
        console.error('Erro ao atualizar o banco de dados:', error);
        res.status(500).send('Erro ao atualizar o banco de dados.');
      }
    });
  } else {
    res.status(400).send('Erro no upload do arquivo.');
  }
});

router.get('/api/get-profile-picture', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send('ID do usuário não fornecido.');
  }

  try {
    const db = await setupDatabase();
    const user = await db.get('SELECT profile_picture FROM users WHERE id = ?', [userId]);

    if (user && user.profile_picture) {
      const filePath = path.resolve(user.profile_picture);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send('Imagem do perfil não encontrada.');
      }
    } else {
      res.status(404).send('Imagem do perfil não encontrada.');
    }
  } catch (error) {
    console.error('Erro ao buscar a imagem do perfil:', error);
    res.status(500).send('Erro ao buscar a imagem do perfil.');
  }
});
module.exports = router;
