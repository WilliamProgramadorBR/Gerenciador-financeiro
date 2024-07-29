import styled from "styled-components";
interface ITagProps{
    color: string
}


export const Container = styled.li`
  background-color: ${props => props.theme.colors.tertiary};
  list-style: none;
  border-radius: 5px;
  margin: 10px 0; /* Espaçamento vertical entre os itens */
  padding: 12px 200px; /* Ajuste o padding conforme necessário */
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s; /* Transição suave para hover */
  position: relative;
  min-height: 60px; /* Define uma altura mínima para os itens */
  width: calc(100% - 4px); /* Ajuste a largura total do item */

  &:hover {
    opacity: 0.7;
    transform: translateX(10px);
  }

  > div {
    display: flex;
    flex-direction: row;
    align-items: center;

    > span {
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: 500; /* Remova 'px' */
    }

    > small {
      font-size: 0.9em;
      color: ${props => props.theme.colors.primary};
      margin-left: 10px; /* Espaçamento entre o título e o subtítulo */
    }
  }

  h3 {
    margin-left: 10px;
    font-size: 1.1em;
    color: ${props => props.theme.colors.white};
  }

  /* Media Queries para responsividade */
  @media (max-width: 1200px) {
    padding: 10px 15px;
    min-height: 70px;
  }

  @media (max-width: 992px) {
    padding: 8px 10px;
    min-height: 60px;
  }

  @media (max-width: 768px) {
    padding: 6px 8px;
    min-height: 50px;
  }

  @media (max-width: 576px) {
    padding: 4px 5px;
    min-height: 40px;
    width: calc(100% - 10px);
  }
`;

export const Tag = styled.div`
  width: 10px;
  height: 60%;
  background-color: ${props => props.color};
  position: absolute;
  left: 0;
`;
