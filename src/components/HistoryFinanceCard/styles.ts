import styled from "styled-components";
interface ITagProps{
    color: string
}


export const Container = styled.li`
  background-color: ${props => props.theme.colors.tertiary};
  list-style: none;
  border-radius: 5px;
  margin: 10px 0; /* Espaçamento vertical entre os itens */
  padding: 12px 20px; /* Ajuste o padding conforme necessário */
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s; /* Transição suave para hover */
  position: relative;
  min-height: 60px; /* Define uma altura mínima para os itens */

  &:hover {
    opacity: 0.7;
    transform: translateX(10px);
  }

  > div {
    display: flex;
    padding: 10px;
    flex-direction: row; /* Organiza o texto em coluna */
    justify-content: space-between;
    padding-left: 10px;

    span {
      margin-bottom: 5px; /* Espaçamento entre o título e o subtítulo */
    }

    small {
      font-size: 0.9em; /* Ajuste o tamanho da fonte do subtítulo */
      color: ${props => props.theme.colors.secondary}; /* Ajuste a cor do subtítulo */
    }
  }

  h3 {
    margin-left: 10px; /* Espaçamento entre o valor e o texto */
    font-size: 1.1em; /* Ajuste o tamanho da fonte do valor */
    color: ${props => props.theme.colors.white}; /* Ajuste a cor do valor */
  }

  /* Media Queries para responsividade */
  @media (max-width: 1200px) {
    padding: 10px 15px; /* Ajusta o padding para telas menores */
    min-height: 70px; /* Ajusta a altura mínima */
  }

  @media (max-width: 992px) {
    padding: 8px 10px; /* Ajusta o padding para telas menores */
    min-height: 60px; /* Ajusta a altura mínima */
  }

  @media (max-width: 768px) {
    padding: 6px 8px; /* Ajusta o padding para telas menores */
    min-height: 50px; /* Ajusta a altura mínima */
  }

  @media (max-width: 576px) {
    padding: 4px 5px; /* Ajusta o padding para telas menores */
    min-height: 40px; /* Ajusta a altura mínima */
    width: 100%; /* Garante que o item ocupe toda a largura disponível */
  }
`;

export const Tag = styled.div<ITagProps>`
  width: 10px;
  height: 60%;
  background-color: ${props => props.color};
  position: absolute;
  left: 0;
`;

