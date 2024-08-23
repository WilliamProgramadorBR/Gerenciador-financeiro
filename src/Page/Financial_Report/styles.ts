import styled, { keyframes } from 'styled-components';

// Animação de carregamento
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Componente Loader
export const Loader = styled.div`
  border: 8px solid ${(props) => props.theme.colors.gray};
  border-top: 8px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;


export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;


export const ImageContainer = styled.div`
  position: fixed; /* Fixa a imagem na tela */
  top: 100px; /* Ajusta a distância do topo da tela */
  right: 10px; /* Alinha ao lado direito da tela com uma margem pequena */
  z-index: 1000; /* Garante que a imagem esteja acima de outros elementos */

  /* Ajustes para telas menores */
  @media (max-width: 768px) {
    top: 80px; /* Ajusta a distância do topo em telas menores */
    right: 10px; /* Mantém a imagem alinhada ao lado direito */
  }

  @media (max-width: 480px) {
    top: 60px; /* Ajusta ainda mais a distância do topo em telas muito pequenas */
    right: 10px; /* Mantém a imagem alinhada ao lado direito */
  }
`;

export const Image = styled.img`
  width: 100px; /* Define o tamanho padrão da imagem */
  height: auto; /* Mantém a proporção da imagem */

  /* Ajustes para telas menores */
  @media (max-width: 768px) {
    width: 80px; /* Reduz o tamanho da imagem em telas menores */
  }

  @media (max-width: 480px) {
    width: 60px; /* Reduz ainda mais o tamanho da imagem em telas muito pequenas */
  }
`;

// Container principal
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 40px;
  background: ${(props) => props.theme.colors.success};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  margin: 0 auto;
`;

// Componente de Conteúdo
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Título principal
export const Title = styled.h1`
  font-size: 32px;
  color: ${(props) => props.theme.title === 'light' ? props.theme.colors.black : props.theme.colors.white};
  margin-bottom: 20px;
  font-family: 'Roboto', sans-serif;
`;

// Seção de relatório
export const Section = styled.section`
  margin-top: 30px;
`;

// Título da seção
export const SectionTitle = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.title === 'light' ? props.theme.colors.black : props.theme.colors.white};
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif;
`;

// Texto do relatório
export const Text = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.title === 'light' ? props.theme.colors.black : props.theme.colors.white};
  margin-bottom: 10px;
  font-family: 'Roboto', sans-serif;
`;

// Botão de atualização
export const UpdateButton = styled.button`
  background-color: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.white};
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.colors.success};
    transform: scale(1.05);
  }

  &:active {
    background-color: #3e8e41;
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(72, 182, 73, 0.5);
  }
`;
