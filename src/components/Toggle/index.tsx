import React, { useState } from 'react';

import { Container,ToggleLabel, ToggleSelector } from "./styles";

const Toggle: React.FC = () => {
    const [checked, setChecked] = useState(true);
  
    const handleChange = (nextChecked: boolean) => {
      setChecked(nextChecked);
      console.log('mudou', nextChecked);
    };
  
    return (
      <Container>
        <ToggleLabel>Light</ToggleLabel>
        <ToggleSelector
          checked={checked}
          
          onChange={handleChange}
        />
        <ToggleLabel>Dark</ToggleLabel>
      </Container>
    );
  };
  
  export default Toggle;