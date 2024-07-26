import React from 'react';
import GlobalStyle from './Styles/GlobalStyle';
import Layout from './components/Layout';
import {ThemeProvider} from 'styled-components'
import  dark from './Styles/themes/dark'
import  ligth from './Styles/themes/light'



const App: React.FC = () =>{

    return(
        <ThemeProvider theme={dark}>
        <GlobalStyle />
       <Layout/>
       </ThemeProvider>
    );
}

export default App;