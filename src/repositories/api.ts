import { Transaction } from './types'; // Ajuste o caminho conforme necessário

export const fetchTransactions = async (): Promise<{ gains: Transaction[], expenses: Transaction[] }> => {
    try {
        // Recuperar o item do localStorage
        const userJson = localStorage.getItem('@minha-carteira:user');
        let id_user = 0;

        if (userJson) {
            // Converter a string JSON para um objeto
            const user = JSON.parse(userJson);

            // Verificar se o resultado é um objeto e se possui um id
            if (typeof user === 'object' && user !== null && user.id) {
                id_user = user.id;
            } else {
                console.error('O item no localStorage não é um objeto válido.');
                throw new Error('ID do usuário não encontrado');
            }
        } else {
            console.error('Item não encontrado no localStorage.');
            throw new Error('ID do usuário não encontrado');
        }

        // Fazer a requisição à API com o id_user
        const response = await fetch(`http://localhost:3008/api/transactions?id_user=${id_user}`);
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


// api que alimenta grande parte da aplicação