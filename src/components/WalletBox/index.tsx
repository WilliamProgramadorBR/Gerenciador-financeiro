import React, {ReactNode, useMemo} from 'react';
import CountUp from 'react-countup';
import { Container } from './styles';
import dolarImg from '../../assets/dollar.svg';
import arrowUpImg from '../../assets/arrow-up.svg';
import arrowDownImg from '../../assets/arrow-down.svg';
import { title } from 'process';
interface IWalletBoxProps{
    title: string;
    amount: number;
    footerlabel: string;
    icon:'dolar' | 'arrowUp' | 'arrowDonw';
    color: string;
}
const WalletBox: React.FC<IWalletBoxProps> = ({   title,
    amount,
    footerlabel,
    icon,color}) =>{
    
    const iconSelected = useMemo(()=>{
        switch (icon){
            case 'dolar':
                return dolarImg;
            case'arrowDonw':
            return arrowDownImg;
            case 'arrowUp':
                return arrowUpImg
            default:
                return undefined;
        }
        
    }, [icon])

    return(
        <Container color={color}>
            <span>{title}</span>
            <CountUp
                end={amount}
                prefix={"R$"}
                separator="."
                decimal=","
                decimals={2}
                />
            <small>{footerlabel}</small>
             <img src={iconSelected} alt={title}/>
        
        </Container>
    );
}

export default WalletBox;