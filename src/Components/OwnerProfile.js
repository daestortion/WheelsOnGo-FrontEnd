// ProfileOwner.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "../Components/Dropdown.js";
import "../Css/OwnerProfile.css";
import profileIcon from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import trash from "../Images/trash.png";
import check from "../Images/verified.png";

export const ProfileOwner = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleCarsClick = () => {
    navigate('/cars');
  };

  const handleAboutClick = () => {
    navigate('/about-us');
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
  };

  const handleAddCar = () => {
    navigate('/carmanagement');
  };

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profilePic: ''
  });

  const [cars, setCars] = useState([
    { id: 1, name: "Car 1", model: "Model 1" },
    { id: 2, name: "Car 2", model: "Model 2" }
  ]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        firstName: savedUser.firstName || '',
        lastName: savedUser.lastName || '',
        phone: savedUser.pnum || '',
        email: savedUser.email || '',
        profilePic: savedUser.profilePic || 'path_to_default_image.png'
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleDeleteCar = (id) => {
    const updatedCars = cars.filter(car => car.id !== id);
    setCars(updatedCars);
    localStorage.setItem('cars', JSON.stringify(updatedCars));
  };

  return (
    <div className="profile-owner">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper" onClick={handleCarsClick}>Cars</div>
            <div className="div" onClick={handleAboutClick}>About</div>
            <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
            <div className="text-wrapper-2" onClick={handleHomeClick}>Home</div>
            <Dropdown>
              <button className="group">
                <img alt="Group" src={profileIcon} />
              </button>
            </Dropdown>
          </div>
          <div className="rectangle" style={{ backgroundImage: `url(${user.profilePic})`, backgroundSize: 'cover' }} />
          <div className="overlap-2">
            <div className="text-wrapper-3">{`${user.firstName} ${user.lastName}`}</div>
            <img className="vector" alt="Vector" src={check} />
          </div>
          <div className="overlap-group-wrapper">
            <button className="div-wrapper" onClick={handleAddCar}>
              <div className="text-wrapper-4">Register a Car</div>
            </button>
          </div>
          <p className="p">{`${user.phone} | ${user.email}`}</p>
          <div className="text-wrapper-5">Order History</div>
          <div className="car-frames">
            {cars.map(car => (
              <div key={car.id} className="car-frame">
                <div className="car-details">
                  <p>{car.name}</p>
                  <p>{car.model}</p>
                </div>
                <img className="icon-trash" alt="Icon trash" src={trash} onClick={() => handleDeleteCar(car.id)} />
              </div>
            ))}
          </div>
          <div className="group-2">
            <button className="overlap-5" onClick={handleEditProfile}>
              <div className="text-wrapper-6">Edit Profile</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOwner;
