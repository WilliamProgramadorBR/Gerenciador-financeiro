import styled from "styled-components";

export const Container = styled.div`
  grid-area: CT; /* Coloca o contêiner na área definida no grid */
  background-color: ${props => props.theme.colors.primary}; /* Ajuste a cor de fundo conforme necessário */
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  height: calc(100vh - 70px); /* Corrige o erro de digitação e ajusta a altura */
  overflow-y: auto; /* Permite rolagem vertical se necessário */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.secondary};
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background-color: ${props => props.theme.colors.tertiary};
    border-radius: 10px;
  }
`;
