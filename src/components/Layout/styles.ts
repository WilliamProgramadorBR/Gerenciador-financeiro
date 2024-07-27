import styled from "styled-components";



export const Grid = styled.div`
  display: grid;
  grid-template-columns: 250px auto; /* Ajusta a largura da coluna do lado esquerdo */
  grid-template-rows: 70px 1fr; /* Ajusta a altura da linha superior e a linha restante */
  grid-template-areas: 
    'AS MH'
    'AS CT'; /* Define a área para o menu lateral e o conteúdo principal */
  height: 100vh; /* Garante que o grid ocupe toda a altura da viewport */
  background-color: #1e1e2f; /* Ajuste a cor de fundo conforme necessário */
`;