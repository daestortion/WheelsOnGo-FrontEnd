import React from "react";
import "../Css/LandingPage.css";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from "../Components/Header"; // Import the Header component
import homecheck from "../Images/homecheck.png";
import car1 from "../Images/car1.png";
import car2 from "../Images/car2.png";
import car3 from "../Images/car3.png";

export const LandingPage = () => {
    const navigate = useNavigate(); // Setup useNavigate

    const handleCarsClick = () => {
        navigate('/cars'); // Navigate to cars page
      };

      return (
        <div className="landing-page">
          <Header />
          <div className="content-wrapper">
            <div className="overlap-wrapper31">
              <div className="overlap-group31">
                <div className="find-book-and-rent-a31">
                  <span className="text-wrapper31">Find, Book, and Rent a Car in </span>
                  <span className="span31">Easy</span>
                  <span className="text-wrapper31"> Steps.</span>
                  <img className="vector31" alt="Vector" src={homecheck} />
                </div>
                <span className="div31">Conquer the open road with Wheels On Go</span>
                <button className="div-wrapper31" onClick={handleCarsClick}>
                  Book Now
                </button>
              </div>
      
              <div className="overlap-231">
                <div className="image-group31">
                  <img className="rectangle31" alt="Rectangle" src={car1} />
                  <img className="rectangle-231" alt="Rectangle" src={car3} />
                  <img className="img31" alt="Rectangle" src={car2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default LandingPage;