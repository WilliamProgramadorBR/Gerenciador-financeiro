import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from "../../src/Page/Dashboard";
import List from "../../src/Page/List";
import Singln from "../../src/Page/SingIn";

import Layout from '../components/Layout';

const AppRoutes: React.FC = () => (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/list/:type" element={<List />} />
        <Route path="/login" element={<Singln />} />
      </Routes>
    </Layout>
  );
  
  export default AppRoutes;