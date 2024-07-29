import React, { useState, useMemo, useEffect } from 'react';
import { Container, Content, Button, Filters } from './styles';
import SelectInput from '../../components/SelectInput';
import ContentHeader from '../../components/ContentHeader';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';
import { useParams } from 'react-router-dom';
import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
const years = [
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' }
];
const months = [
  { value: 2023, label: 'Julho' },
  { value: 2024, label: 'Agosto' },
  { value: 9, label: 'Setembro' }
];




  // Adicione mais itens conforme necessário


interface RouteParams {
  type: string;
}
interface Idata{
  id: string;
  description:string;
  amountFormatted: string;
  frequency: string;
  dataFormatted: string;
  tagColor:string;

}
const List: React.FC = () => {
  const [data, setData] = useState<Idata[]>([]);
 
  const { type } = useParams();
  const [showAll, setShowAll] = useState(false);

  const title = useMemo(() => {
    return type === "entry-balance" ? "Entradas" : "Saídas";
  }, [type]);
  const listData = useMemo(()=>{
    return type === "entry-balance" ? gains : expenses;
  },[]);
  useEffect(()=>{
    const response =  listData.map(item =>{

      return{
       id: String(Math.random()*data.length),
      description:item.description,
      amountFormatted: item.amount,
      frequency: item.frequency,
      dataFormatted: item.date,
      tagColor: item.frequency ==='recorrente'? '#4e41f0': '#E44c4e'}
    })
     setData(response)
},[])
  const lineColor = useMemo(() => {
    return type === "entry-balance" ? "#F7931B" : "#E44C4E";
  }, [type]);

  const itemsToShow = showAll ?data :data.slice(0, 5);

  return (
    <div>
      <Container>
        <ContentHeader title={title} lineColor={lineColor}>
          <SelectInput options={months} />
          <SelectInput options={years} />
        </ContentHeader>
        <Filters>
          <button type="button" className='tag-filter tag-filter-recurrent'>
            Recorrentes
          </button>
          <button type="button" className='tag-filter tag-filter-eventual'>
            Eventuais
          </button>
        </Filters>
        <Content>
          <ul style={{overflowY:"visible"}}>
            
          {itemsToShow.map((item, index) => (

              <HistoryFinanceCard
                key={item.id}
                tagColor={item.tagColor}
                title={item.description}
                subtitle={item.dataFormatted}
                amount={item.amountFormatted}
               

              />
            ))}
          </ul>
          {data.length > 5 && !showAll && (
            <Button onClick={() => setShowAll(true)}>Mostrar Mais</Button>
          )}
          {showAll && (
            <Button onClick={() => setShowAll(false)}>Mostrar Menos</Button>
          )}
        </Content>
      </Container>
    </div>
  );
}

export default List;
