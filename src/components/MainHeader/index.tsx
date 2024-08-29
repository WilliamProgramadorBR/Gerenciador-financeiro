import React, { useMemo, useState } from 'react';
import Toggle from '../Toggle';
import Clock from '../Clock';
import emojis from '../../utils/emojis';

import { useTheme } from '../../hooks/theme';

import { 
    Container, 
    Profile, 
    Welcome, 
    UserName, 
}  from './styles';


const MainHeader: React.FC = () => {
    const { toggleTheme, theme } = useTheme();
    const storedUser = localStorage.getItem('@minha-carteira:user')
    let username
    
    if (storedUser) {
        const user = JSON.parse(storedUser);
        console.log('ID:', user.id);
       username =  user.username
        console.log('Email:', user.email);
        console.log('Senha:', user.password);
      } else {
        console.log('Nenhum usuário encontrado no localStorage.');
      }


    const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

    const handleChangeTheme = () => {
        setDarkTheme(!darkTheme);
        toggleTheme();
    }

    const emoji = useMemo(() => {
        const indice = Math.floor(Math.random() * emojis.length);
        return emojis[indice];
    },[]);

    return (
        <Container>
            
            <Toggle
                labelLeft="Light"
                labelRight="Dark"
                checked={darkTheme}
                onChange={handleChangeTheme}
            /><Clock/>

            <Profile>
                <Welcome>Olá, {emoji}</Welcome>
                <UserName>{username}</UserName>
            </Profile>
        </Container>
    );
}

export default MainHeader;