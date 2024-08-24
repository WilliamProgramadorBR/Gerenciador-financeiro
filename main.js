const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('node:path');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { exec } = require('child_process');
const http = require('http');
const nodemailer = require('nodemailer');
const axios = require('axios')
const IBGE_NEWS_API_URL = 'http://servicodados.ibge.gov.br/api/v3/noticias/';


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


// Tabelas sql
async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });// configuração de driver do sql

  await db.exec(`
    CREATE TABLE IF NOT EXISTS gastos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      frequency TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);//Tabela criação gasto
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `);// Tabela para armazenar usuário
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
    CREATE TABLE IF NOT EXISTS ganhos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      frequency TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `); // Tabela criação ganhos// Aqui os gastos e ganhos por questão de performa inserir dentro desta tabela, logo é somente esta é utilizada.


  
  console.log('Tabelas criadas com sucesso!');
  return db;
}

// Função para rodar o Node, junto com o Electron.

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

  app.get('/api/report', async (req, res) => {
    try {
      // Obter todos os registros da tabela
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
  }); // Api responsável por analisar as informações geral do usuário de forma anual
  
  app.get('/api/email-settings', async (req, res) => {
    try {
      const db = await setupDatabase();
      const settings = await db.get('SELECT * FROM email_settings WHERE id = 1');
      res.json(settings || {});
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      res.status(500).json({ message: 'Erro ao buscar configurações.' });
    }
  });
  
  // Rota para salvar configurações de e-mail
  app.put('/api/email-settings', async (req, res) => {
    try {
      const { service, user, pass, host, port, secure } = req.body;
      const db = await setupDatabase();
      await db.run(
        'INSERT OR REPLACE INTO email_settings (id, service, user, pass, host, port, secure) VALUES (1, ?, ?, ?, ?, ?, ?)',
        [service, user, pass, host, port, secure]
      );
      res.json({ message: 'Configurações salvas com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      res.status(500).json({ message: 'Erro ao salvar configurações.' });
    }
  });
  app.get('/api/noticias', async (req, res) => {
    try {
      const response = await axios.get(IBGE_NEWS_API_URL);
      res.json(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error.response ? error.response.data : error.message);
      res.status(500).send('Erro ao buscar dados da API');
    }});
  
  // Rota para enviar relatórios por e-mail
  app.post('/api/send-report', async (req, res) => {
    try {
        const db = await setupDatabase();
        const settings = await db.get('SELECT * FROM email_settings WHERE id = 1');
    
        if (!settings) {
            return res.status(400).json({ message: 'Configurações de e-mail não encontradas.' });
        }
    
        // Receber o texto do relatório do corpo da solicitação
        const { reportText } = req.body;
    
        // Validar se o texto do relatório foi fornecido
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

        // Configurar as opções de e-mail
        const mailOptions = {
            from: settings.user,
            to: settings.user, // Envia o e-mail para o próprio usuário
            subject: 'Relatório Financeiro',
            text: reportText, // Usar o texto do relatório recebido
        };
    
        await transporter.sendMail(mailOptions);
        res.json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ message: 'Erro ao enviar e-mail.' });
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
  });// Api para salvar as despesas
  
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
  }); // Api para atualizar gastos
  
  app.delete('/api/ganhos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.run('DELETE FROM ganhos WHERE id = ?', [id]);
      res.status(200).send('Ganho excluído com sucesso!');
    } catch (err) {
      res.status(500).send('Erro ao excluir o ganho');
    }
  }); // Api para atualizar ganhos
  
  
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
} // Excluir gastos

function calculatePercentages(ganhos, gastos) {
  // Classificar ganhos e gastos
  const categorizedGains = categorizeData(ganhos);
  const categorizedExpenses = categorizeData(gastos);

  // Calcular totais
  const totalGains = categorizedGains.eventual + categorizedGains.recurring;
  const totalExpenses = categorizedExpenses.eventual + categorizedExpenses.recurring;

  // Calcular percentuais
  const eventualGains = (totalGains > 0) ? (categorizedGains.eventual / totalGains) * 100 : 0;
  const recurringGains = (totalGains > 0) ? (categorizedGains.recurring / totalGains) * 100 : 0;
  const eventualExpenses = (totalExpenses > 0) ? (categorizedExpenses.eventual / totalExpenses) * 100 : 0;
  const recurringExpenses = (totalExpenses > 0) ? (categorizedExpenses.recurring / totalExpenses) * 100 : 0;

  // Ranqueamento
  const sortedGains = ganhos.sort((a, b) => b.amount - a.amount);
  const sortedExpenses = gastos.sort((a, b) => b.amount - a.amount);

  // Gerar dicas personalizadas
  const tips = generateTips(sortedGains, sortedExpenses, categorizedGains, categorizedExpenses);

  return {
    totalGains,
    totalExpenses,
    eventualGains,
    recurringGains,
    eventualExpenses,
    recurringExpenses,
    highestExpense: sortedExpenses.length > 0 ? sortedExpenses[0].description : 'N/A',
    highestExpenseAmount: sortedExpenses.length > 0 ? sortedExpenses[0].amount : 0,
    tips,
    monthlyData: generateMonthlyData(ganhos, gastos)
  };
}

function formatCurrency(amount) {
  return `R$${amount.toFixed(2).replace('.', ',')}`;
}





// Função para categorizar os dados
function categorizeData(records) {
  const categorized = {
    eventual: 0,
    recurring: 0
  };

  records.forEach(record => {
    if (record.frequency === 'eventual') {
      categorized.eventual += record.amount;
    } else if (record.frequency === 'recorrente') {
      categorized.recurring += record.amount;
    }
  });

  return categorized;
}




function generateMonthlyData(ganhos, gastos) {
  // Função para extrair ano e mês de uma data
  const getYearMonth = (dateStr) => {
    const [year, month] = dateStr.split('-');
    return { year, month };
  };

  // Função para adicionar valores ao objeto acumulador
  const addToAcc = (acc, key, value) => {
    if (!acc[key]) {
      acc[key] = { totalGains: 0, totalExpenses: 0 };
    }
    acc[key].totalGains += value.gains || 0;
    acc[key].totalExpenses += value.expenses || 0;
  };

  // Inicializa o acumulador
  const monthlyData = {};

  // Processar ganhos
  ganhos.forEach(gain => {
    const { year, month } = getYearMonth(gain.date);
    addToAcc(monthlyData, `${year}-${month}`, { gains: gain.amount });
  });

  // Processar gastos
  gastos.forEach(expense => {
    const { year, month } = getYearMonth(expense.date);
    addToAcc(monthlyData, `${year}-${month}`, { expenses: expense.amount });
  });

  // Gerar dicas baseadas nos dados mensais
  const tips = generateMonthlyTips(monthlyData);

  return {
    monthlyData,
    tips
  };
}

function generateMonthlyTips(monthlyData) {
  let tips = [];

  Object.keys(monthlyData).forEach(period => {
    const { totalGains, totalExpenses } = monthlyData[period];

    if (totalExpenses > totalGains) {
      tips.push(`No período ${period}, seus gastos foram maiores que seus ganhos. Considere revisar seu orçamento e encontrar formas de reduzir despesas.`);
    } else if (totalGains > totalExpenses) {
      tips.push(`No período ${period}, seus ganhos foram maiores que seus gastos. Ótimo trabalho! Considere investir esse excesso ou economizar mais.`);
    } else {
      tips.push(`No período ${period}, seus ganhos e gastos foram equilibrados. Continue monitorando para manter o equilíbrio.`);
    }
  });

  return tips.join(' ');
}



function formatCurrency(amount) {
  return `R$${amount.toFixed(2).replace('.', ',')}`;
}

function generateTips(sortedGains, sortedExpenses, categorizedGains, categorizedExpenses) {
  let tips = [];

  // Calculando totais e percentuais
  const totalGains = categorizedGains.eventual + categorizedGains.recurring;
  const totalExpenses = categorizedExpenses.eventual + categorizedExpenses.recurring;

  const eventualGainsPercentage = (totalGains > 0) ? (categorizedGains.eventual / totalGains) * 100 : 0;
  const recurringGainsPercentage = (totalGains > 0) ? (categorizedGains.recurring / totalGains) * 100 : 0;
  const eventualExpensesPercentage = (totalExpenses > 0) ? (categorizedExpenses.eventual / totalExpenses) * 100 : 0;
  const recurringExpensesPercentage = (totalExpenses > 0) ? (categorizedExpenses.recurring / totalExpenses) * 100 : 0;

  // Verificar situação financeira
  if (totalGains < totalExpenses) {
    tips.push(
      `Sua situação financeira está desafiadora, com gastos superando seus ganhos. Para melhorar seu equilíbrio financeiro, considere reduzir suas despesas e explorar novas fontes de renda.\n`
    );

    // Gastos recorrentes
    if (recurringExpensesPercentage > 30) {
      tips.push(
        `Uma parte significativa de suas despesas é recorrente, representando ${recurringExpensesPercentage.toFixed(2)}% do total. Avalie suas despesas fixas, como aluguel e compras regulares. Considere pesquisar opções mais baratas para aluguel e alimentos para reduzir esses gastos.\n`
      );
    }

    // Identificar o maior gasto recorrente e eventual
    const highestRecurringExpense = sortedExpenses
      .filter(expense => expense.frequency === 'recorrente')
      .sort((a, b) => b.amount - a.amount)[0];

    const highestEventualExpense = sortedExpenses
      .filter(expense => expense.frequency === 'eventual')
      .sort((a, b) => b.amount - a.amount)[0];

    // Verificar se há um maior gasto recorrente e adicionar dica correspondente
    if (highestRecurringExpense) {
      const date = new Date(highestRecurringExpense.date).toLocaleDateString('pt-BR');
      tips.push(
        `O gasto recorrente mais impactante é "${highestRecurringExpense.description}" no valor de ${formatCurrency(highestRecurringExpense.amount)}. Este gasto ocorreu em ${date}. Tente negociar ou reduzir este valor, considerando alternativas mais econômicas.\n`
      );
    }

    // Verificar se há um maior gasto eventual e adicionar dica correspondente
    if (highestEventualExpense) {
      const date = new Date(highestEventualExpense.date).toLocaleDateString('pt-BR');
      tips.push(
        `O gasto eventual mais significativo é "${highestEventualExpense.description}" no valor de ${formatCurrency(highestEventualExpense.amount)}. Este gasto foi registrado em ${date}. Avalie se é possível cortar ou reduzir esses gastos para melhorar seu orçamento.\n`
      );
    }

    if (totalGains > 0) {
      tips.push(
        `Mesmo com os gastos elevados, seus ganhos eventuais representam ${eventualGainsPercentage.toFixed(2)}% do total de ganhos. Considere formas de aumentar esses ganhos, explorando novas oportunidades de renda.\n`
      );
    }

    tips.push(
      `Para evitar um estrangulamento financeiro, considere aumentar suas fontes de renda. Explore oportunidades de trabalho e projetos freelance. Abaixo, alguns recursos úteis:\n` +
      `- [Sites de Procura de Emprego](https://www.indeed.com.br/): Encontre novas oportunidades de trabalho.\n` +
      `- [Plataformas de Freelance](https://www.upwork.com/): Procure projetos freelance para incrementar sua renda.\n` +
      `- [Blogs de Dicas Financeiras](https://www.nexojornal.com.br/): Acesse dicas valiosas para melhorar sua saúde financeira e planejamento.\n`
    );
  } else {
    tips.push(
      `Sua situação financeira está estável, com ganhos superando seus gastos. Para continuar a fortalecer sua saúde financeira, considere estratégias de investimento e economia.\n`
    );

    // Ganhos recorrentes
    if (recurringGainsPercentage > 50) {
      tips.push(
        `Seus ganhos recorrentes estão bem posicionados, representando ${recurringGainsPercentage.toFixed(2)}% do total de ganhos. Considere investir ou economizar mais para potencializar seu patrimônio.\n`
      );
    }

    // Identificar o maior ganho recorrente e eventual
    const highestRecurringGain = sortedGains
      .filter(gain => gain.frequency === 'recorrente')
      .sort((a, b) => b.amount - a.amount)[0];
    
    const highestEventualGain = sortedGains
      .filter(gain => gain.frequency === 'eventual')
      .sort((a, b) => b.amount - a.amount)[0];

    if (highestRecurringGain) {
      const date = new Date(highestRecurringGain.date).toLocaleDateString('pt-BR');
      tips.push(
        `O ganho recorrente com maior impacto financeiro é "${highestRecurringGain.description}" no valor de ${formatCurrency(highestRecurringGain.amount)}. Este ganho ocorreu em ${date}. Considere investir esse valor em uma poupança ou oportunidades de crescimento.\n`
      );
    }

    if (highestEventualGain) {
      const date = new Date(highestEventualGain.date).toLocaleDateString('pt-BR');
      tips.push(
        `O ganho eventual mais significativo é "${highestEventualGain.description}" no valor de ${formatCurrency(highestEventualGain.amount)}. Este ganho foi registrado em ${date}. Utilize esse dinheiro para criar um fundo de emergência ou investir.\n`
      );
    }
  }

  return tips.length > 0 ? tips.join('') : 'Nenhuma dica disponível.';
}






function generateReport(data) {
  let report = '';

  // Relatório de Percentuais
  report += `Percentuais de Ganhos e Gastos\n`;
  report += `Gastos Eventuais: ${data.eventualExpensesPercentage.toFixed(2)} %\n`;
  report += `Gastos Recorrentes: ${data.recurringExpensesPercentage.toFixed(2)} %\n`;
  report += `Ganhos Eventuais: ${data.eventualGainsPercentage.toFixed(2)} %\n`;
  report += `Ganhos Recorrentes: ${data.recurringGainsPercentage.toFixed(2)} %\n\n`;


 

  // Gasto com Maior Impacto
  report += `Gasto com Maior Impacto\n`;
  if (data.largestExpense) {
    report += `Descrição: ${data.largestExpense.description}\n`;
    report += `Valor: ${formatCurrency(data.largestExpense.amount)}\n\n`;
  } else {
    report += `Nenhum gasto significativo registrado.\n\n`;
  }

  // Dados Mensais
  data.monthlyData.forEach(monthData => {
    report += `${monthData.month}\n`;
    report += `Ganhos Totais: ${formatCurrency(monthData.totalGains)}\n`;
    report += `Gastos Totais: ${formatCurrency(monthData.totalExpenses)}\n\n`;

    if (monthData.totalGains > monthData.totalExpenses) {
      report += `No período ${monthData.month}, seus ganhos foram maiores que seus gastos. Ótimo trabalho! Considere investir esse excesso ou economizar mais.\n`;
    } else {
      report += `No período ${monthData.month}, seus gastos foram maiores que seus ganhos. Considere verificar seu orçamento e encontrar formas de reduzir despesas.\n`;
    }
  });

  return report;
}

// Exemplo de uso
const data = {
  eventualExpensesPercentage: 50.00,
  recurringExpensesPercentage: 50.00,
  eventualGainsPercentage: 83.33,
  recurringGainsPercentage: 16.67,
  sortedGains: [{ description: 'Salário', amount: 4000, frequency: 'recorrente', date: '2024-08-01' }],
  sortedExpenses: [{ description: 'Teste Julho', amount: 2500, frequency: 'recorrente', date: '2024-07-15' }],
  categorizedGains: { eventual: 3333.33, recurring: 666.67 },
  categorizedExpenses: { eventual: 1250, recurring: 1250 },
  largestExpense: { description: 'Teste Julho', amount: 2500 },
  monthlyData: [
    { month: '2024-08', totalGains: 4000, totalExpenses: 2500 },
    { month: '2024-07', totalGains: 2000, totalExpenses: 2500 }
  ]
};

console.log(generateReport(data));





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
