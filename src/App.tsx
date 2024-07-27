import React from 'react';
import GlobalStyle from './Styles/GlobalStyle';
import Layout from './components/Layout';
import {ThemeProvider} from 'styled-components'
import  dark from './Styles/themes/dark'
import  ligth from './Styles/themes/light'
import Dashboard from './Page/Dashboard';
import List from '../src/Page/List'


const App: React.FC = () =>{

    return(
        <ThemeProvider theme={dark}>
        <GlobalStyle />
       <Layout><List/>
       </Layout>
       </ThemeProvider>
    );
}

export default App;