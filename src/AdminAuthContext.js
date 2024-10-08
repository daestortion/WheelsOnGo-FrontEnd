import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return localStorage.getItem("isAdminAuthenticated") === 'true';
    });

    useEffect(() => {
        localStorage.setItem("isAdminAuthenticated", isAdminAuthenticated);
    }, [isAdminAuthenticated]);

    const adminLogin = (adminId) => {
        setIsAdminAuthenticated(true);
        localStorage.setItem("isAdminAuthenticated", 'true');
        localStorage.setItem("adminId", adminId); // Store adminId in localStorage
    };

    const adminLogout = () => {
        setIsAdminAuthenticated(false);
        localStorage.setItem("isAdminAuthenticated", 'false');
        localStorage.removeItem("adminId"); // Remove adminId from localStorage on logout
    };

    return (
        <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

export default AdminAuthContext;
