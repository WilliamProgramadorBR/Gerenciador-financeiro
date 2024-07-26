import styled from "styled-components";


export const Container = styled.div`
  width: calc(100% - 250px); /* Ajuste conforme necessário para o menu lateral */
  margin-left: -43%; /* Espaço para o menu lateral */
  display: flex;

  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

  position: absolute;
  top: 10%;
  margin-left: -38%;
   /* Espaço para o header */
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-left: 0;
    padding: 10px;
    top: 70px;
  }
`;
export const ButtonStyled = styled.button`
margin-left: 500%;`

export const Title = styled.div``;
export const Controllers = styled.div``

