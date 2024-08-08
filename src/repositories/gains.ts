import { useEffect, useState } from 'react';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'entrada' | 'saída';
  frequency: 'recorrente' | 'eventual';
  date: string;
}

const useTransactions = () => {
  const [gains, setGains] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3008/api/ganhos');
        const data = await response.json();
        
        const filteredGains = data.filter((item: Transaction) => item.type === 'entrada');
        const filteredExpenses = data.filter((item: Transaction) => item.type === 'saída');

        setGains(filteredGains);
        setExpenses(filteredExpenses);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchTransactions();
  }, []);

  return { gains, expenses };
};

export default useTransactions;
