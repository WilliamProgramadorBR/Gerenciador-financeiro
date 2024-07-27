import React, { useState, useMemo } from 'react';
import { Container, Content, Button, Filters } from './styles';
import SelectInput from '../../components/SelectInput';
import ContentHeader from '../../components/ContentHeader';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';
import { useParams } from 'react-router-dom';

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

const items = [
  { tagColor: '#ec0a0a', title: 'Paga a luz', subtitle: '27/07/2024', amount: 'R$ 130,00' },
  { tagColor: '#ec0a0a', title: 'Supermercado', subtitle: '01/08/2024', amount: 'R$ 210,00' },
  { tagColor: '#ec0a0a', title: 'Restaurante', subtitle: '02/08/2024', amount: 'R$ 85,00' },
  { tagColor: '#ec0a0a', title: 'Transporte', subtitle: '03/08/2024', amount: 'R$ 50,00' },
  { tagColor: '#ec0a0a', title: 'Café', subtitle: '04/08/2024', amount: 'R$ 15,00' },
  { tagColor: '#ec0a0a', title: 'Cinema', subtitle: '05/08/2024', amount: 'R$ 40,00' },
  { tagColor: '#ec0a0a', title: 'Academia', subtitle: '06/08/2024', amount: 'R$ 120,00' },
  { tagColor: '#ec0a0a', title: 'Farmácia', subtitle: '07/08/2024', amount: 'R$ 60,00' },
  { tagColor: '#ec0a0a', title: 'Livraria', subtitle: '08/08/2024', amount: 'R$ 100,00' },
  { tagColor: '#ec0a0a', title: 'Roupa', subtitle: '09/08/2024', amount: 'R$ 150,00' },
  { tagColor: '#ec0a0a', title: 'Mercado', subtitle: '10/08/2024', amount: 'R$ 75,00' },
  // Adicione mais itens conforme necessário
];

interface RouteParams {
  type: string;
}

const List: React.FC = () => {
  const { type } = useParams();
  const [showAll, setShowAll] = useState(false);

  const title = useMemo(() => {
    return type === "entry-balance" ? "Entradas" : "Saídas";
  }, [type]);
  const lineColor = useMemo(() => {
    return type === "entry-balance" ? "#F7931B" : "#E44C4E";
  }, [type]);

  const itemsToShow = showAll ? items : items.slice(0, 5);

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
          <ul>
            {itemsToShow.map((item, index) => (
              <HistoryFinanceCard
                key={index}
                tagColor={item.tagColor}
                title={item.title}
                subtitle={item.subtitle}
                amount={item.amount}
              />
            ))}
          </ul>
          {items.length > 5 && !showAll && (
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
