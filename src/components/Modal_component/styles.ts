// styles.ts
import styled from 'styled-components';

// Estilo para o fundo do modal
export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// Estilo para o conteúdo do modal
export const ModalContent = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
`;

// Estilo para o título do modal
export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5em;
  color: #333;
`;

// Estilo para o botão de fechar
export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f5f5f5;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2em;
  color: #333;
  transition: background 0.3s ease;

  &:hover {
    background: #ddd;
  }

  &:focus {
    outline: none;
  }
`;
