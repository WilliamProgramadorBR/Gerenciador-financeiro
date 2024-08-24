import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ClockContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  color: ${props => props.theme.colors.secondary};
  margin-top: 1rem;
  text-align: center;
  padding: 1rem;
  border-radius: 10px;
  background: ${props => props.theme.colors.primary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const DateTime = styled.div`
  font-size: 1.25rem;
  margin: 0.5rem 0;
  font-weight: bold;
`;

const DateText = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${props => props.theme.colors.info};
`;

const TimeText = styled.p`
  font-size: 2rem;
  margin: 0;
  color: ${props => props.theme.colors.white};
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
