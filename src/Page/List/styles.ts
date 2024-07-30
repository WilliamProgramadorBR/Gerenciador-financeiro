import styled from "styled-components";


export const Container = styled.div`
margin-top:10%;`;

export const Content = styled.div``;
export const Filters = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  .tag-filter {
    margin-bottom: 30px;
    font-size: 18px;
    font-weight: 500;
    background: none;
    color: ${props => props.theme.colors.white};
    margin: 0 10px;
    opacity: .5;
    transition: opacity 0.5s;

    &:hover { /* Correção aqui */
      opacity: 0.7;
    }
    
    }
  
  .tag-filter-recurrent::after{
      content: '';
      display: block;
      width: 55px;
      margin: 0 auto;
      border-bottom: 10px solid ${props => props.theme.colors.success};
  }
  .tag-filter-eventual::after{
      content: '';
      display: block;
      width: 55px;
      margin: 0 auto;
      border-bottom: 10px solid ${props => props.theme.colors.warning};
  }
  .tag-actived{
    opacity: 1;
  }
  
`;
export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 10px;
  font-size: 1em;

  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;