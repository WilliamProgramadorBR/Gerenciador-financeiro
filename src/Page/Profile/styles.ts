// src/components/styles.ts
import styled from 'styled-components';

export const ProfileContainer = styled.div`
  text-align: center;
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer; /* Adicionado para indicar que a imagem é clicável */
`;

export const ImageInput = styled.input`
  display: none;
`;

export const PreviewContainer = styled.div`
  margin-top: 20px;
`;

export const ConfirmButton = styled.button`
  background-color: #28a745; /* Cor verde */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
`;

export const SaveButton = styled.button`
  background-color: #007bff; /* Cor azul */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
