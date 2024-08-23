import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Title, Section, SectionTitle, Text, Loader } from './styles';
import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';
import opsImg from '../../assets/ops.svg';
import { ImageContainer, Image, Button } from './styles'; // Adicione Button ao import
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
}


const FinancialReport: React.FC = () => {
  const [report, setReport] = useState<FinancialReportData | null>(null);
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

    fetchReport();
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

  if (!report) return <Loader />; // Mostrar animação de carregamento

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
          dangerouslySetInnerHTML={{ __html: report.tips.replace(/\n/g, '<br />') || 'Nenhuma dica disponível.' }}
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

      <Button onClick={sendReportByEmail}>Enviar Relatório por E-mail</Button>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => {
            setAlert(null);
            setAlert(null);
        }}
         
        />
      )}
    </Container>
  );
};

export default FinancialReport;

