import React from 'react';
import { Container, Title, Controllers, ButtonStyled } from './styles';


const ContentHeader: React.FC = () =>{

    return(
        <Container>
        <Title><h1>Titulo</h1></Title>
        <Controllers><ButtonStyled>Botão A</ButtonStyled><ButtonStyled>Botão B</ButtonStyled></Controllers>
        </Container>
    );
}

export default ContentHeader;