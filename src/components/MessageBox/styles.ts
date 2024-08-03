import styled, { keyframes } from 'styled-components';

const animate = keyframes`
    0% {
        transform: translateX(-100px);
        opacity: 0;
    }
    50% {
        opacity: .3;
    }
    100% {
        transform: translateX(0px);
        opacity: 1;
    }
`;

export const Container = styled.div`
    position: fixed;
    top: 19%; /* Ajusta a posição vertical como porcentagem da altura da tela */
    right: 5%; /* Ajusta a posição horizontal como porcentagem da largura da tela */
    width: 40vw; /* Largura como porcentagem da largura da tela */
    max-width: 500px; /* Define uma largura máxima para grandes telas */
    height: 260px;
    background-color: ${props => props.theme.colors.tertiary};
    color: ${props => props.theme.colors.white};
    border-radius: 7px;
    margin: 10px 0;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    animation: ${animate} .5s;

    > header img {
        width: 35px;
        margin-left: 7px;
    }

    > header p {
        font-size: 18px;
    }

    @media(max-width: 770px) {
        width: 90vw; /* Ajusta a largura para telas menores */
        max-width: 80%; /* Garante que não exceda 90% da largura da tela */
        
        > header h1 {
            font-size: 24px;

            img {
                height: 20px;
                width: 20px;
            }
        }

        > header p, > footer span {
            font-size: 14px;
        }
    }

    @media(max-width: 420px) {
        width: 95vw; /* Ajusta ainda mais a largura para dispositivos muito pequenos */
        height: auto; /* Ajusta a altura para se adaptar ao conteúdo */

        > header p {
            margin-bottom: 15px;
        }
    }
`;
