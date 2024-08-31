import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { fetchTransactions } from '../../repositories/api'; // Atualize o caminho conforme necessário
import { Transaction } from '../../repositories/types'; // Ajuste o caminho conforme necessário
import { Container, Title, Button, FormGroup, Label, Input, Select, CardText, TitleText, TransactionCard } from './styles'; // Atualize o caminho conforme necessário
import CustomModal from '../../components/Custom_modal'; // Importe o componente de modal
import months from '../../utils/months';

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState<'entrada' | 'saída'>('saída');
    const [frequency, setFrequency] = useState<'recorrente' | 'eventual'>('eventual');
    const [date, setDate] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'todos'>('todos');
    const [selectedMonth, setSelectedMonth] = useState<string | number>('todos');

    const [years, setYears] = useState<number[]>([]);

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const { gains, expenses } = await fetchTransactions();
                const allTransactions = [...gains, ...expenses];
                setTransactions(allTransactions);

                // Obter anos únicos das transações
                const uniqueYears = Array.from(
                    new Set(allTransactions.map(transaction => new Date(transaction.date).getFullYear()))
                ).sort((a, b) => b - a);
                setYears(uniqueYears);

                setFilteredTransactions(filterTransactions(allTransactions));
            } catch (error) {
                console.error('Erro ao buscar transações.', error);
            }
        };

        loadTransactions();
    }, []);

    const filterTransactions = (transactions: Transaction[]) => {
        return transactions.filter(transaction => {
            const matchSearchTerm = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
            const transactionDate = new Date(transaction.date);
            const matchYear = selectedYear === 'todos' || transactionDate.getFullYear() === selectedYear;
            const matchMonth = selectedMonth === 'todos' || transactionDate.getMonth() + 1 === selectedMonth;

            return matchSearchTerm && matchYear && matchMonth;
        });
    };

    useEffect(() => {
        setFilteredTransactions(filterTransactions(transactions));
    }, [searchTerm, selectedYear, selectedMonth, transactions]);

    const handleUpdate = async () => {
        if (editTransaction) {
            try {
                const response = await fetch(`http://localhost:3008/api/transactions/${editTransaction.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ description, amount, type, frequency, date }),
                });
                if (response.ok) {
                    const updatedTransaction = { ...editTransaction, description, amount, type, frequency, date };
                    setTransactions(transactions.map(transaction =>
                        transaction.id === editTransaction.id ? updatedTransaction : transaction
                    ));
                    setFilteredTransactions(filterTransactions(transactions));
                    setModalOpen(false);
                    setEditTransaction(null); // Limpa o estado do editTransaction após salvar
                } else {
                    console.error('Falha ao atualizar transação.');
                }
            } catch (error) {
                console.error('Erro ao atualizar transação.', error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3008/api/transactions/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTransactions(transactions.filter(transaction => transaction.id !== id));
                setFilteredTransactions(filterTransactions(transactions));
            } else {
                console.error('Falha ao excluir transação.');
            }
        } catch (error) {
            console.error('Erro ao excluir transação.', error);
        }
    };

    return (
        <Container>
            <Title>Controle suas transações</Title>

            <FormGroup>
                <Label><CardText>Buscar</CardText></Label>
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <Label><CardText>Ano</CardText></Label>
                <Select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value) || 'todos')}
                >
                    <option value="todos">Todos</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </Select>
            </FormGroup>

            <FormGroup>
            <Label><CardText>Mês</CardText></Label>
            <Select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value) || 'todos')}
            >
                <option value="todos">Todos</option>
                {months.map((month, index) => (
                    <option key={index + 1} value={index + 1}>{month}</option>
                ))}
            </Select>
        </FormGroup>

            {filteredTransactions.map(transaction => (
                <TransactionCard key={transaction.id}>
                    <TitleText>{transaction.description}</TitleText>
                    <CardText>Valor: {transaction.amount}</CardText>
                    <CardText>Data: {new Date(transaction.date).toLocaleDateString()}</CardText>
                    <Button onClick={() => {
                        setEditTransaction(transaction);
                        setDescription(transaction.description || '');
                        setAmount(Number(transaction.amount)); // Garantir que o amount é numérico
                        setType(transaction.type as 'entrada' | 'saída');
                        setFrequency(transaction.frequency as 'recorrente' | 'eventual');
                        setDate(new Date(transaction.date).toISOString().split('T')[0]); // Formatar a data
                        setModalOpen(true);
                    }}>Edit</Button>
                    <Button onClick={() => handleDelete(transaction.id)}>Delete</Button>
                </TransactionCard>
            ))}

            {editTransaction && (
                <CustomModal
                    isOpen={modalOpen}
                    toggle={() => setModalOpen(!modalOpen)}
                    onSave={handleUpdate}
                    title="Editar Transação"
                >
                    <FormGroup>
                        <Label><CardText>Descrição</CardText></Label>
                        <Input
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label><CardText>Valor</CardText></Label>
                        <NumericFormat
                            value={amount}
                            onValueChange={(values) => setAmount(values.floatValue || 0)}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            displayType="input"
                            style={{
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px',
                                borderRadius: '8px',
                                border: '1px solid #ccc'
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label><CardText>Tipo</CardText></Label>
                        <Select
                            value={type}
                            onChange={e => setType(e.target.value as 'entrada' | 'saída')}
                        >
                            <option value="entrada">Entrada</option>
                            <option value="saída">Saída</option>
                        </Select>
                    </FormGroup>
                    <FormGroup>
                        <Label><CardText>Frequência</CardText></Label>
                        <Select
                            value={frequency}
                            onChange={e => setFrequency(e.target.value as 'recorrente' | 'eventual')}
                        >
                            <option value="recorrente">Recorrente</option>
                            <option value="eventual">Eventual</option>
                        </Select>
                    </FormGroup>
                    <FormGroup>
                        <Label><CardText>Data</CardText></Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </FormGroup>
                </CustomModal>
            )}
        </Container>
    );
};

export default TransactionsPage;
