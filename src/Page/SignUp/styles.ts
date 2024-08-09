import styled from 'styled-components';

export const Container = styled.div`
    height: 100vh;
    
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: ${props => props.theme.colors.primary};
`;

export const Logo = styled.div`
    display: flex;
    align-items: center;

    margin-bottom: 30px;

    > h2 {
        color: ${props => props.theme.colors.white}; 
        margin-left: 7px;
    }

    > img {
        width: 40px;
        height: 40px;
    }
`;

export const Form = styled.form`
    width: 300px;
    height: 350px; /* Aumentado para acomodar o link de login */

    padding: 30px;

    border-radius: 10px;

    background-color: ${props => props.theme.colors.tertiary};
`;

export const FormTitle = styled.h1`
    margin-bottom: 40px;

    color: ${props => props.theme.colors.white}; 

    &:after {
        content: '';
        display: block;
        width: 55px;
        border-bottom: 10px solid ${props => props.theme.colors.warning};  
    }
`;

export const SignUpLink = styled.a`
  display: block;
  margin-top: 1rem;
  color: #007bff;
  text-align: center;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
