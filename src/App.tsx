import React from 'react';
import GlobalStyle from './Styles/GlobalStyle';

import {ThemeProvider} from 'styled-components'
import  dark from './Styles/themes/dark'
import  ligth from './Styles/themes/light'
import Routes from '../src/routes/index';

const App: React.FC = () =>{

    return(
        <ThemeProvider theme={dark}>
        <GlobalStyle />
         <Routes/>
       </ThemeProvider>
    );
}

export default App;