import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import SignIn from '../Page/SingIn';
import SignUp from '../Page/SignUp';

const AuthRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
    </Routes>
);

export default AuthRoutes;
