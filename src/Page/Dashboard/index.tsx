import React,{useState, useMemo} from 'react';
import { Container } from './styled';
import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import expenses from'../../repositories/expenses'
import gains from '../../repositories/gains';
import listOfMonths from '../../utils/months';


const Dashboard: React.FC = () =>{
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const years = useMemo(() => {
        let uniqueYears: number[] = [];
    
      
    
        [...expenses, ...gains].forEach(item => {
          const date = new Date(item.date);
          const year = date.getFullYear();
    
          if (!uniqueYears.includes(year)) {
            uniqueYears.push(year);
          }
        });
    
        return uniqueYears.map(year => {
          return {
            value: year,
            label: year,
          };
        });
      }, []);
      const options = [
        {value: 'William', label: 'William'},
        {value: 'Ana', label: 'Ana'},
        {value: 'Miguel', label: 'Miguel'}
    ]
    
      const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
          return {
            value: index + 1,
            label: month,
          };
        });
      }, []);
 
    const handleMonthSelected = (month: string) => {
        try {
          const parseMonth = Number(month);
          setMonthSelected(parseMonth);
        } catch {
          throw new Error('invalid month value. Is accept 0 - 24.');
        }
      };
    
      const handleYearSelected = (year: string) => {
        try {
          const parseYear = Number(year);
          setYearSelected(parseYear);
        } catch {
          throw new Error('invalid year value. Is accept integer numbers.');
        }
      };
    return(
        <div>
        <Container>
              <ContentHeader title='Dashboard' lineColor='#F7931B'>
      
       <SelectInput
          options={months}
          onChange={(e) => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />
        <SelectInput
          options={years}
          onChange={(e) => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
              </ContentHeader>
        </Container></div>
    );
}

export default Dashboard;