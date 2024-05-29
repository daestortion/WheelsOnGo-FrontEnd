import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/UpdateCar.css";
import profileIcon from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import Dropdown from "./Dropdown.js";

export const UpdateCar = () => {
  const navigate = useNavigate(); // Setup useNavigate

  const [carFileName, setCarFileName] = useState("Upload Car OR");
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

          <input className="div-wrapper" type="text" placeholder="New Description" />

          <input className="div-wrapper123" type="text" placeholder="New Price" />

          <input className="div-wrapper12345" type="text" placeholder="New Location" />

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
          <div className="group-22">
            <button className="overlap-55">
              <div className="text-wrapper-8">Update Car</div>
            </button>
          </div>
          <div className="new-car-details"> New Car Details</div>
          <p className="p">Please enter your new car details. Upon confirming, your car details will be updated.</p>
        </div>
        <div className="text-wrapper-9">Update Car</div>
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
