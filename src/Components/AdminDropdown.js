import React, { useState, useRef, useEffect } from 'react';
import '../Css/Dropdown.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';

const AdminDropdown = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const node = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (node.current && !node.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/adminlogin');
    };

    return (
        <div className="dropdown" ref={node}>
            <div onClick={toggleDropdown}>
                {children}
            </div>
            {isOpen && (
                <ul className="dropdown-content">
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            )}
        </div>
    );
};

export default AdminDropdown;
