import styled from "styled-components";

interface ITitleContainerProps{
  lineColor: string;
}
export const Container = styled.div`
margin-bottom: 25px;
  margin-left: 80%;
  width: calc(100% - 250px); /* Ajuste conforme necessário para o menu lateral */
  margin-left: -43%; /* Espaço para o menu lateral */
  display: flex;

  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;

  position: absolute;
  top: 10%;
  margin-left: -38%;
   /* Espaço para o header */
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-left: 0;
    padding: 10px;
    top: 70px;
  }
`;

export const TitleContainer = styled.div<ITitleContainerProps>`
       margin-left: 10px;
       margin-top: -2%;
    > h1 {
        color: ${props => props.theme.colors.white};

        &::after {
            content: '';
            
            display: block;
            width: 55px;
            border-bottom: 10px solid ${props => props.lineColor};
        }
    }

    @media(max-width: 420px){
        > h1 {
                font-size: 22px;

                &::after {
                content: '';
                display: block;
                width: 55px;
                
                border-bottom: 5px solid ${props => props.lineColor};
            }
        }
    }
`;
export const Controllers = styled.div`
display: flex;
margin-left: 5px;
button {
  margin: 0% 2px;
  margin-left: 0%;
}`

