// src/components/FormPage.tsx
import React, { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    Select,
    Button,
    ErrorMessage
} from './styles';
import { NumericFormat } from 'react-number-format'; // Importando o NumericFormat
import Alert from '../../components/Alert'; // Importando o componente Alert
import { map } from 'mathjs';
interface FormData {
    description: string;
    amount: number;
    type: 'entrada' | 'saída';
    frequency: 'recorrente' | 'eventual';
    date: string;
    id_user: number;
}

const FormPage: React.FC = () => {
    const [user, setUser] = useState<{ id: number } | null>(null); // Estado para armazenar o usuário
    const [formData, setFormData] = useState<FormData>({
        description: '',
        amount: 0,
        type: 'entrada',
        frequency: 'recorrente',
        date: '',
        id_user: 0 // Inicialmente 0 ou algum valor padrão
    });
    const [error, setError] = useState<string | null>(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Estado para mostrar alerta de sucesso

    useEffect(() => {
        // Recuperar o item do localStorage
        const userJson = localStorage.getItem('@minha-carteira:user');

        if (userJson) {
            // Converter a string JSON para um objeto
            const parsedUser = JSON.parse(userJson);
            
            // Verificar se o resultado é um objeto
            if (typeof parsedUser === 'object' && parsedUser !== null) {
                setUser(parsedUser);
                setFormData(prevState => ({
                    ...prevState,
                    id_user: parsedUser.id // Atualizar id_user com o id do usuário
                }));
            } else {
                console.log('O item no localStorage não é um objeto.');
            }
        } else {
            console.log('Item não encontrado no localStorage.');
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3008/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            // Handle successful submission
            setShowSuccessAlert(true); // Mostrar alerta de sucesso
            setFormData({
                description: '',
                amount: 0,
                type: 'entrada',
                frequency: 'recorrente',
                date: '',
                id_user: user ? user.id : 0 // Manter o id_user após o envio
            });
        } catch (error) {
            setError('Error submitting data. Please try again.');
        }
    };
    return (
        <Container>
            <Title>Inserção de dados no finanças</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Titulo descrição</Label>
                    <Input
                        type="text"
                        placeholder='Exemplo: salário'
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Valor</Label>
                    <NumericFormat
                        value={formData.amount}
                        onValueChange={(values) => setFormData(prevState => ({
                            ...prevState,
                            amount: values.floatValue || 0
                        }))}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        displayType="input"
                        customInput={Input} // Aplicando o estilo do Input
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Tipo</Label>
                    <Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="entrada">Entrada</option>
                        <option value="saída">Saída</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Frequencia entrada/gasto</Label>
                    <Select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        required
                    >
                        <option value="recorrente">Recorrente</option>
                        <option value="eventual">Eventual</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <Label>Data</Label>
                    <Input
                        type="date"
                        placeholder='Insira uma data válida'
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <Button type="submit">Adicionar</Button>
            </Form>

            {/* Alerta de sucesso */}
            {showSuccessAlert && (
                <Alert
                    message="Data submitted successfully!"
                    type="success"
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}

            {/* Alerta de erro */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                />
            )}
        </Container>
    );
};

export default FormPage;
