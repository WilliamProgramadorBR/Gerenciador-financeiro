
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
  
  
  
  
  
  
  function analyzeFinancialHealth(ganhos, gastos) {
    // Cálculos iniciais
    const totalGains = ganhos.reduce((sum, ganho) => sum + ganho.amount, 0);
    const totalExpenses = gastos.reduce((sum, gasto) => sum + gasto.amount, 0);
    const balance = totalGains - totalExpenses;

    // Classificar despesas por tipo
    const recurringExpenses = gastos.filter(gasto => gasto.frequency === 'recorrente');
    const eventualExpenses = gastos.filter(gasto => gasto.frequency === 'eventual');

    // Cálculo de médias mensais
    const averageMonthlyGains = totalGains / 12; // Supondo que os ganhos sejam anuais
    const averageMonthlyExpenses = totalExpenses / 12;

    // Projeção de saldo para os próximos meses
    const projectedBalance = balance + (averageMonthlyGains - averageMonthlyExpenses) * 6; // Projeção de 6 meses

    // Análise de risco financeiro
    const riskAnalysis = projectedBalance < 0 
        ? 'Alerta: Você está projetando um saldo negativo para os próximos meses. É essencial reavaliar seu planejamento financeiro e considerar estratégias para aumentar a renda ou reduzir os gastos.' 
        : 'Sua saúde financeira está estável no momento. No entanto, é sempre bom acompanhar regularmente suas despesas e receitas para manter esse controle.';

    // Sugestões baseadas na análise
    const tips = [];
    if (eventualExpenses.length > recurringExpenses.length) {
        tips.push('Considere revisar e reduzir suas despesas eventuais. Esse tipo de gasto pode ser mais flexível e ajustar seu orçamento pode melhorar seu controle financeiro.');
    }
    if (averageMonthlyExpenses > averageMonthlyGains) {
        tips.push('Sua média de despesas mensais está superando seus ganhos mensais. Avalie formas de aumentar sua renda ou diminua suas despesas para evitar um possível déficit financeiro.');
    }
    if (balance < 0) {
        tips.push('Seu saldo atual está negativo. Planeje uma redução imediata de gastos e busque maneiras de aumentar sua receita para estabilizar sua situação financeira.');
    } else if (balance < averageMonthlyExpenses) {
        tips.push('Seu saldo atual está abaixo da média dos seus gastos mensais. Considere economizar mais e procurar formas de melhorar sua situação financeira.');
    }

    // Agrupar ganhos e despesas por mês
    const groupedGains = groupByMonth(ganhos);
    const groupedExpenses = groupByMonth(gastos);

    // Análise de Tendências
    const gainsTrends = predictFutureTrend(groupedGains);
    const expensesTrends = predictFutureTrend(groupedExpenses);

    // Análise de Tendências com Mensagens Detalhadas
    const trendsAnalysis = {
        gains: analyzeTrends(gainsTrends, totalGains, averageMonthlyGains, 'ganhos'),
        expenses: analyzeTrends(expensesTrends, totalExpenses, averageMonthlyExpenses, 'despesas'),
    };

    // Relatório de saúde financeira
    const report = {
        currentBalance: balance,
        averageMonthlyGains,
        averageMonthlyExpenses,
        projectedBalance,
        riskAnalysis,
        tips,
        insights: {
            totalGains,
            totalExpenses,
            recurringExpensesTotal: recurringExpenses.reduce((sum, item) => sum + item.amount, 0),
            eventualExpensesTotal: eventualExpenses.reduce((sum, item) => sum + item.amount, 0),
        },
        trends: trendsAnalysis,
    };

    return report;
}

function groupByMonth(data) {
    return data.reduce((acc, item) => {
        const month = new Date(item.date).toISOString().slice(0, 7); // 'YYYY-MM'
        if (!acc[month]) acc[month] = [];
        acc[month].push(item);
        return acc;
    }, {});
}

function calculateQuantile(data, quantile) {
    data.sort((a, b) => a - b);
    const index = (quantile * (data.length - 1));
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
    const weight = index - lowerIndex;
    return (data[lowerIndex] * (1 - weight)) + (data[upperIndex] * weight);
}

function predictFutureTrend(groupedData) {
    const months = Object.keys(groupedData);
    if (months.length < 6) {
        return 'Dados insuficientes para previsão. É necessário ter pelo menos 6 meses de dados.';
    }

    // Pegue os últimos 6 meses para análise
    const recentMonths = months.slice(-6);
    const totals = recentMonths.map(month => 
        groupedData[month].reduce((sum, item) => sum + item.amount, 0)
    );

    // Detecção de outliers usando o intervalo interquartil (IQR)
    const q1 = calculateQuantile(totals, 0.25);
    const q3 = calculateQuantile(totals, 0.75);
    const iqr = q3 - q1;
    const filteredTotals = totals.filter(total => total >= (q1 - 1.5 * iqr) && total <= (q3 + 1.5 * iqr));

    // Regressão múltipla usando regressão polinomial (grau 2)
    const X = filteredTotals.map((_, i) => [1, i + 1, Math.pow(i + 1, 2)]); // Matriz de características
    const Y = filteredTotals;

    // Calcule os coeficientes da regressão
    const coefficients = polynomialRegression(X, Y, 2);

    // Previsão para o próximo mês usando os coeficientes da regressão múltipla
    const nextMonth = filteredTotals.length + 1;
    const futurePredictionMultiple = coefficients.reduce((sum, coef, index) => sum + coef * Math.pow(nextMonth, index), 0);

    return {
        lastMonthTotal: filteredTotals[filteredTotals.length - 1],
        secondLastMonthTotal: filteredTotals[filteredTotals.length - 2],
        futurePredictionMultiple,
    };
}

function polynomialRegression(X, Y, degree) {
    const X_transpose = math.transpose(X);
    const XtX = math.multiply(X_transpose, X);
    const XtY = math.multiply(X_transpose, Y);
    const coeffs = math.lusolve(XtX, XtY);
    return coeffs.map(c => c[0]);
}

function analyzeTrends(trendData, totalCurrent, averageMonthly, type) {
    console.log('Trend Data:', trendData);

    if (typeof trendData === 'string') {
        return `Não há dados suficientes para prever a tendência de ${type}. É necessário ter pelo menos 6 meses de dados para uma análise precisa.`;
    }

    // Verificar se os dados são válidos
    const { lastMonthTotal, futurePredictionMultiple } = trendData;
    if (isNaN(lastMonthTotal) || isNaN(futurePredictionMultiple)) {
        return `Dados insuficientes ou inválidos para calcular a previsão de ${type}.`;
    }

    // Logs para depuração
    console.log(`Último total registrado: R$${lastMonthTotal.toFixed(2)}`);
    console.log(`Previsão múltipla para o próximo mês: R$${futurePredictionMultiple.toFixed(2)}`);

    let message = '';

    // Análise das tendências com base na previsão múltipla
    if (futurePredictionMultiple > lastMonthTotal) {
        message = `Baseado nas tendências atuais, o total de ${type} está previsto para aumentar. A previsão múltipla para o próximo mês é de R$${futurePredictionMultiple.toFixed(2)}. Se esta tendência continuar, o ${type} pode seguir crescendo.`;
    } else if (futurePredictionMultiple < lastMonthTotal) {
        message = `As tendências atuais sugerem uma possível diminuição no total de ${type}. A previsão múltipla para o próximo mês é de R$${futurePredictionMultiple.toFixed(2)}. Isso indica que pode haver uma redução no ${type} nos próximos meses.`;
    } else {
        message = `Com base nas tendências atuais, o total de ${type} deve permanecer estável. A previsão múltipla para o próximo mês é de R$${futurePredictionMultiple.toFixed(2)}. Portanto, o ${type} deve se manter constante se as condições atuais persistirem.`;
    }

    // Integração dos parâmetros totalCurrent e averageMonthly se fornecidos
    if (totalCurrent !== undefined && averageMonthly !== undefined) {
        message += ` Atualmente, o total de ${type} é de R$${totalCurrent.toFixed(2)} e a média mensal é de R$${averageMonthly.toFixed(2)}. Isso fornece um contexto adicional para interpretar as previsões.`;
    }

    return message;
}




  

  
  
  module.exports= {
    calculatePercentages,
    formatCurrency,
    categorizeData,
    generateMonthlyData,
    analyzeFinancialHealth
  };
  