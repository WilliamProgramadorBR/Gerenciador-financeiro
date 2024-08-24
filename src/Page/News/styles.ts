import styled, { keyframes } from 'styled-components';

// Animação de carregamento
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Container para a lista de notícias
export const Container = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Título principal
export const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.white};
  font-family: 'Roboto', sans-serif;
`;

// Item de notícia
export const NewsItem = styled.div`
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 800px;

  h3 {
    margin: 0;
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
    font-family: 'Roboto', sans-serif;
  }

  p {
    margin: 0.5rem 0;
    color: ${props => props.theme.colors.white};
    font-family: 'Lora', serif;
  }

  img {
    max-width: 100%;
    border-radius: 4px;
    margin-top: 1rem;
  }
  a {
      color: ${props => props.theme.colors.white};
      text-decoration: none;
      transition: color 0.3s;
      }
`;




// Botão
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

// Container de imagem
export const ImageContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 10px;
  z-index: 1000;

  @media (max-width: 768px) {
    top: 80px;
  }

  @media (max-width: 480px) {
    top: 60px;
  }
`;

// Imagem no container
export const Image = styled.img`
  width: 100px;

  @media (max-width: 768px) {
    width: 80px;
  }

  @media (max-width: 480px) {
    width: 60px;
  }
`;

// Componente de conteúdo principal
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Seção principal
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

// Texto
export const Text = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.title === 'light' ? props.theme.colors.black : props.theme.colors.white};
  margin-bottom: 10px;
  font-family: 'Lora', serif;
`;

export const ErrorMessage = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.title === 'light' ? props.theme.colors.black : props.theme.colors.white};
  margin-bottom: 10px;
  font-family: 'Lora', serif;
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
// Componente Loader
export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
`;

export const Loader = styled.div`
  border: 8px solid ${(props) => props.theme.colors.gray};
  border-top: 8px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem; /* Espaço entre o loader e o texto */
`;

export const LoaderText = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.white};
  margin: 0;
  font-family: 'Roboto', sans-serif;
`;