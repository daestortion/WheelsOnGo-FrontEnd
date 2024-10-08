import React from "react";
import "../Css/Messages.css";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import Dropdown from "../Components/Dropdown.js";
import { useNavigate } from 'react-router-dom';

export const Messages = () => {
  const navigate = useNavigate();

  const handleMessagesClick = () => {
    navigate('/messages');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleCarsClick = () => {
    navigate('/cars');
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
  };

  return (
    <div className="messages-container">
        <div className="header">
            <img className="sidelogo" alt="Side Logo" src={sidelogo} />

            <div className="nav-links">
                <div className="messages-link" onClick={handleMessagesClick}>Messages</div>
                <div className="home-link" onClick={handleHomeClick}>Home</div>
                <div className="cars-link" onClick={handleCarsClick}>Cars</div>
                <div className="about-link" onClick={handleAboutClick}>About</div>
            </div>

            <Dropdown>
                <button className="profile-button">
                <img alt="Profile" src={profile} />
                </button>
            </Dropdown>
        </div>

        <div className="title">
            <h1>Messages</h1>
        </div>

        KENNETH ORLAND AYADE NEGROOOO
        KENNETH ORLAND AYADE NEGROOOO
        KENNETH ORLAND AYADE NEGROOOO
        KENNETH ORLAND AYADE NEGROOOO
        KENNETH ORLAND AYADE NEGROOOO
        
    </div>
  );
};

export default Messages;
