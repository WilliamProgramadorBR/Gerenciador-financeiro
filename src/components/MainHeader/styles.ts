// src/components/styles.ts
import styled from 'styled-components';

export const Container = styled.div`
    grid-area: MH;
    
    background-color: ${props => props.theme.colors.secondary};
    
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 0 10px;

    border-bottom: 1px solid ${props => props.theme.colors.gray};
`;

export const Profile = styled.div`
    display: flex;
    align-items: center;
    color: ${props => props.theme.colors.white};

    /* Adiciona responsividade sem afetar outros componentes */
    @media (max-width: 768px) {
        flex-direction: column;
        text-align: center;
    }
`;

export const ProfileImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;

    /* Adiciona responsividade sem afetar outros componentes */
    @media (max-width: 768px) {
        margin: 0; /* Remove a margem para telas menores */
        margin-bottom: 10px; /* Adiciona uma margem inferior para separar do texto */
    }
`;

export const Welcome = styled.h3`
    margin: 0; /* Remove o margin padrão do h3 */
    font-size: 18px; /* Ajuste conforme necessário */

    /* Adiciona responsividade sem afetar outros componentes */
    @media (max-width: 768px) {
        font-size: 16px; /* Ajuste o tamanho da fonte para telas menores */
    }
`;

export const UserName = styled.span`
    display: block;
    margin: 0; /* Remove o margin padrão do span */
    font-size: 16px; 
    font-weight: bold; 

  
    @media (max-width: 768px) {
        font-size: 14px;
    }
`;
