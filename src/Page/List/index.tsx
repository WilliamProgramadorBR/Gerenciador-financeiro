import React, { useState } from 'react';
import { Container, Content, Button } from './styles';
import SelectInput from '../../components/SelectInput';
import ContentHeader from '../../components/ContentHeader';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

const options = [
  { value: 'William', label: 'William' },
  { value: 'Ana', label: 'Ana' },
  { value: 'Miguel', label: 'Miguel' }
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

const List: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const itemsToShow = showAll ? items : items.slice(0, 5);

  return (
    <div>
      <Container>
        <ContentHeader title='Saída' lineColor='#96200b'>
          <SelectInput options={options} />
          <SelectInput options={options} />
        </ContentHeader>
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
