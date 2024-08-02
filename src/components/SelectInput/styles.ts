import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 200px;
  margin-left: 10px; // Adicione um espaço entre os selects

  select {
    width: 100%;
    height: 40px;
    margin-left: 10px;
    padding: 0 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    z-index: 1; // Certifique-se de que o z-index esteja configurado corretamente
    
    &:focus {
      border-color: #4e41f0;
      box-shadow: 0 0 5px rgba(78, 65, 240, 0.5);
    }
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  appearance: none; // Remove o estilo padrão do navegador
  cursor: pointer;

  // Adiciona uma seta personalizada para o select
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns="http://www.w3.org/2000/svg"%20viewBox="0%200%204%205"><path%20fill="%23333"%20d="M2%205l2-2H0z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;

  &:focus {
    outline: none;
    border-color: #007BFF;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

// Estilizando as opções
export const StyledOption = styled.option`
  padding: 8px;
  background-color: #fff;
  color: #333;
`;