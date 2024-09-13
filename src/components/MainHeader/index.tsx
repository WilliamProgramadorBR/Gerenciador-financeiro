// src/components/MainHeader.tsx
import React, { useEffect, useMemo, useState } from 'react';
import Toggle from '../Toggle';
import emojis from '../../utils/emojis';
import { useTheme } from '../../hooks/theme';
import { Container, Profile, Welcome, UserName, ProfileImage } from './styles';


const MainHeader: React.FC = () => {
    const fetchProfileImage = async () => {
        const user = JSON.parse(localStorage.getItem('@minha-carteira:user') || '{}');
        const userId = user.id;
      
        if (!userId) {
          console.error('ID do usuário não encontrado');
          return;
        }
      
        try {
          const response = await fetch(`http://localhost:3008/api/get-profile-picture?userId=${userId}`);
          if (response.ok) {
            // Cria um URL de objeto a partir da resposta
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImage(imageUrl);
          } else {
            console.error('Falha ao buscar a imagem do perfil');
          }
        } catch (error) {
          console.error('Erro:', error);
        }
      };

      useEffect(() => {
        fetchProfileImage();
      }, []);
    const [image, setImage] = useState<string | null>(null);
    const { toggleTheme, theme } = useTheme();
    const storedUser = localStorage.getItem('@minha-carteira:user');
    let username;
    let profileImage;
 
      
    if (storedUser) {
        const user = JSON.parse(storedUser);
        username = user.username;
        profileImage = user.profile_picture;
    } else {
        console.log('Nenhum usuário encontrado no localStorage.');
    }

    const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

    const handleChangeTheme = () => {
        setDarkTheme(!darkTheme);
        toggleTheme();
    };

    const emoji = useMemo(() => {
        const indice = Math.floor(Math.random() * emojis.length);
        return emojis[indice];
    }, []);

    return (
        <Container>
            <Toggle
                labelLeft="Light"
                labelRight="Dark"
                checked={darkTheme}
                onChange={handleChangeTheme}
            />

            <Profile>
                <ProfileImage src={image || 'https://via.placeholder.com/50'} alt="Profile" />
                <div>
                    <Welcome>Olá, {emoji}</Welcome>
                    <UserName>{username}</UserName>
                </div>
            </Profile>
        </Container>
    );
}

export default MainHeader;


