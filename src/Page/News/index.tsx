import React, { useEffect, useState } from 'react';
import { Container, Title, NewsItem, LoaderContainer, Loader, LoaderText, ErrorMessage } from './styles';

interface NewsItemType {
  titulo: string;
  link: string;
  data_publicacao: string;
  introducao: string;
  imagens: string;
}

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3008/api/noticias');
        if (!response.ok) {
          throw new Error('Erro na resposta da API');
        }
        const data = await response.json();
        setNews(data.items);
      } catch (error) {
        setError('Não foi possível carregar as notícias. 😢');
        console.error('Erro ao buscar notícias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <LoaderContainer>
        <Loader />
        <LoaderText>Carregando...</LoaderText>
      </LoaderContainer>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>Notícias Recentes do IBGE</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Notícias Recentes do IBGE</Title>
      {news.map((item, index) => {
        const imagens = JSON.parse(item.imagens);
        const imagem = imagens ? imagens.image_fulltext : '';

        return (
          <NewsItem key={index}>
            <h3><a href={item.link} target="_blank" rel="noopener noreferrer">{item.titulo}</a></h3>
            <p>{item.data_publicacao}</p>
            {imagem && <img src={imagem} alt="Imagem da Notícia" />}
            <p>{item.introducao}</p>
          </NewsItem>
        );
      })}
    </Container>
  );
};

export default News;
