import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // duração em milissegundos
  onClose: () => void;
}

const AlertContainer = styled(motion.div)<{ type: string }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${({ type }) =>
    type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
  color: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
`;

const CheckIcon = styled(FaCheckCircle)`
  font-size: 24px;
`;

const CloseIcon = styled(FaTimes)`
  margin-left: auto;
  cursor: pointer;
  font-size: 18px;
`;

const Message = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const Alert: React.FC<AlertProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <AlertContainer
      type={type}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      <CheckIcon />
      <Message>{message}</Message>
      <CloseIcon onClick={onClose} />
    </AlertContainer>
  );
};

export default Alert;
