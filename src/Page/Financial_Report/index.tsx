import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Title, Section, SectionTitle, Text, Loader } from './styles';
import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';
import opsImg from '../../assets/ops.svg';
import { ImageContainer, Image, Button } from './styles';
import Alert from '../../components/Alert';

interface MonthlyData {
  [period: string]: {
    totalGains: number;
    totalExpenses: number;
  };
}

interface FinancialReportData {
  eventualExpenses: number;
  recurringExpenses: number;
  eventualGains: number;
  recurringGains: number;
  highestExpense: string;
  highestExpenseAmount: number;
  tips: string;
  monthlyData: {
    monthlyData: MonthlyData;
    tips: string;
  };
  report: string;
}

interface AdditionalReportData {
  currentBalance: number;
  averageMonthlyGains: number;
  averageMonthlyExpenses: number;
  projectedBalance: number;
  riskAnalysis: string;
  tips: string[];
  insights: {
    totalGains: number;
    totalExpenses: number;
    recurringExpensesTotal: number;
    eventualExpensesTotal: number;
  },
  trends:{
    gains:number,
    expenses: number
  }
}

const FinancialReport: React.FC = () => {
  const [report, setReport] = useState<FinancialReportData | null>(null);
  const [additionalReport, setAdditionalReport] = useState<AdditionalReportData | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | 'info'; } | null>(null);

  const saveEmailSettings = (settings: { sendDaily: boolean; sendDate?: string }) => {
    localStorage.setItem('emailSettings', JSON.stringify(settings));
  };

  const getEmailSettings = (): { sendDaily: boolean; sendDate?: string } => {
    const settings = localStorage.getItem('emailSettings');
    return settings ? JSON.parse(settings) : { sendDaily: false };
  };

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await axios.get<FinancialReportData>('http://localhost:3008/api/report');
        setReport(response.data);
      } catch (error) {
        console.error('Erro ao buscar o relatório', error);
      }
    }

    async function fetchAdditionalReport() {
      try {
        const response = await axios.get<AdditionalReportData>('http://localhost:3008/api/prevision');
        setAdditionalReport(response.data); // Atualize o tipo esperado aqui
        console.log(response.data); // Para depuração
      } catch (error) {
        console.error('Erro ao buscar o relatório adicional', error);
      }
    }

    fetchReport();
    fetchAdditionalReport();
  }, []);

  const isReportEmpty = (report: FinancialReportData | null) => {
    if (!report) return true;

    const {
      eventualExpenses,
      recurringExpenses,
      eventualGains,
      recurringGains,
      monthlyData
    } = report;

    const isMonthlyDataEmpty = Object.values(monthlyData.monthlyData).every(
      ({ totalGains, totalExpenses }) => totalGains === 0 && totalExpenses === 0
    );

    return (
      eventualExpenses === 0 &&
      recurringExpenses === 0 &&
      eventualGains === 0 &&
      recurringGains === 0 &&
      isMonthlyDataEmpty
    );
  };

  const sendReportByEmail = async () => {
    if (!report) return;

    const reportText = `
      Relatório Financeiro:

      Ganhos Totais: ${(report.eventualGains + report.recurringGains).toFixed(2)}
      Gastos Totais: ${(report.eventualExpenses + report.recurringExpenses).toFixed(2)}
      Maior Gasto: ${report.highestExpense || 'Nenhuma descrição disponível.'} - R$${(report.highestExpenseAmount ?? 0).toFixed(2)}
      Percentual de Gastos Eventuais: ${(report.eventualExpenses ?? 0).toFixed(2)}

      Dica Personalizada: ${report.tips || 'Nenhuma dica disponível.'}
    `;

    try {
      await axios.post('http://localhost:3008/api/send-report', { reportText }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAlert({ message: 'Relatório enviado com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Erro ao enviar o relatório', error);
      setAlert({ message: 'Erro ao enviar o relatório.', type: 'error' });
    }
  };

  if (!report) return <Loader />;

  if (isReportEmpty(report)) {
    return (
      <Container>
        <Title>Relatório Financeiro</Title>
        <Section>
          <Text>Não há relatórios disponíveis para este mês. Insira seus registros para gerar relatórios.</Text>
          <ImageContainer>
            <Image src={opsImg} alt="Nenhum dado" />
          </ImageContainer>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Relatório Financeiro</Title>

      <Section>
        <SectionTitle>Percentuais de Ganhos e Gastos</SectionTitle>
        <Text>
          <strong>Gastos Eventuais:</strong> {(report.eventualExpenses ?? 0).toFixed(2)}%
        </Text>
        <Text>
          <strong>Gastos Recorrentes:</strong> {(report.recurringExpenses ?? 0).toFixed(2)}%
        </Text>
        <Text>
          <strong>Ganhos Eventuais:</strong> {(report.eventualGains ?? 0).toFixed(2)}%
        </Text>
        <Text>
          <strong>Ganhos Recorrentes:</strong> {(report.recurringGains ?? 0).toFixed(2)}%
        </Text>
      </Section>

      <Section>
        <SectionTitle>Dica Personalizada</SectionTitle>
        <Text
          dangerouslySetInnerHTML={{ __html: report.tips?.replace(/\n/g, '<br />') || 'Nenhuma dica disponível.' }}
        />
      </Section>

      <Section>
        <SectionTitle>Gasto com Maior Impacto</SectionTitle>
        <Text>
          <strong>Descrição:</strong> {report.highestExpense || 'Nenhuma descrição disponível.'}
        </Text>
        <Text>
          <strong>Valor:</strong> R${(report.highestExpenseAmount ?? 0).toFixed(2)}
        </Text>
      </Section>

      <Section>
        <SectionTitle>Dados Mensais</SectionTitle>
        {Object.keys(report.monthlyData.monthlyData).length === 0 ? (
          <Text>Não há dados mensais disponíveis.</Text>
        ) : (
          Object.entries(report.monthlyData.monthlyData).map(([period, { totalGains, totalExpenses }]) => (
            <div key={period}>
              <SectionTitle>{period}</SectionTitle>
              <Text>
                <strong>Ganhos Totais:</strong> R${(totalGains ?? 0).toFixed(2)}
              </Text>
              <Text>
                <strong>Gastos Totais:</strong> R${(totalExpenses ?? 0).toFixed(2)}
              </Text>
              <Text>
                {report.monthlyData.tips || 'Nenhuma dica personalizada para este período.'}
              </Text>
            </div>
          ))
        )}
      </Section>

      <Section>
        <SectionTitle>Relatório Completo</SectionTitle>
        <Text>
          <strong>Saldo Atual:</strong> R${additionalReport?.currentBalance.toFixed(2) || 'Nenhum dado'}
        </Text>
        <Text>
          <strong>Média de Ganhos Mensais:</strong> R${additionalReport?.averageMonthlyGains.toFixed(2) || 'Nenhum dado'}
        </Text>
        <Text>
          <strong>Média de Gastos Mensais:</strong> R${additionalReport?.averageMonthlyExpenses.toFixed(2) || 'Nenhum dado'}
        </Text>
        <Text>
          <strong>Saldo Projetado:</strong> R${additionalReport?.projectedBalance.toFixed(2) || 'Nenhum dado'}
        </Text>
        <Text>
          <strong>Análise de Risco:</strong> {additionalReport?.riskAnalysis || 'Nenhum dado'}
        </Text>
        <Text>
          <strong>Ganhos previsões:</strong> {additionalReport?.trends.gains || 'Nenhuma dica disponível para ganhos,insira mais informações anuais para a geração'}
          <br></br>
          <br></br>
         
          <strong>Gastos previsões:</strong> {additionalReport?.trends.expenses || 'Sem previsões para gastos, insira mais informações anuais para a geração'}
        </Text>
        <Text>
          <strong>Total de Ganhos:</strong> R${(additionalReport?.insights.totalGains ?? 0).toFixed(2)}
        </Text>
        <Text>
          <strong>Total de Gastos:</strong> R${(additionalReport?.insights.totalExpenses ?? 0).toFixed(2)}
        </Text>
        <Text>
          <strong>Gastos Recorrentes Totais:</strong> R${(additionalReport?.insights.recurringExpensesTotal ?? 0).toFixed(2)}
        </Text>
        <Text>
          <strong>Gastos Eventuais Totais:</strong> R${(additionalReport?.insights.eventualExpensesTotal ?? 0).toFixed(2)}
        </Text>
      </Section>

      <Button onClick={sendReportByEmail}>Enviar Relatório por Email</Button>

      {alert && (
        <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert(null)}
      />
      )}
    </Container>
  );
};

export default FinancialReport;
