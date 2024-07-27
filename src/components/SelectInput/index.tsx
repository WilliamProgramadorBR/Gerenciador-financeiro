import React, {ReactNode} from 'react';
import { Container } from './styles';
interface IselectInputProps{
    options:{
        value: string | number;
        label: string | number;
    }[],

}
const SelectInput: React.FC<IselectInputProps> = ({options}) =>{

    return(
        <Container>
         <select>
        {options.map(option =>(
              <option value={option.value}>{option.label}</option>
        ))}
        
        
         </select>
        </Container>
    );
}

export default SelectInput;