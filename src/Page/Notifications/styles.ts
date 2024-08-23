import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;



export const Label = styled.label`
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary ? '#28a745' : '#dc3545'};`

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #0056b3;
  }
`;

export const Message = styled.p`
  margin-top: 15px;
  color: ${props => props.theme.colors.success ? '#28a745' : '#dc3545'};
`;



export const Section = styled.section`
  margin-top: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
`;

export const List = styled.ol`
  margin: 10px 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.colors.primary};

  li {
    margin-bottom: 10px;
  }
`;

export const UnorderedList = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.colors.primary};

  li {
    margin-bottom: 10px;
  }
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;

  &:hover {
    color: ${({ theme }) => theme.colors.success};
  }
`;

export const Strong = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;