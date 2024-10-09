import React from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../Css/Dashboard.css";
import Header from "../Components/Header"; // Import the Header component
import homecheck from "../Images/homecheck.png";
import car1 from "../Images/car1.png";
import car2 from "../Images/car2.png";
import car3 from "../Images/car3.png";

export const Dashboard = () => {
  const navigate = useNavigate(); // Setup useNavigate

  const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
  };

  return (
    <div className="dashboard">
      <Header />

      <div className="overlap-wrapper">
        <div className="overlap-group">
          <div className="find-book-and-rent-a">
            <span className="text-wrapper">Find, Book, and Rent a Car in </span>
            <span className="span">Easy</span>
            <span className="text-wrapper"> Steps.</span>
            <img className="vector" alt="Vector" src={homecheck} />
          </div>
          
          <span className="div">Conquer the open road with Wheels On Go</span>

          <button className="div-wrapper" onClick={handleCarsClick}>Book Now</button>
        </div>

        <div className="overlap-2">
          <div className="image-group">
            <img className="rectangle" alt="Rectangle" src={car1} />
            <img className="rectangle-2" alt="Rectangle" src={car3} />
            <img className="img" alt="Rectangle" src={car2} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
