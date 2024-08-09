import React, { useState } from 'react';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
    Container,
    Logo,
    Form,
    FormTitle,
    SignUpLink, // Importar o estilo do link
} from './styles';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3008/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username,email, password }),
            });

            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = '/'; // Redireciona para a página de login
            } else {
                const errorMessage = await response.text();
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar. Tente novamente.');
        }
    };

    return (
        <Container>
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
                    type="name"
                    placeholder="Seu nome ou apelido"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Button type="submit">Cadastrar</Button>

                <SignUpLink href="/">Já tem uma conta? Faça login</SignUpLink> {/* Link para a página de login */}
            </Form>
        </Container>
    );
}

export default SignUp;
