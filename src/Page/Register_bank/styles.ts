import styled from 'styled-components';

// Container para o layout geral da página
export const Container = styled.div`
    padding: 2rem;
    background-color: ${props => props.theme.colors.primary};
`;

// Título principal da página
export const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.white};
`;

// Botão com estilos padrão
export const Button = styled.button`
    background-color: ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.white};
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    margin-right: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => props.theme.colors.success};
    }
`;

// Grupo de formulário para alinhamento dos campos
export const FormGroup = styled.div`
    margin-bottom: 1rem;
    background-color: ${props => props.theme.colors.primary};
`;

// Rótulo para campos de entrada
export const Label = styled.label`
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.success};
`;

// Campo de entrada de texto
export const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;

    &::placeholder {
        color: ${props => props.theme.colors.white};
    }
`;

// Seletor estilizado
export const Select = styled.select`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    background-color: ${props => props.theme.colors.success};
`;

// Estilo dos cartões individuais
export const Card = styled.div`
    background-color: ${props => props.theme.colors.white};
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    width: 100%;
    margin: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

// Estilo para o texto dentro do card
export const CardText = styled.p`
    color: ${props => props.theme.colors.success}; // Cor do texto dentro do card
`;
export const TitleText = styled.h1`
    color: black; // Cor do texto dentro do card
`;

export const textStyled = styled.p`
color: ${props=>props.theme.colors.primary}`