import React,{useState, useMemo} from 'react';


import { Container,Content } from './styled';
import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import expenses from'../../repositories/expenses'
import gains from '../../repositories/gains';
import listOfMonths from '../../utils/months';
import WalletBox from '../../components/WalletBox';
import MessageBox from '../../components/MessageBox';
import happyImg from '../../assets/happy.svg'
import sadImg from '../../assets/sad.svg'
import PieChartBox from '../../components/PieChart';
import HistoryBox from '../../components/HistoryBox';
import { title } from 'process';

const Dashboard: React.FC = () =>{
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const years = useMemo(() => {
        let uniqueYears: number[] = [];
    
      
    
        [...expenses, ...gains].forEach(item => {
          const date = new Date(item.date);
          const year = date.getFullYear();
    
          if (!uniqueYears.includes(year)) {
            uniqueYears.push(year);
          }
        });
    
        return uniqueYears.map(year => {
          return {
            value: year,
            label: year,
          };
        });
      }, []);
  
    
      const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
          return {
            value: index + 1,
            label: month,
          };
        });
      }, []);

      const totalExpenses = useMemo(() =>{
        let total: number =0;

        expenses.forEach(item =>{
          const date = new Date(item.date);
          const year = date.getFullYear();
          const month = date.getMonth() +1;
          if(month === monthSelected && year === yearSelected){
           try{
            total += Number(item.amount)
           }catch(error){
            throw new Error('Não é um ano valido')
           }  // Ligar no back end
          }
        })
        return total;
      },[monthSelected, yearSelected])

      const totalGains = useMemo(() =>{
        let total: number =0;

        gains.forEach(item =>{
          const date = new Date(item.date);
          const year = date.getFullYear();
          const month = date.getMonth() +1;
          if(month === monthSelected && year === yearSelected){
           try{
            total += Number(item.amount)
           }catch(error){
            throw new Error('Não é um ano valido')
           }  // Ligar no back end
          }
        })
        return total;
      },[monthSelected, yearSelected])
      
      const totalBalance = useMemo(()=>{
       
              return totalGains - totalExpenses;
          
      },[totalGains, totalExpenses])

      const message = useMemo(()=>{
            if(totalBalance < 0){
              return {
                title: "Que pena :(",
                description:"Neste mês, você gastou muito. Até mais do que deveria.",
                footerText:"Verifique seus gatos e tente cortar algumas despesas. É sempre bom, economizar no crédito, para não pagar juros",
                icon:sadImg
              }
            }else if(totalBalance === 0){
              return {
              title: "Ufaa! Essa foi por pouco, ein! Vamos focar no lucro agora ;)",
              description:"Vamos evitar gastos elevados, para manter na progressão. Sempre importante colocar as coisas na ponta do lápis.",
              footerText:"Evite lanches caros, também é importante manter o cartão de crédito guardadinho, não se esqueça de pelo menos guardar 5% do que arrecada ao mês.",
              icon: happyImg
            }
      }else{
        return{
          title: "Ótimo trabalho! Você está indo muito bem! 🎉",
          description: "Continue assim, mantendo um controle rigoroso dos seus gastos. Isso é essencial para garantir que você continue a ver os frutos do seu trabalho. Lembre-se, um bom planejamento financeiro é a chave para o sucesso.",
          footerText: "Tente fazer uma revisão mensal das suas despesas e receitas. Isso ajudará a identificar oportunidades para economizar ainda mais. E não se esqueça de reservar uma parte dos seus ganhos para o futuro!",
          icon: happyImg
        }
      }
    },[totalBalance])

    const relationExpensesVersusGains = useMemo(() => {
      const total = totalGains + totalExpenses;

      const percentGains = Number(((totalGains / total) * 100).toFixed(1));
      const percentExpenses = Number(((totalExpenses / total) * 100).toFixed(1));

      const data = [
          {
              name: "Entradas",
              value: totalGains,
              percent: percentGains ? percentGains : 0, 
              color: '#E44C4E'
          },
          {
              name: "Saídas",
              value: totalExpenses,
              percent: percentExpenses ? percentExpenses : 0, 
              color: '#F7931B'
          },
      ];

      return data;
  },[totalGains, totalExpenses]);
 
    const handleMonthSelected = (month: string) => {
        try {
          const parseMonth = Number(month);
          setMonthSelected(parseMonth);
        } catch {
          throw new Error('invalid month value. Is accept 0 - 24.');
        }
      };
    
      const handleYearSelected = (year: string) => {
        try {
          const parseYear = Number(year);
          setYearSelected(parseYear);
        } catch {
          throw new Error('invalid year value. Is accept integer numbers.');
        }
      };
    return(
        <div>
        <Container>
              <ContentHeader title='Dashboard' lineColor='#F7931B'>
      
       <SelectInput
          options={months}
          onChange={(e) => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />
        <SelectInput
          options={years}
          onChange={(e) => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
              </ContentHeader>
              <Content>
              <WalletBox 
              title="saldo"
              amount={totalBalance}
              footerlabel={"atualizado com base nas entradas e saídas"}
              icon="dolar"
              color="#4e41f0"/>
              </Content>
              <WalletBox 
              title="Entradas"
              amount={totalGains}
              footerlabel={"atualizado com base nas entradas e saídas"}
              icon="arrowUp"
              color="#f7931b"/>
       
              <WalletBox 
              title="Saídas"
              amount={totalExpenses}
              footerlabel={"atualizado com base nas entradas e saídas"}
              icon="arrowDonw"
              color="#e44c4e"/>
        <MessageBox
        title={message.title}
        description={message.description}
        footerText={message.footerText}
        icon={message.icon}/>
        <PieChartBox data={relationExpensesVersusGains} />
        </Container></div>
    );
}

export default Dashboard;