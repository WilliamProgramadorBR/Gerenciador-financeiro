import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Title, Section, Label, Input, Button, Message, Link, Strong, UnorderedList, List } from './styles';

const EmailSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    service: '',
    user: '',
    pass: '',
    port: 587, // padrão para SMTP
    secure: false
  });
  const [message, setMessage] = useState('');
  const [reportMessage, setReportMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await axios.get('http://localhost:3008/api/email-settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Erro ao buscar as configurações de e-mail', error);
      }
    }

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3008/api/email-settings', settings);
      setMessage('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar as configurações de e-mail', error);
      setMessage('Erro ao salvar configurações.');
    }
  };
  

  
  return (
    <Container>
      <Title>Configurações de E-mail</Title>

      <Section>
        <p>
          Para configurar o envio de e-mails corretamente, você precisará de uma senha de aplicativo se estiver usando uma conta Google.
          <Strong> Siga estes passos para configurar a senha de aplicativo:</Strong>
        </p>
        <List>
          <li>Vá para <Link href="https://myaccount.google.com/security">a página de segurança da sua conta Google</Link>.</li>
          <li>Em "Login no Google", selecione "Senhas de aplicativo".</li>
          <li>Se solicitado, faça login novamente.</li>
          <li>Selecione "Outro" no menu suspenso e insira um nome para a senha (por exemplo, "Minha Aplicação").</li>
          <li>Clique em "Gerar".</li>
          <li>Copie a senha gerada e cole-a no campo "Senha" abaixo.</li>
        </List>
        <p>
          <Strong>Dicas de Segurança:</Strong>
        </p>
        <UnorderedList>
          <li>Use uma senha forte e única para sua conta de e-mail.</li>
          <li>Ative a autenticação de dois fatores para sua conta de e-mail, se disponível.</li>
          <li>Não compartilhe suas senhas com ninguém e mantenha suas credenciais seguras.</li>
          <li>Verifique regularmente as configurações de segurança de sua conta de e-mail.</li>
        </UnorderedList>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="service">Serviço:</Label>
          <Input
            type="text"
            id="service"
            name="service"
            value={settings.service}
            onChange={handleChange}
          />

          <Label htmlFor="user">E-mail:</Label>
          <Input
            type="email"
            id="user"
            name="user"
            value={settings.user}
            onChange={handleChange}
          />

          <Label htmlFor="pass">Senha:</Label>
          <Input
            type="password"
            id="pass"
            name="pass"
            value={settings.pass}
            onChange={handleChange}
          />

          <Label htmlFor="port">Porta:</Label>
          <Input
            type="number"
            id="port"
            name="port"
            value={settings.port}
            onChange={handleChange}
          />

          <Label htmlFor="secure">Conexão Segura:</Label>
          <Input
            type="checkbox"
            id="secure"
            name="secure"
            checked={settings.secure}
            onChange={handleChange}
          />

          <Button type="submit">Salvar Configurações</Button>
        </form>
      </Section>
    </Container>
  );
};

export default EmailSettings;

