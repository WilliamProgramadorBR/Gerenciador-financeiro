import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { fetchTransactions } from './api'; // Ajuste o caminho conforme necessário
import { Transaction } from './types'; // Ajuste o caminho conforme necessário

interface TransactionContextProps {
    gains: Transaction[];
    expenses: Transaction[];
    loading: boolean;
    error: Error | null;
}

const TransactionsContext = createContext<TransactionContextProps>({
    gains: [],
    expenses: [],
    loading: true,
    error: null
});

interface TransactionsProviderProps {
    children: ReactNode;
}

export const TransactionsProvider: React.FC<TransactionsProviderProps> = ({ children }) => {
    const [gains, setGains] = useState<Transaction[]>([]);
    const [expenses, setExpenses] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { gains: fetchedGains, expenses: fetchedExpenses } = await fetchTransactions();
                setGains(fetchedGains);
                setExpenses(fetchedExpenses);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <TransactionsContext.Provider value={{ gains, expenses, loading, error }}>
            {children}
        </TransactionsContext.Provider>
    );
};

export const useTransactions = () => {
    return React.useContext(TransactionsContext);
};
