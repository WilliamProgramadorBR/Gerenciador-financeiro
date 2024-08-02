import React, {ReactNode} from 'react';
import { Container, StyledSelect,StyledOption } from './styles';
interface IselectInputProps{
    options:{
        value: string | number;
        label: string | number;
    }[],
    onChange(event: React.ChangeEvent<HTMLSelectElement>):void | undefined
    defaultValue?: string | number;

}
const SelectInput: React.FC<IselectInputProps> = ({options, onChange, defaultValue}) =>{

    return(
        <Container>
        <StyledSelect onChange={onChange} defaultValue={defaultValue}>
    {options.map((option) => (
      <StyledOption key={option.value} value={option.value}>
        {option.label}
      </StyledOption>
    ))}
  </StyledSelect>
        </Container>
    );
}

export default SelectInput;