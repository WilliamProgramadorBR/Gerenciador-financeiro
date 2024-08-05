import React from 'react';
import GlobalStyle from './Styles/GlobalStyle';

import {ThemeProvider} from 'styled-components'
import  dark from './Styles/themes/dark'
import  ligth from './Styles/themes/light'
import Routes from '../src/routes/index';
import { useTheme } from './hooks/theme';

const App: React.FC = () =>{
    const {theme} = useTheme();

    return(
        <ThemeProvider theme={theme}>
        <GlobalStyle />
         <Routes/>
       </ThemeProvider>
    );
}

export default App;