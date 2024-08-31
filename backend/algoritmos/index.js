
const math = require('mathjs');


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
            `### Situação Financeira Atual\n` +
            `Sua situação financeira está desafiadora, com seus gastos superando seus ganhos. Para melhorar o equilíbrio financeiro, considere reduzir suas despesas e explorar novas fontes de renda.\n\n`
        );

        // Gastos recorrentes
        if (recurringExpensesPercentage > 30) {
            tips.push(
                `### Gastos Recorrentes\n` +
                `Uma parte significativa de suas despesas é recorrente, representando ${recurringExpensesPercentage.toFixed(2)}% do total. Avalie suas despesas fixas, como aluguel e compras regulares. Considere pesquisar opções mais baratas para reduzir esses gastos.\n\n`
            );
        }

        // Identificar o maior gasto recorrente e eventual
        const highestRecurringExpense = sortedExpenses
            .filter(expense => expense.frequency === 'recorrente')
            .sort((a, b) => b.amount - a.amount)[0];

        const highestEventualExpense = sortedExpenses
            .filter(expense => expense.frequency === 'eventual')
            .sort((a, b) => b.amount - a.amount)[0];

        if (highestRecurringExpense) {
            const date = new Date(highestRecurringExpense.date).toLocaleDateString('pt-BR');
            tips.push(
                `### Maior Gasto Recorrente\n` +
                `O gasto recorrente mais impactante é "${highestRecurringExpense.description}" no valor de ${formatCurrency(highestRecurringExpense.amount)}. Este gasto ocorreu em ${date}. Tente negociar ou reduzir este valor, considerando alternativas mais econômicas.\n\n`
            );
        }

        if (highestEventualExpense) {
            const date = new Date(highestEventualExpense.date).toLocaleDateString('pt-BR');
            tips.push(
                `### Maior Gasto Eventual\n` +
                `O gasto eventual mais significativo é "${highestEventualExpense.description}" no valor de ${formatCurrency(highestEventualExpense.amount)}. Este gasto foi registrado em ${date}. Avalie se é possível cortar ou reduzir esses gastos para melhorar seu orçamento.\n\n`
            );
        }

        if (totalGains > 0) {
            tips.push(
                `### Ganhos Eventuais\n` +
                `Mesmo com os gastos elevados, seus ganhos eventuais representam ${eventualGainsPercentage.toFixed(2)}% do total de ganhos. Considere formas de aumentar esses ganhos, explorando novas oportunidades de renda.\n\n`
            );
        }

        // Nova previsão baseada em percentual de gastos
        const expenseToIncomeRatio = (totalGains > 0) ? (totalExpenses / totalGains) * 100 : 0;
        if (expenseToIncomeRatio > 75) {
            tips.push(
                `### Atenção: Gastos Elevados\n` +
                `Seu gasto representa ${expenseToIncomeRatio.toFixed(2)}% dos seus ganhos. Isso indica um potencial risco financeiro. Tente reduzir seus gastos ou aumentar seus ganhos para evitar problemas futuros.\n\n`
            );
        }

        // Alerta para gastos eventuais altos
        if (eventualExpensesPercentage > totalGains) {
            tips.push(
                `### Alerta: Gastos Eventuais\n` +
                `Seus gastos eventuais representam ${eventualExpensesPercentage.toFixed(2)}% do total de suas despesas. Isso indica que você está gastando uma parte significativa do seu dinheiro em despesas não regulares. Considere reduzir esses gastos e direcionar esse dinheiro para investimentos ou economias para melhorar sua saúde financeira.\n\n`
            );
        }

        tips.push(
            `### Recomendações Gerais\n` +
            `Para evitar um estrangulamento financeiro, considere aumentar suas fontes de renda. Explore oportunidades de trabalho e projetos freelance. Abaixo, alguns recursos úteis:\n` +
            `- [Sites de Procura de Emprego](https://www.indeed.com.br/): Encontre novas oportunidades de trabalho.\n` +
            `- [Plataformas de Freelance](https://www.upwork.com/): Procure projetos freelance para incrementar sua renda.\n` +
            `- [Blogs de Dicas Financeiras](https://www.nexojornal.com.br/): Acesse dicas valiosas para melhorar sua saúde financeira e planejamento.\n`
        );
    } else {
        tips.push(
            `### Situação Financeira Atual\n` +
            `Sua situação financeira está estável, com seus ganhos superando seus gastos. Para continuar a fortalecer sua saúde financeira, considere estratégias de investimento e economia.\n\n`
        );

        // Ganhos recorrentes
        if (recurringGainsPercentage > 50) {
            tips.push(
                `### Ganhos Recorrentes\n` +
                `Seus ganhos recorrentes estão bem posicionados, representando ${recurringGainsPercentage.toFixed(2)}% do total de ganhos. Considere investir ou economizar mais para potencializar seu patrimônio.\n\n`
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
                `### Maior Ganho Recorrente\n` +
                `O ganho recorrente com maior impacto financeiro é "${highestRecurringGain.description}" no valor de ${formatCurrency(highestRecurringGain.amount)}. Este ganho ocorreu em ${date}. Considere investir esse valor em uma poupança ou oportunidades de crescimento.\n\n`
            );
        }

        if (highestEventualGain) {
            const date = new Date(highestEventualGain.date).toLocaleDateString('pt-BR');
            tips.push(
                `### Maior Ganho Eventual\n` +
                `O ganho eventual mais significativo é "${highestEventualGain.description}" no valor de ${formatCurrency(highestEventualGain.amount)}. Este ganho foi registrado em ${date}. Utilize esse dinheiro para criar um fundo de emergência ou investir.\n\n`
            );
        }
    }
  
    return tips.length > 0 ? tips.join('') : 'Nenhuma dica disponível.';
}
// Função para gerar dicas financeiras
function generateFinancialTips(balance, averageMonthlyExpenses, averageMonthlyGains, recurringExpenses, eventualExpenses) {
  const tips = [];
  if (eventualExpenses.length > recurringExpenses.length) {
      tips.push('Considere revisar e reduzir suas despesas eventuais para melhorar seu controle financeiro.');
  }
  if (averageMonthlyExpenses > averageMonthlyGains) {
      tips.push('Sua média de despesas mensais está superando seus ganhos mensais. Avalie formas de aumentar sua renda ou diminuir suas despesas.');
  }
  if (balance < 0) {
      tips.push('Seu saldo atual está negativo. Planeje uma redução imediata de gastos e busque maneiras de aumentar sua receita.');
  } else if (balance < averageMonthlyExpenses) {
      tips.push('Seu saldo atual está abaixo da média dos seus gastos mensais. Considere economizar mais.');
  }
  return tips;
}


 module.exports= {
    calculatePercentages,
    formatCurrency,
    categorizeData,
    generateMonthlyData,

  };
  