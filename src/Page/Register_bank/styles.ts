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
    background-color: ${props => props.theme.colors.warning};
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
    background-color: ${props => props.theme.colors.success};
    padding: 1rem;
    border-radius: 8px;
`;
export const TransactionCard = styled.div`
    margin-bottom: 1rem;
    padding: 1rem;
    background-color: ${props => props.theme.colors.success};/* Cor de fundo clara */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Rótulo para campos de entrada
export const Label = styled.label`
    display: block;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.primary};
`;

// Campo de entrada de texto
export const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.white};
    border-radius: 4px;
    font-size: 1rem;
    background-color: ${props => props.theme.colors.info};

    &::placeholder {
        color: ${props => props.theme.colors.primary};
    }
`;

// Seletor estilizado
export const Select = styled.select`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.primary};
    border-radius: 4px;
    font-size: 1rem;
    background-color: ${props => props.theme.colors.success};
`;

// Estilo dos cartões individuais
export const Card = styled.div`
    background-color: ${props => props.theme.colors.primary};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    width: 100%;
    margin: 0.5rem 0;
    display: flex;
    flex-direction: column;
`;

// Estilo para o texto dentro do card
export const CardText = styled.p`
    color: ${props => props.theme.colors.black}; 
    margin: 0.5rem 0;
`;

export const TitleText = styled.h2`
    color: ${props => props.theme.colors.white};
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
`;


export const EditTransactionContainer = styled.div`
    margin-top: 2rem;
    padding: 2rem;
    background-color:${props => props.theme.colors.primary}; ; /* Preto escuro, ajuste conforme necessário */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// Aplicar o estilo ao título
export const EditTitle = styled(Title)`
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.white};
`;

// Aplicar o estilo ao botão
export const SaveButton = styled(Button)`
    background-color: ${props => props.theme.colors.black};
    &:hover {
        background-color: ${props => props.theme.colors.success}; /* Ajuste conforme necessário */
    }
`;