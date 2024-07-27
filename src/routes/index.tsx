import { BrowserRouter } from 'react-router-dom';
import App from './app.routes';
import React from 'react';

const Routes: React.FC = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

export default Routes;
