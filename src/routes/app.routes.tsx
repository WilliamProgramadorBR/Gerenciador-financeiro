import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Page/Dashboard';
import List from '../Page/List';
import SignIn from '../Page/SingIn';
import FormPage from '../Page/Bank_release';
import ExpensesPage from '../Page/Register_bank'
import { useAuth } from '../hooks/auth';
import Layout from '../components/Layout';


const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { logged } = useAuth();
  return logged ? element : <Navigate to="/" />;
}

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<SignIn />} />
    <Route path="/dashboard" element={<ProtectedRoute element={<Layout><Dashboard /></Layout>} />} />
    <Route path="/register" element={<ProtectedRoute element={<Layout><FormPage /></Layout>} />} />
    <Route path="/list_register" element={<ProtectedRoute element={<Layout><ExpensesPage /></Layout>} />} />
    <Route path="/list/:type" element={<ProtectedRoute element={<Layout><List /></Layout>} />} />
  </Routes>
);

export default AppRoutes;
