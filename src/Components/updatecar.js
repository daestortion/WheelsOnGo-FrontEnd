import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/updatecar.css";
import profileIcon from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import Dropdown from "./Dropdown.js";

export const UpdateCar = () => {
  const navigate = useNavigate(); // Setup useNavigate

  const [carFileName, setCarFileName] = useState("Upload Car OR");
  const [govIdFileName, setGovIdFileName] = useState("Upload Valid Government ID");
  const [imageSrc, setImageSrc] = useState(null);

  const handleHomeClick = () => {
    navigate('/home'); // Navigate to dashboard page which is at '/home'
  };

  const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
  };

  const handleAboutClick = () => {
    navigate('/aboutus'); // Navigate to about-us page
  };

  const handleCarFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCarFileName(file.name);
    }
  };

  const handleGovIdFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setGovIdFileName(file.name);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

          <input className="div-wrapper" type="text" placeholder="Renter Address" />

          <input className="div-wrapper123" type="text" placeholder="Rent Price" />

          <div className="overlap-2">
            <div className="overlap-wrapper">
              <button className="overlap-333" onClick={() => document.getElementById('car-upload-input').click()}>
                <div className="text-wrapper-555">Upload</div>
              </button>
              <input
                id="car-upload-input"
                type="file"
                style={{ display: 'none' }}
                onChange={handleCarFileChange}
              />
            </div>
            <div className="text-wrapper-6">{carFileName}</div>
          </div>
          <div className="overlap-4">
            <div className="overlap-group-wrapper">
              <button className="overlap-3" onClick={() => document.getElementById('gov-id-upload-input').click()}>
                <div className="text-wrapper-5">Upload</div>
              </button>
              <input
                id="gov-id-upload-input"
                type="file"
                style={{ display: 'none' }}
                onChange={handleGovIdFileChange}
              />
            </div>
            <div className="text-wrapper-7">{govIdFileName}</div>
          </div>
          <div className="group-22">
            <button className="overlap-55">
              <div className="text-wrapper-8">Register Car</div>
            </button>
          </div>
          <div className="new-car-details"> New Car Details</div>
          <p className="p">Please enter your new car details. Upon confirming, your car details will be updated.</p>
        </div>
        <div className="text-wrapper-9">Car Registration</div>
        <div className="rectangle">
          {imageSrc && <img src={imageSrc} alt="Uploaded" className="rectangle12" />}
        </div>
        <div className="group-3">
          <button className="overlap-group-2" onClick={() => document.getElementById('image-upload-input').click()}>
            <div className="text-wrapper-10">Upload</div>
          </button>
          <input
            id="image-upload-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateCar;
