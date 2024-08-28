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
  
  
  module.exports= {
    calculatePercentages,
    formatCurrency,
    categorizeData,
    generateMonthlyData
  };
  