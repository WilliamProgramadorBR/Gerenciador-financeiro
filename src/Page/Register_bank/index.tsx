import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';

import { fetchTransactions } from '../../repositories/api'; // Atualize o caminho conforme necessário
import { Transaction } from '../../repositories/types'; // Ajuste o caminho conforme necessário
import { Container, Title, Button, FormGroup, Label, Input, Select, CardText, TitleText } from './styles'; // Atualize o caminho conforme necessário

const TransactionsPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState<'entrada' | 'saída'>('saída');
    const [frequency, setFrequency] = useState<'recorrente' | 'eventual'>('eventual');
    const [date, setDate] = useState('');

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const { gains, expenses } = await fetchTransactions();
                setTransactions([...gains, ...expenses]);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        loadTransactions();
    }, []);

    const handleUpdate = async () => {
        if (editTransaction) {
            try {
                const response = await fetch(`http://localhost:3008/api/ganhos/${editTransaction.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ description, amount, type, frequency, date }),
                });
                if (response.ok) {
                    setTransactions(transactions.map(transaction =>
                        transaction.id === editTransaction.id ? { ...transaction, description, amount, type, frequency, date } : transaction
                    ));
                    setEditTransaction(null);
                } else {
                    console.error('Failed to update transaction');
                }
            } catch (error) {
                console.error('Error updating transaction:', error);
            }
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3008/api/ganhos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTransactions(transactions.filter(transaction => transaction.id !== id));
            } else {
                console.error('Failed to delete transaction');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <Container>
            <Title>Manage Transactions</Title>
            {transactions.map(transaction => (
                <div key={transaction.id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <TitleText>{transaction.description}</TitleText>
                    <CardText>Valor: {transaction.amount}</CardText>
                    <CardText>Data: {new Date(transaction.date).toLocaleDateString()}</CardText>
                    <Button onClick={() => {
                        setEditTransaction(transaction);
                        setDescription(transaction.description || '');
                        setAmount(typeof transaction.amount === 'number' ? transaction.amount : Number(transaction.amount));
                        setType(transaction.type as 'entrada' | 'saída');
                        setFrequency(transaction.frequency as 'recorrente' | 'eventual');
                        setDate(typeof transaction.date === 'string' ? transaction.date : (transaction.date instanceof Date ? transaction.date.toISOString().split('T')[0] : ''));
                    }}>Edit</Button>
                    <Button onClick={() => handleDelete(transaction.id)}>Delete</Button>
                </div>
            ))}
            {editTransaction && (
                <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#020202', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    <Title>Edit Transaction</Title>
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
        width: '100%', // Define a largura total do campo
        padding: '10px', // Ajusta o preenchimento interno do campo
        fontSize: '16px', // Define o tamanho da fonte
        borderRadius: '8px', // Arredonda os cantos
        border: '1px solid #ccc' // Define uma borda
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
                        <Label><CardText>Frequencia</CardText></Label>
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
                    <Button onClick={handleUpdate}>Save Changes</Button>
                </div>
            )}
            <Button onClick={() => console.log('Add new transaction')}>Add New Transaction</Button>
        </Container>
    );
};

export default TransactionsPage;
