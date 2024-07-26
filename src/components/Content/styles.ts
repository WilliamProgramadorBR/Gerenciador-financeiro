import styled from "styled-components";


export const Container = styled.div`grid-area:CT;
  grid-area: CT;
  background-color: ${props => props.theme.colors.primary}; /* Ajuste a cor de fundo conforme necessário */
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;`;