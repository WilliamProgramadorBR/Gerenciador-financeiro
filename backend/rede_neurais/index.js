const math = require('mathjs');

// Função para calcular o quantil
function calculateQuantile(data, quantile) {
  const sorted = data.slice().sort((a, b) => a - b);
  const index = quantile * (sorted.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const weight = index - lowerIndex;
  return sorted[lowerIndex] * (1 - weight) + sorted[upperIndex] * weight;
}

// Função para detectar outliers usando o intervalo interquartil (IQR)
function detectOutliers(data) {
  const q1 = calculateQuantile(data, 0.25);
  const q3 = calculateQuantile(data, 0.75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  return data.filter(value => value >= lowerBound && value <= upperBound);
}

// Função para realizar regressão linear simples
function linearRegression(X, Y) {
  const n = X.length;
  const xMean = X.reduce((sum, value) => sum + value, 0) / n;
  const yMean = Y.reduce((sum, value) => sum + value, 0) / n;

  const numerator = X.reduce((sum, xi, i) => sum + (xi - xMean) * (Y[i] - yMean), 0);
  const denominator = X.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
}

// Função para prever o próximo valor com base no modelo de regressão linear
function predictLinearRegression(model, x) {
  return model.slope * x + model.intercept;
}

// Função para preparar dados agrupados por mês
function prepareMonthlyData(data) {
  const groupedData = groupByMonth(data);
  return Object.keys(groupedData).map(month =>
    groupedData[month].reduce((sum, item) => sum + item.amount, 0)
  );
}

// Função para agrupar dados por mês
function groupByMonth(data) {
  return data.reduce((acc, item) => {
    const month = new Date(item.date).toISOString().slice(0, 7); // 'YYYY-MM'
    acc[month] = acc[month] || [];
    acc[month].push(item);
    return acc;
  }, {});
}

// Função para prever tendências futuras
function predictFutureTrend(totals) {
  console.log(`Totais por mês para previsão: ${totals}`);

  const filteredTotals = detectOutliers(totals);

  console.log(`Totais após remoção de outliers: ${filteredTotals}`);

  if (filteredTotals.length < 4) {
    return 'Dados insuficientes para previsão após remoção de outliers.';
  }

  // Criar variáveis independentes e dependentes
  const X = filteredTotals.map((_, i) => i + 1); // Variável independente (tempo)
  const Y = filteredTotals; // Variável dependente (totais)

  // Realizar a regressão linear
  const model = linearRegression(X, Y);

  const nextMonthIndex = filteredTotals.length + 1;
  const futurePrediction = predictLinearRegression(model, nextMonthIndex);

  console.log(`Previsão para o próximo mês: ${futurePrediction}`);

  return {
    lastMonthTotal: filteredTotals[filteredTotals.length - 1],
    futurePrediction,
  };
}

// Função para filtrar dados com base em type e frequency
function filterData(data, type, frequency) {
  return data.filter(item => item.type === type && item.frequency === frequency);
}

// Funções utilitárias para cálculo
function getTotal(data) {
  return data.reduce((sum, item) => sum + item.amount, 0);
}

function getAverageMonthly(data) {
  const months = [...new Set(data.map(item => new Date(item.date).toISOString().slice(0, 7)))];
  return getTotal(data) / months.length;
}

// Função para formatar valores monetários no padrão brasileiro
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para análise de tendências
function analyzeTrends(trendData, totalCurrent, averageMonthly, type) {
  if (typeof trendData === 'string') {
    return `Relatório gerado por IA: Não há dados suficientes para prever a tendência de ${type} no momento. Para que a IA possa realizar uma análise adequada e fornecer previsões precisas, é necessário ter pelo menos 7 meses de dados. Por favor, continue monitorando suas informações financeiras e aguarde o período mínimo para uma análise mais completa.`;
  }

  const { lastMonthTotal, futurePrediction } = trendData;
  if (isNaN(lastMonthTotal) || isNaN(futurePrediction)) {
    return `Relatório gerado por IA: Não há dados suficientes para prever a tendência de ${type} no momento. Para que a IA possa realizar uma análise adequada e fornecer previsões precisas, é necessário ter pelo menos 7 meses de dados. Por favor, continue monitorando suas informações financeiras e aguarde o período mínimo para uma análise mais completa.`;
  }

  let message = '';
  if (futurePrediction > lastMonthTotal) {
    message = `Relatório gerado por IA: A previsão indica que o total de ${type} deverá aumentar para ${formatCurrency(futurePrediction)} no próximo mês.`;
  } else if (futurePrediction < lastMonthTotal) {
    if (futurePrediction < 0) {
      message = `Relatório gerado por IA: A previsão indica que o total de ${type} deverá se tornar negativo, alcançando ${formatCurrency(futurePrediction)} no próximo mês. Isso pode indicar um déficit financeiro.`;
    } else {
      message = `Relatório gerado por IA: A previsão indica que o total de ${type} deverá diminuir para ${formatCurrency(futurePrediction)} no próximo mês.`;
    }
  } else {
    message = `Relatório gerado por IA: A previsão indica que o total de ${type} deverá permanecer estável em ${formatCurrency(futurePrediction)} no próximo mês.`;
  }

  if (totalCurrent !== undefined && averageMonthly !== undefined) {
    message += `\n\nInformações adicionais:\n`;
    message += `- Total atual de ${type}: ${formatCurrency(totalCurrent)}\n`;
    message += `- Média mensal de ${type}: ${formatCurrency(averageMonthly)}\n`;
  }

  return message;
}

// Função principal para prever tendências de ganhos e gastos
function analyzeFinancialTrendsIA(gains, expenses) {
  const categories = ['entrada_recorrente', 'saída_recorrente', 'entrada_eventual', 'saída_eventual'];

  const reports = categories.reduce((acc, category) => {
    const [type, frequency] = category.split('_');
    const filteredGains = filterData(gains, type, frequency);
    const filteredExpenses = filterData(expenses, type, frequency);
    const data = type === 'entrada' ? filteredGains : filteredExpenses;
    
    const trend = predictFutureTrend(prepareMonthlyData(data));
    const totalCurrent = getTotal(data);
    const averageMonthly = getAverageMonthly(data);
    
    acc[category] = analyzeTrends(trend, totalCurrent, averageMonthly, type);
    return acc;
  }, {});

  return reports;
}

module.exports = {
  analyzeFinancialTrendsIA
};
