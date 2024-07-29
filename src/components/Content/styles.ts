import styled from "styled-components";

export const Container = styled.div`
  grid-area: CT;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  display: flex;
  flex-direction: column; /* Altera para coluna para ajustar os itens verticalmente */
  align-items: center;
  justify-content: flex-start; /* Ajusta para o início para alinhar corretamente */
  padding: 20px;
  height: calc(100vh - 70px);
  overflow-y: auto;

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