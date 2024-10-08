import React from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profile from "../Images/profile.png";
import "../Css/Header.css";

const Header = () => {
  const navigate = useNavigate(); // Setup useNavigate

  // Define onClick handlers
  const handleHomeClick = () => {
    navigate('/home'); // Navigate to home page
  };

  const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
  };

  const handleAboutClick = () => {
    navigate('/aboutus'); // Navigate to about-us page
  };

  return (
    <div className="overlap-3">
      <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />

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
