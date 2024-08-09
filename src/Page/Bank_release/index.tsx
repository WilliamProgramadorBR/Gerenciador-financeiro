// src/components/FormPage.tsx
import React, { useState } from 'react';
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
} from './styles'; // Ajuste o caminho conforme necessário

interface FormData {
    description: string;
    amount: number;
    type: 'entrada' | 'saída';
    frequency: 'recorrente' | 'eventual';
    date: string;
}

const FormPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        description: '',
        amount: 0,
        type: 'entrada',
        frequency: 'recorrente',
        date: ''
    });
    const [error, setError] = useState<string | null>(null);

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
            const response = await fetch('http://localhost:3008/api/ganhos', {
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
            alert('Data submitted successfully!');
            setFormData({
                description: '',
                amount: 0,
                type: 'entrada',
                frequency: 'recorrente',
                date: ''
            });
        } catch (error) {
            setError('Error submitting data. Please try again.');
        }
    };

    return (
        <Container>
            <Title>Submit Transaction</Title>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Description</Label>
                    <Input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Type</Label>
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
                    <Label>Frequency</Label>
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
                    <Label>Date</Label>
                    <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </FormGroup>
                <Button type="submit">Submit</Button>
            </Form>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </Container>
    );
};

export default FormPage;
