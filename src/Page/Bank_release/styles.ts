// src/components/styles.ts
import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: 2rem auto;
`;

export const Title = styled.h1`
    margin-bottom: 1.5rem;
    margin-left: -50px;
    color: ${props => props.theme.colors.white};
`;

export const Form = styled.form`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
`;

export const Input = styled.input`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: 4px;
    font-size: 1rem;
    background-color: ${props => props.theme.colors.success};
`;

export const Select = styled.select`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.info};
    border-radius: 4px;
    font-size: 1rem;
    background-color: ${props => props.theme.colors.success};
`;

export const Button = styled.button`
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    background-color: ${props => props.theme.colors.tertiary};
    color: ${props => props.theme.colors.white};
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: ${props => props.theme.colors.secondary};
    }
`;

export const ErrorMessage = styled.p`
    color: ${props => props.theme.colors.warning};
    margin-top: 1rem;
`;
