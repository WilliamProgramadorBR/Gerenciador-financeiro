import React, { useState, useMemo, useEffect } from 'react';
import { Container, Content, Button, Filters } from './styles';
import { v4 as uuid } from 'uuid';
import { useParams } from 'react-router-dom';

import SelectInput from '../../components/SelectInput';
import ContentHeader from '../../components/ContentHeader';
import HistoryFinanceCard from '../../components/HistoryFinanceCard';

import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import listOfMonths from '../../utils/months';

interface IData {
  id: string;
  description: string;
  amountFormatted: string;
  frequency: string;
  dateFormatted: string;
  tagColor: string;
}

const List: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [data, setData] = useState<IData[]>([]);
  const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
  const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
  const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente', 'eventual']);
  const [showAll, setShowAll] = useState(false);
  const [apiData, setApiData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3008/api/ganhos');
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return apiData.filter(item => item.type === (type === 'entry-balance' ? 'entrada' : 'saída'));
  }, [apiData, type]);

  const pageData = useMemo(() => {
    return type === 'entry-balance'
      ? {
          title: 'Entradas',
          lineColor: '#4E41F0',
          data: filteredData,
        }
      : {
          title: 'Saídas',
          lineColor: '#E44C4E',
          data: filteredData,
        };
  }, [type, filteredData]);

  const years = useMemo(() => {
    let uniqueYears: number[] = [];

    const { data } = pageData;

    data.forEach(item => {
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
  }, [pageData]);

  const months = useMemo(() => {
    return listOfMonths.map((month, index) => {
      return {
        value: index + 1,
        label: month,
      };
    });
  }, []);

  const handleFrequencyClick = (frequency: string) => {
    const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency);

    if (alreadySelected >= 0) {
      const filtered = frequencyFilterSelected.filter(item => item !== frequency);
      setFrequencyFilterSelected(filtered);
    } else {
      setFrequencyFilterSelected(prev => [...prev, frequency]);
    }
  };

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

  useEffect(() => {
    const { data } = pageData;

    const filteredData = data.filter(item => {
      const date = new Date(item.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency);
    });

    const formattedData = filteredData.map(item => {
      return {
        id: uuid(),
        description: item.description,
        amountFormatted: formatCurrency(Number(item.amount)),
        frequency: item.frequency,
        dateFormatted: formatDate(item.date),
        tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E',
      };
    });

    setData(formattedData);
  }, [pageData, monthSelected, yearSelected, frequencyFilterSelected]);

  const itemsToShow = showAll ? data : data.slice(0, 5);

  return (
    <Container>
      <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
        <SelectInput
          options={months}
          onChange={e => handleMonthSelected(e.target.value)}
          defaultValue={monthSelected}
        />
        <SelectInput
          options={years}
          onChange={e => handleYearSelected(e.target.value)}
          defaultValue={yearSelected}
        />
      </ContentHeader>

      <Filters>
        <button
          type="button"
          className={`
            tag-filter 
            tag-filter-recurrent
            ${frequencyFilterSelected.includes('recorrente') && 'tag-actived'}`}
          onClick={() => handleFrequencyClick('recorrente')}
        >
          Recorrentes
        </button>

        <button
          type="button"
          className={`
            tag-filter 
            tag-filter-eventual
            ${frequencyFilterSelected.includes('eventual') && 'tag-actived'}`}
          onClick={() => handleFrequencyClick('eventual')}
        >
          Eventuais
        </button>
      </Filters>

      <Content>
        <ul style={{ overflowY: 'visible' }}>
          {itemsToShow.map(item => (
            <HistoryFinanceCard
              key={item.id}
              tagColor={item.tagColor}
              title={item.description}
              subtitle={item.dateFormatted}
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
  );
};

export default List;
