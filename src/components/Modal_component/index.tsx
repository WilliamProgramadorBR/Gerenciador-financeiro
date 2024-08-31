import React from 'react';
import { Modal, ModalContent, ModalTitle, CloseButton } from './styles'; // Atualize o caminho conforme necessário

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <Modal>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
