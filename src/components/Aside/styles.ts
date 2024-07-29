import styled from "styled-components";



export const Container = styled.div`
  grid-area: AS;
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.white};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  border-right: 1px solid ${props => props.theme.colors.gray};
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px; /* Ajuste a largura conforme necessário */

  @media (max-width: 768px) {
    padding: 10px;
    justify-content: space-between;
    border-right: none;
    width: 100%;
    height: auto;
    position: static;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    padding: 10px 0;
  }
`;
export const MenuItemLink = styled.a`

color: ${props => props.theme.colors.info};
display: flex;
align-items: center;
text-decoration: none;
transition: opacity .3s;
margin-top: 50%;
&:hover{
    opacity: .7;
    svg{
        font-size: 20px;
    }
}`
export const Header = styled.header`
display: flex;
align-items: center;`;
export const LogoImg = styled.img`
height: 40px;
width: 40px;
`;
export const Title = styled.h3`color: solid${props => props.theme.colors.white};
margin-left: 10px;
`;
export const MenuContainer = styled.nav`

display: flex;
flex-direction: column;
margin: 50px 0px;
margin-top: 30%;
margin-left: -50%`;



