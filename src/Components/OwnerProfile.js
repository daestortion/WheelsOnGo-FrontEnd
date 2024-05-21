import React, { useState, useEffect } from "react";
import "../Css/OwnerProfile.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profileIcon from "../Images/profile.png";
import check from "../Images/verified.png";
import trash from "../Images/trash.png";
import { useNavigate } from 'react-router-dom';

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
  console.log(user);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Saved user:', savedUser); // Add this line
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
  console.log(user);
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
            <button className="div-wrapper">
              <div className="text-wrapper-4" onClick={handleAddCar}>Register a Car</div>
            </button>
          </div>
          <p className="p">{`${user.phone} | ${user.email}`}</p>
          <div className="text-wrapper-5">order history</div>
          <div className="overlap-3">
            <div className="fgh" />
            <div className="rectangle-2" />
            <img className="icon-trash" alt="Icon trash" src={trash} />
          </div>
          <div className="overlap-4">
            <div className="jkl" />
            <div className="rectangle-2" />
            <img className="img" alt="Icon trash" src={trash} />
          </div>
          <div className="group-2">
            <button className="overlap-5">
              <div className="text-wrapper-6" onClick={handleEditProfile}>Edit Profile</div>
            </button>
          </div>
          <div className="icon-trash-wrapper">
            <img className="icon-trash-2" alt="Icon trash" src={trash} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOwner;
