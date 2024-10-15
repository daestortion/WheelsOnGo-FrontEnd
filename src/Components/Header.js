import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profile from "../Images/profile.png";
import "../Css/Header.css";
import { useAuth } from '../AuthContext';  // Adjust path to match your folder structure

const Header = () => {
  const navigate = useNavigate();
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const sideNavRef = useRef(null);
  const { isAuthenticated, logout } = useAuth(); // Access isAuthenticated and logout from useAuth

  const handleHomeClick = () => {
    navigate('/home');
    setSideNavOpen(false);
  };

  const handleCarsClick = () => {
    navigate('/cars');
    setSideNavOpen(false);
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
    setSideNavOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setSideNavOpen(false);
  };

  const goToProfile = () => {
    navigate('/userprofile');
    setSideNavOpen(false);
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
      
      {/* Menu icon should always be visible for side nav toggling */}
      {isAuthenticated && (
        <div className="menu-icon right" onClick={toggleSideNav}>&#9776;</div>
      )}

      {/* Conditionally render the side-nav based on isAuthenticated */}
      {isAuthenticated && (
        <div ref={sideNavRef} className={`side-nav ${sideNavOpen ? 'open' : ''}`}>
          <div className="close-btn" onClick={closeSideNav}>&times;</div>
          <a href="#home" onClick={handleHomeClick} className="home-link">Home</a>
          <a href="#cars" onClick={handleCarsClick} className="cars-link">Cars</a>
          <a href="#about" onClick={handleAboutClick} className="about-link">About</a>
          <a href="#userprofile" onClick={goToProfile} className="profile-link">Profile</a>
          <a href="#logout" onClick={handleLogout} className="logout-link">Logout</a>
        </div>
      )}

      {/* Conditionally render based on isAuthenticated */}
      {isAuthenticated ? (
        <div className="header-items">
          <div className="text-wrapper-4" onClick={handleHomeClick}>Home</div>
          <div className="text-wrapper-5" onClick={handleCarsClick}>Cars</div>
          <div className="text-wrapper-6" onClick={handleAboutClick}>About</div>
          <Dropdown>
            <img className="group" alt="Group" src={profile} />
          </Dropdown>
        </div>
      ) : (
        <div className="auth-buttons">
          <button className="overlap-group-2" onClick={() => navigate('/login')}>LOGIN</button>
          <button className="div-wrapper121" onClick={() => navigate('/register')}>SIGN UP</button>
        </div>
      )}
    </div>
  );
};

export default Header;
