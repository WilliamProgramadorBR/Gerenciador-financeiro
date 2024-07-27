import React from 'react';
import { Container } from './styles';
import SelectInput from '../../components/SelectInput';
import ContentHeader from '../../components/ContentHeader';
const options = [
    {value: 'William', label: 'William'},
    {value: 'Ana', label: 'Ana'},
    {value: 'Miguel', label: 'Miguel'}
]
const List: React.FC = () =>{

    return(
        <div>
            <Container>
        <ContentHeader title='Saída' lineColor='#96200b'>
                <SelectInput options={options}/>

              </ContentHeader>
              </Container>
        </div>
    );
}

export default List;