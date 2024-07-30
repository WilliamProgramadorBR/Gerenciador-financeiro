import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 200px;
  margin-left: 10px; // Adicione um espaço entre os selects

  select {
    width: 100%;
    height: 40px;
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