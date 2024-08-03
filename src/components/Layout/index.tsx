import React, { ReactNode } from 'react';

import { Grid } from './styles';

import MainHeader from '../MainHeader';
import Aside from '../Aside';
import Content from '../Content';
interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC <LayoutProps>= ({ children }) => (
    <Grid>
        <MainHeader />
        <Aside />
        <Content>
            { children }
        </Content>
    </Grid>
);


export default Layout;