import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  color: ${(props) => props.theme.colors.primary};
  margin-top: 0rem;
  text-align: center;
  padding: 0rem;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.primary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;  /* Flexbox para centralizar */
  flex-direction: column;
  align-items: center;
  justify-content: center;  /* Centraliza na vertical */
  max-width: 100%;  /* Garantir que não ultrapasse a largura */
  margin: 0 auto;  /* Centraliza horizontalmente */

  /* Responsividade */
  @media (max-width: 768px) {
    padding: 0.5rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 0.25rem;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const DateTime = styled.div`
  font-size: 1.25rem;
  margin: 0.5rem 0;
  font-weight: bold;

  /* Responsividade */
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 0.4rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 0.3rem 0;
  }
`;

const DateText = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${(props) => props.theme.colors.info};

  /* Responsividade */
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const TimeText = styled.p`
  font-size: 2rem;
  margin: 0;
  color: ${(props) => props.theme.colors.white};

  /* Responsividade */
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;


const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <ClockContainer>
      <DateText>{formatDate(time)}</DateText>
      <TimeText>{formatTime(time)}</TimeText>
    </ClockContainer>
  );
};

export default Clock;
