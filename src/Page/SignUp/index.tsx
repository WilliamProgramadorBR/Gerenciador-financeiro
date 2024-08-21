import React, { useState } from 'react';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import Alert from '../../components/Alert'; // Importe o componente Alert

import {
    Container,
    Logo,
    Form,
    FormTitle,
    SignUpLink,
} from './styles';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3008/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                setAlertMessage('Cadastro realizado com sucesso!');
                setAlertType('success');
                setTimeout(() => {
                    window.location.href = '/'; // Redireciona para a página de login
                }, 1500); // Delay para mostrar o alerta antes do redirecionamento
            } else {
                const errorMessage = await response.text();
                setAlertMessage(errorMessage);
                setAlertType('error');
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            setAlertMessage('Erro ao cadastrar. Tente novamente.');
            setAlertType('error');
        }
    };

    return (
        <Container>
            {alertMessage && (
                <Alert
                    message={alertMessage}
                    type={alertType as 'success' | 'error'}
                    onClose={() => {
                        setAlertMessage(null);
                        setAlertType(null);
                    }}
                />
            )}

            <Logo>
                <img src={logoImg} alt="Minha Carteira" />
                <h2>Minha Carteira</h2>
            </Logo>

            <Form onSubmit={handleSubmit}>
                <FormTitle>Cadastrar</FormTitle>

                <Input 
                    type="email"
                    placeholder="e-mail"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                    type="password"
                    placeholder="senha"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Input 
                    type="text"
                    placeholder="Seu nome ou apelido"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Button type="submit">Cadastrar</Button>

                <SignUpLink href="/">Já tem uma conta? Faça login</SignUpLink>
            </Form>
        </Container>
    );
}

export default SignUp;
