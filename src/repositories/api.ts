import { Transaction } from './types'; // Ajuste o caminho conforme necessário

export const fetchTransactions = async (): Promise<{ gains: Transaction[], expenses: Transaction[] }> => {
    try {
        const response = await fetch('http://localhost:3008/api/ganhos');
        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }
        const data: Transaction[] = await response.json();

        // Filtra os dados para ganhos e gastos
        const gains = data.filter(item => item.type === 'entrada');
        const expenses = data.filter(item => item.type === 'saída');

        // Apaga os dados atuais e armazena os novos no localStorage
        localStorage.removeItem('gains');
        localStorage.removeItem('expenses');

        localStorage.setItem('gains', JSON.stringify(gains));
        localStorage.setItem('expenses', JSON.stringify(expenses));

        return { gains, expenses };
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        throw error; // Propaga o erro para que ele possa ser tratado onde a função for chamada
    }
};
