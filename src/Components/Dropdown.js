import React, { useState, useRef, useEffect } from 'react';
import '../Css/Dropdown.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';

const Dropdown = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const goToProfile = () => {
        navigate('/userprofile');
        setIsOpen(false);
    };

    return (
        <div className="dropdown" ref={node} style={{ position: 'relative' }}>
            <div onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {children}
            </div>
            {isOpen && (
                <ul className="dropdown-content">
                    <li onClick={goToProfile}>Profile</li>
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
