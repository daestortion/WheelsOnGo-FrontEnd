import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminPrivateRoute = ({ children }) => {
    const { isAdminAuthenticated } = useAdminAuth();
    return isAdminAuthenticated ? children : <Navigate to="/AdminLogin" replace />;
};

export default AdminPrivateRoute;
