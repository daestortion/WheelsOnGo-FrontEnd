import React from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/Updatecar.css";
import profileIcon from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import Dropdown from "./Dropdown.js";

export const UpdateCar = () => {

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
    <div className="update-car-owner">
      <div className="div">
        <div className="overlap">
          <div className="text-wrapper" onClick={handleHomeClick}>Home</div>
          <div className="text-wrapper-2" onClick={handleCarsClick}>Cars</div>
          <div className="text-wrapper-3" onClick={handleAboutClick}>About</div>
          <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
          <Dropdown>
              <button className="group">
                <img alt="Group" src={profileIcon} />
              </button>
            </Dropdown>
        </div>
        <div className="overlap-group">
          <div className="div-wrapper">
            <div className="text-wrapper-4">Renter Address</div>
          </div>
          <div className="overlap-2">
            <div className="overlap-wrapper">
              <div className="overlap-3">
                <div className="text-wrapper-5">Upload</div>
              </div>
            </div>
            <div className="text-wrapper-6">Upload Car (OR/CR)</div>
          </div>
          <div className="overlap-4">
            <div className="overlap-group-wrapper">
              <div className="overlap-3">
                <div className="text-wrapper-5">Upload</div>
              </div>
            </div>
            <div className="text-wrapper-7">Upload Valid Government ID</div>
          </div>
          <div className="group-2">
            <div className="overlap-5">
              <div className="text-wrapper-8">Register Car</div>
            </div>
          </div>
          <div className="new-car-details"> New Car Details</div>
          <p className="p">Please enter your new car details. Upon confirming, your car details will be updated.</p>
        </div>
        <div className="text-wrapper-9">Car Registration</div>
        <div className="rectangle" />
        <div className="group-3">
          <div className="overlap-group-2">
            <div className="text-wrapper-10">Upload</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateCar;