import styled from "styled-components";


export const Container = styled.div``;

export const Content = styled.div``;

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