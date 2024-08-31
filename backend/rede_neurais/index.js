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

// Função para realizar regressão linear
function linearRegression(X, Y) {
  const n = X.length;
  const X_mean = X.reduce((sum, x) => sum + x, 0) / n;
  const Y_mean = Y.reduce((sum, y) => sum + y, 0) / n;
  
  const numerator = X.reduce((sum, x, i) => sum + (x - X_mean) * (Y[i] - Y_mean), 0);
  const denominator = X.reduce((sum, x) => sum + Math.pow(x - X_mean, 2), 0);
  
  const slope = numerator / denominator;
  const intercept = Y_mean - slope * X_mean;
  
  return { slope, intercept };
}

// Função para realizar regressão polinomial
function polynomialRegression(X, Y, degree) {
  const X_transpose = math.transpose(X);
  const XtX = math.multiply(X_transpose, X);
  const XtY = math.multiply(X_transpose, Y);
  const coeffs = math.lusolve(XtX, XtY);
  return coeffs.map(c => c[0]);
}

// Função para prever tendências futuras
function predictFutureTrend(groupedData) {
  const months = Object.keys(groupedData);
  console.log(`Meses disponíveis para previsão: ${months.length}`);

  if (months.length < 6) {
    return 'Dados insuficientes para previsão. É necessário ter pelo menos 4 meses de dados.';
  }

  const recentMonths = months.slice(-Math.min(6, months.length));
  const totals = recentMonths.map(month =>
    groupedData[month].reduce((sum, item) => sum + item.amount, 0)
  );

  console.log(`Totais por mês para previsão: ${totals}`);

  const filteredTotals = detectOutliers(totals);

  console.log(`Totais após remoção de outliers: ${filteredTotals}`);

  if (filteredTotals.length < 6) {
    return 'Dados insuficientes para previsão após remoção de outliers.';
  }

  // Definir o modelo com base na quantidade de pontos disponíveis
  const degree = filteredTotals.length < 3 ? 1 : 2;
  const X = filteredTotals.map((_, i) => [i + 1, degree === 2 ? Math.pow(i + 1, 2) : 0]);
  const Y = filteredTotals;

  // Usar regressão linear para grau 1 e polinomial para grau 2
  const coefficients = degree === 1 ? linearRegression(X.map(row => row[0]), Y) : polynomialRegression(X, Y, degree);

  const nextMonthIndex = filteredTotals.length + 1;
  const futurePrediction = degree === 1
    ? coefficients.slope * nextMonthIndex + coefficients.intercept
    : coefficients.reduce((sum, coef, index) => sum + coef * Math.pow(nextMonthIndex, index), 0);

  console.log(`Previsão para o próximo mês: ${futurePrediction}`);

  return {
    lastMonthTotal: filteredTotals[filteredTotals.length - 1],
    secondLastMonthTotal: filteredTotals[filteredTotals.length - 2],
    futurePrediction,
  };
}

// Função principal para prever tendências de ganhos e gastos
function analyzeFinancialTrendsIA(gains, expenses) {
  const groupedGains = groupByMonth(gains);
  const groupedExpenses = groupByMonth(expenses);

  const gainTrend = predictFutureTrend(groupedGains);
  const gainMessage = analyzeTrends(gainTrend, getTotal(gains), getAverageMonthly(gains), 'ganhos');

  const expenseTrend = predictFutureTrend(groupedExpenses);
  const expenseMessage = analyzeTrends(expenseTrend, getTotal(expenses), getAverageMonthly(expenses), 'gastos');

  return {
    gainMessage,
    expenseMessage
  };
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
    message = `Relatório gerado por IA: A previsão indica que o total de ${type} deverá diminuir para ${formatCurrency(futurePrediction)} no próximo mês.`;
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

// Função para agrupar dados por mês
function groupByMonth(data) {
  return data.reduce((acc, item) => {
    const month = new Date(item.date).toISOString().slice(0, 7); // 'YYYY-MM'
    acc[month] = acc[month] || [];
    acc[month].push(item);
    return acc;
  }, {});
}

module.exports = {
  analyzeFinancialTrendsIA
};
