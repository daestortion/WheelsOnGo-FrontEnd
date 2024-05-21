import React from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../Css/Dashboard.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import homecheck from "../Images/homecheck.png";
import car1 from "../Images/car1.png";
import car2 from "../Images/car2.png";
import car3 from "../Images/car3.png";
import line1 from "../Images/linevector.png";
import profile from "../Images/profile.png";

export const Dashboard = () => {
  const navigate = useNavigate(); // Setup useNavigate

  // Define onClick handlers
  const handleHomeClick = () => {
    navigate('/home'); // Navigate to dashboard page which is at '/home'
  };

  const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
  };

  const handleAboutClick = () => {
    navigate('/aboutus'); // Navigate to about-us page
  };
  return (
    <div className="dashboard">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <p className="find-book-and-rent-a">
              <span className="text-wrapper">Find, Book, and Rent a Car in </span>
              <span className="span">Easy</span>
              <span className="text-wrapper"> Steps.</span>
            </p>
            <p className="find-book-and-rent-a">
              <span className="text-wrapper">Find, Book, and Rent a Car in </span>
              <span className="span">Easy</span>
              <span className="text-wrapper"> Steps.</span>
            </p>
            <p className="find-book-and-rent-a">
              <span className="text-wrapper">Find, Book, and Rent a Car in </span>
              <span className="span">Easy</span>
              <span className="text-wrapper"> Steps.</span>
            </p>
            <img className="vector" alt="Vector" src={homecheck} />
          </div>
          <p className="div">Conquer the open road with Wheels On Go</p>
          <div className="overlap-2">
            <img className="rectangle" alt="Rectangle" src={car1} />
            <img className="img" alt="Rectangle" src={car2} />
            <img className="rectangle-2" alt="Rectangle" src={car3} />
            <div className="text-wrapper-2">FAMILY CARS</div>
            <div className="text-wrapper-3">SPORTS CARS</div>
          </div>
          <div className="overlap-3">
            <Dropdown>
            <img className="group" alt="Group" src={profile} />
            </Dropdown>
            <div className="text-wrapper-4" onClick={handleHomeClick}>Home</div>
            <div className="text-wrapper-5" onClick={handleCarsClick}>Cars</div>
            <div className="text-wrapper-6" onClick={handleAboutClick}>About</div>
            <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo}/>
          </div>
          <img className="vector-2" alt="Vector" src={line1} />
          <div className="overlap-group-wrapper">
            <button className="div-wrapper">
              <div className="text-wrapper-7">BOOK NOW</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
