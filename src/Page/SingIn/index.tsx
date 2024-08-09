import React, { useState } from 'react';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useAuth } from '../../hooks/auth';

import {
    Container,
    Logo,
    Form,
    FormTitle,
    SignUpLink, // Adicione um novo estilo para o link
} from './styles';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { signIn } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email); // Adicione este log para verificar o valor do email
        console.log('Password:', password); // Adicione este log para verificar o valor da senha
        signIn(email, password);
    };
    

    return (
        <Container>
            <Logo>
                <img src={logoImg} alt="Minha Carteira" />
                <h2>Minha Carteira</h2>
            </Logo>

            <Form onSubmit={handleSubmit}>
                <FormTitle>Entrar</FormTitle>

                <Input  
                    type="email"
                    placeholder="e-mail"
                    required
                    onChange={(e) => setEmail(e.target.value)} // Verifique se o valor está sendo atualizado corretamente
                />
               
                <Input 
                    type="password"
                    placeholder="senha"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit">Acessar</Button>

                <SignUpLink href="/signup">Não tem uma conta? Cadastre-se</SignUpLink> {/* Link para a página de cadastro */}
            </Form>
        </Container>
    );
}

export default SignIn;
