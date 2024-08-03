import React from 'react';
import { Container,Header,LogImg, MenuContainer, MenuItemLink, Title } from './styles';
import logoImg from '../../assets/logo.svg'
import {MdDashboard, MdArrowUpward, MdArrowDownward, MdExitToApp, MdMenu } from 'react-icons/md'

const Aside: React.FC = () =>{

    return(
        <Container>
       <Header>
        <LogImg  src={logoImg} alt="Logo minha carteira" />
        <Title>Minha finanças</Title>
       </Header>
       <MenuContainer>
        <MenuItemLink href="/"> 
        <MdDashboard />Dashboard
         </MenuItemLink>
        <MenuItemLink href="/list/entry-balance"><MdArrowUpward/>Entrada  </MenuItemLink>
        <MenuItemLink href="/list/exit-balance"><MdArrowDownward/>Saidas  </MenuItemLink>
        <MenuItemLink href="#"> <MdExitToApp/>Sair </MenuItemLink>
       </MenuContainer>
        </Container>
    );
}

export default Aside;