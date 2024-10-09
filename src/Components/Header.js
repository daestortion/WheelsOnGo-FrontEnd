import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profile from "../Images/profile.png";
import "../Css/Header.css";
import { useAuth } from '../AuthContext';

const Header = () => {
  const navigate = useNavigate(); // Setup useNavigate
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Define onClick handlers
  const handleHomeClick = () => {
    navigate('/home'); // Navigate to home page
    setSideNavOpen(false); // Close side navigation
  };

  const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
    setSideNavOpen(false); // Close side navigation
  };

  const handleAboutClick = () => {
    navigate('/aboutus'); // Navigate to about-us page
    setSideNavOpen(false); // Close side navigation
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setSideNavOpen(false); // Close side navigation
  };

  const goToProfile = () => {
    navigate('/userprofile');
    setSideNavOpen(false); // Close side navigation
  };

  const toggleSideNav = () => {
    setSideNavOpen(!sideNavOpen);
  };

  const closeSideNav = () => {
    setSideNavOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target) && sideNavOpen) {
        setSideNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sideNavOpen]);

  return (
    <div className="overlap-233">
      <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
      <div className="menu-icon right" onClick={toggleSideNav}>&#9776;</div>

      <div ref={sideNavRef} className={`side-nav ${sideNavOpen ? 'open' : ''}`}>
        <div className="close-btn" onClick={closeSideNav}>&times;</div>
        <a href="#home" onClick={handleHomeClick} className="home-link">Home</a>
        <a href="#cars" onClick={handleCarsClick} className="cars-link">Cars</a>
        <a href="#about" onClick={handleAboutClick} className="about-link">About</a>
        <a href="#userprofile" onClick={goToProfile} className="profile-link">Profile</a>
        <a href="#logout" onClick={handleLogout} className="logout-link">Logout</a>
      </div>

      <div className="header-items">
        <div className="text-wrapper-4" onClick={handleHomeClick}>Home</div>
        <div className="text-wrapper-5" onClick={handleCarsClick}>Cars</div>
        <div className="text-wrapper-6" onClick={handleAboutClick}>About</div>
        <Dropdown>
          <img className="group" alt="Group" src={profile} />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;