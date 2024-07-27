import React from 'react';
import { Container } from './styled';
import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';

const Dashboard: React.FC = () =>{
    const options = [
        {value: 'William', label: 'William'},
        {value: 'Ana', label: 'Ana'},
        {value: 'Miguel', label: 'Miguel'}
    ]
    return(
        <Container>
              <ContentHeader title='Dashboard' lineColor='#F7931B'>
                <SelectInput options={options}/>

              </ContentHeader>
        </Container>
    );
}

export default Dashboard;