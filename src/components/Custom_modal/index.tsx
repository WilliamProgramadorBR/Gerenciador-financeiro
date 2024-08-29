import React from 'react';
import styled from 'styled-components';

interface ModalProps {
    isOpen: boolean;
    toggle: () => void;
    onSave: () => void;
    title: string;
    children: React.ReactNode;
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7); /* Escurecer o fundo */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow: auto; /* Permitir rolagem se necessário */
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 90%; /* Ajustar largura para ser responsivo */
    max-width: 600px; /* Largura máxima */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    box-sizing: border-box; /* Incluir padding e border na largura e altura */
    overflow-y: auto; /* Permitir rolagem interna se necessário */
    max-height: 80vh; /* Limitar altura do modal */
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #e5e5e5; /* Adicionar uma linha de separação */
    padding-bottom: 10px;
`;

const ModalTitle = styled.h5`
    margin: 0;
    font-size: 1.25rem; /* Ajustar tamanho da fonte */
    color: #333; /* Cor do título */
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888; /* Cor do botão de fechar */
    transition: color 0.3s;
    &:hover {
        color: #000; /* Cor do botão de fechar ao passar o mouse */
    }
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    border-top: 1px solid #e5e5e5; /* Adicionar uma linha de separação */
    padding-top: 10px;
`;

const Button = styled.button<{ variant: 'secondary' | 'primary' }>`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem; /* Ajustar tamanho da fonte */
    cursor: pointer;
    background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
    color: white;
    margin-left: 10px;
    transition: background-color 0.3s;
    &:hover {
        background: ${props => props.variant === 'primary' ? '#0056b3' : '#5a6268'};
    }
`;

const CustomModal: React.FC<ModalProps> = ({ isOpen, toggle, onSave, title, children }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClick={toggle}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={toggle}>×</CloseButton>
                </ModalHeader>
                <div>{children}</div>
                <ModalFooter>
                    <Button variant="secondary" onClick={toggle}>Cancelar</Button>
                    <Button variant="primary" onClick={onSave}>Salvar</Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default CustomModal;
