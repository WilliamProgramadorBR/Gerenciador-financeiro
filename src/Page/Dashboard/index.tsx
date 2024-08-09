import React, { useState, useMemo, useCallback, useEffect } from 'react';


import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import WalletBox from '../../components/WalletBox';
import MessageBox from '../../components/MessageBox';
import PieChartBox from '../../components/PieChart';
import HistoryBox from '../../components/HistoryBox';
import BarChartBox from '../../components/BarChatBox'

import listOfMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';
import opsImg from '../../assets/ops.svg';
import { fetchTransactions } from '../../repositories/api';

import { 
    Container,
    Content, 
    UpdateButton
} from './styled';

interface Transaction {
    date: string | number | Date;
    frequency: string;
    type: 'entrada' | 'saída'; // Ajuste o tipo conforme necessário
    amount: number;
    // Adicione outros campos conforme necessário
}

const Dashboard: React.FC = () => {
    
        const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
        const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
        const [gains, setGains] = useState<Transaction[]>([]);
        const [expenses, setExpenses] = useState<Transaction[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<Error | null>(null);
        function Atualizar() {
            fetchTransactions()
                .then(() => {
                    window.location.reload(); // Atualiza a página
                })
                .catch(error => {
                    console.error('Erro ao atualizar as transações:', error);
                });
        }
        
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await fetch('http://localhost:3008/api/ganhos');
                    if (!response.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    const data: Transaction[] = await response.json();
                    
                    const filteredGains = data.filter(transaction => transaction.type === 'entrada');
                    const filteredExpenses = data.filter(transaction => transaction.type === 'saída');
                    
                    setGains(filteredGains);
                    setExpenses(filteredExpenses);
                    localStorage.setItem('gains', JSON.stringify(filteredGains));
                    localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
                } catch (error) {
                    setError(error as Error);
                } finally {
                    setLoading(false);
                }
            };
    
            const savedGains = localStorage.getItem('gains');
            const savedExpenses = localStorage.getItem('expenses');
    
            if (savedGains && savedExpenses) {
                setGains(JSON.parse(savedGains));
                setExpenses(JSON.parse(savedExpenses));
                setLoading(false);
            } else {
                fetchData();
            }
        }, []);


        const years = useMemo(() => {
            let uniqueYears: number[] = [];
    
            [...expenses, ...gains].forEach(item => {
                const date = new Date(item.date);
                const year = date.getFullYear();
    
                if (!uniqueYears.includes(year)) {
                    uniqueYears.push(year);
                }
            });
    
            return uniqueYears.map(year => ({
                value: year,
                label: year,
            }));
        }, [gains, expenses]);


    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    },[]);
    
    
    const totalExpenses = useMemo(() => {
        let total: number = 0;
    
        expenses.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
    
            if (month === monthSelected && year === yearSelected) {
                // Verifique se amount é um número válido antes de somar
                const amount = Number(item.amount);
                if (isNaN(amount)) {
                    console.error('Invalid amount:', item.amount);
                    return;
                }
                total += amount;
            }
        });
    
        return total;
    }, [expenses, monthSelected, yearSelected]);
    


    const totalGains = useMemo(() => {
        let total: number = 0;
    
        gains.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
    
            if (month === monthSelected && year === yearSelected) {
                // Verifique se amount é um número válido antes de somar
                const amount = Number(item.amount);
                if (isNaN(amount)) {
                    console.error('Invalid amount:', item.amount);
                    return;
                }
                total += amount;
            }
        });
    
        return total;
    }, [gains, monthSelected, yearSelected]);
    

    const totalBalance = useMemo(() => {
        return totalGains - totalExpenses;
    },[totalGains, totalExpenses]);

    const message = useMemo(() => {
        if(totalBalance < 0){
            return {
                title: "Que triste!",
                description: "Neste mês, você gastou mais do que deveria.",
                footerText: "Verifique seus gastos e tente cortar algumas coisas desnecessárias.",
                icon: sadImg
            }
        }      
        else if(totalGains === 0 && totalExpenses === 0){
            return {
                title: "Op's!",
                description: "Neste mês, não há registros de entradas ou saídas.",
                footerText: "Parece que você não fez nenhum registro no mês e ano selecionado.",
                icon: opsImg
            }
        }
        else if(totalBalance === 0){
            return {
                title: "Ufaa!",
                description: "Neste mês, você gastou exatamente o que ganhou.",
                footerText: "Tenha cuidado. No próximo tente poupar o seu dinheiro.",
                icon: grinningImg
            }
        }
        else{
            return {
                title: "Muito bem!",
                description: "Sua carteira está positiva!",
                footerText: "Continue assim. Considere investir o seu saldo.",
                icon: happyImg
            }
        }

    },[totalBalance, totalGains, totalExpenses]);

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

    const historyData = useMemo(() => {
        return listOfMonths.map((_, month) => {
            
            let amountEntry = 0;
            gains.forEach(gain => {
                const date = new Date(gain.date);
                const gainMonth = date.getMonth();
                const gainYear = date.getFullYear();
    
                if (gainMonth === month && gainYear === yearSelected) {
                    try {
                        amountEntry += Number(gain.amount);
                    } catch {
                        throw new Error('amountEntry is invalid. amountEntry must be a valid number.');
                    }
                }
            });
    
            let amountOutput = 0;
            expenses.forEach(expense => {
                const date = new Date(expense.date);
                const expenseMonth = date.getMonth();
                const expenseYear = date.getFullYear();
    
                if (expenseMonth === month && expenseYear === yearSelected) {
                    try {
                        amountOutput += Number(expense.amount);
                    } catch {
                        throw new Error('amountOutput is invalid. amountOutput must be a valid number.');
                    }
                }
            });
    
            return {
                monthNumber: month,
                month: listOfMonths[month].substr(0, 3),
                amountEntry,
                amountOutput
            };
        })
        .filter(item => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear);
        });
    
    }, [gains, expenses, yearSelected]); // Adicione gains e expenses às dependências
    

  const relationExpensevesRecurrentVersusEventual = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;

    expenses
    .filter((expense) => {
        const date = new Date(expense.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        return month === monthSelected && year === yearSelected;
    })
    .forEach((expense) => {
        if(expense.frequency === 'recorrente'){
            return amountRecurrent += Number(expense.amount);
        }

        if(expense.frequency === 'eventual'){
            return amountEventual += Number(expense.amount);
        }
    });

    const total = amountRecurrent + amountEventual;

    const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
    const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));

    return [
        {
            name: 'Recorrentes',
            amount: amountRecurrent,
            percent: percentRecurrent ? percentRecurrent : 0, 
            color: "#F7931B"
        },
        {
            name: 'Eventuais',
            amount: amountEventual,
            percent: percentEventual ? percentEventual : 0,
            color: "#E44C4E"
        }
    ];
},[monthSelected, yearSelected,expenses]);


const relationGainsRecurrentVersusEventual = useMemo(() => {
    let amountRecurrent = 0;
    let amountEventual = 0;

    gains
    .filter((gain) => {
        const date = new Date(gain.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        return month === monthSelected && year === yearSelected;
    })
    .forEach((gain) => {
        if(gain.frequency === 'recorrente'){
            return amountRecurrent += Number(gain.amount);
        }

        if(gain.frequency === 'eventual'){
            return amountEventual += Number(gain.amount);
        }
    });

    const total = amountRecurrent + amountEventual;

    const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
    const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));

    return [
        {
            name: 'Recorrentes',
            amount: amountRecurrent,
            percent: percentRecurrent ? percentRecurrent : 0,
            color: "#F7931B"
        },
        {
            name: 'Eventuais',
            amount: amountEventual,
            percent: percentEventual ? percentEventual : 0,
            color: "#E44C4E"
        }
    ];
},[monthSelected, yearSelected, gains]);


  

    const handleMonthSelected = useCallback((month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        }
        catch{
            throw new Error('invalid month value. Is accept 0 - 24.')
        }
    },[]);


    const handleYearSelected = useCallback((year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        }
        catch{
            throw new Error('invalid year value. Is accept integer numbers.')
        }
    },[]);
  
    
console.log(historyData)
return (
    <Container>
         <UpdateButton onClick={Atualizar}>Atualizar Dados</UpdateButton>
        <ContentHeader title="Dashboard" lineColor="#F7931B">
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
                color="#4E41F0"
                amount={totalBalance}
                footerlabel="atualizado com base nas entradas e saídas"
                icon="dolar"
            />

            <WalletBox 
                title="entradas"
                color="#F7931B"
                amount={totalGains}
                footerlabel="atualizado com base nas entradas e saídas"
                icon="arrowUp"
            />

            <WalletBox 
                title="saídas"
                color="#E44C4E"
                amount={totalExpenses}
                footerlabel="atualizado com base nas entradas e saídas"
                icon='arrowDown'
            />

            <MessageBox
                title={message.title}
                description={message.description}
                footerText={message.footerText}
                icon={message.icon}
            />

            <PieChartBox data={relationExpensesVersusGains} />

            <HistoryBox 
                data={historyData} 
                lineColorAmountEntry="#F7931B"
                lineColorAmountOutput="#E44C4E"
            />

            <BarChartBox 
                title="Saídas"
                data={relationExpensevesRecurrentVersusEventual} 
            />
            
            <BarChartBox 
                title="Entradas"
                data={relationGainsRecurrentVersusEventual} 
            />
            
        </Content>
       
    </Container>
);
}

export default Dashboard;