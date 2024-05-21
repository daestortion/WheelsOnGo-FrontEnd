import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/ProfileVerified.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profileIcon from "../Images/profile.png";
import check from "../Images/verified.png";

export const ProfileVerified = () => {
  const [currentUser, setCurrentUser] = useState({
    userId: null,
    firstName: 'FirstName',
    lastName: 'LastName',
    phone: '+63 123 456 7890',
    email: 'youremail@email.org',
    profilePic: null,
    verificationStatus: null,
    isRenting: false
  });

  // Define onClick handlers
  const handleHomeClick = () => {
    navigate('/home'); // Navigate to dashboard page which is at '/home'
  };

  const handleCarsClick = () => {
    navigate('/cars'); // Navigate to cars page
  };

  const handleAboutClick = () => {
    navigate('/about-us'); // Navigate to about-us page
  };

  const navigate = useNavigate();

 useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentUser({
        userId: userData.userId,
        firstName: userData.fName,
        lastName: userData.lName,
        phone: userData.pNum,
        email: userData.email,
        profilePic: userData.profilePic ? `data:image/jpeg;base64,${userData.profilePic}` : 'path_to_default_image.png',
        verificationStatus: userData.verificationStatus,
        isRenting: userData.isRenting
      });

      if (userData.verificationStatus === true && userData.isRenting) {
        navigate('/ownerprofile');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleRegisterAsOwner = async () => {
    const confirmProceed = window.confirm('Do you want to proceed to register as an owner?');
    if (confirmProceed) {
      try {
        const response = await axios.put(`http://localhost:8080/user/updateIsRenting/${currentUser.userId}`, {
          isRenting: true
        });
        if (response.status === 200) {
          const updatedUser = {
            ...currentUser,
            isRenting: true
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          navigate('/ownerprofile');
        } else {
          alert('Failed to update status. Please try again.');
        }
      } catch (error) {
        console.error('Error updating renting status:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleEditProfile = () => {
    navigate('/editprofile');
  };

  return (
    <div className="profile-verified">
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
          <div className="rectangle" style={{ backgroundImage: `url(${currentUser.profilePic})`, backgroundSize: 'cover' }} />
          <div className="overlap-2">
            <div className="overlap-3">
              <div className="text-wrapper-3">{currentUser.firstName} {currentUser.lastName}</div>
              <div className="group-wrapper">
                <img className="vector" alt="Vector" src={check} />
              </div>
            </div>
            <p className="p">{currentUser.phone} | {currentUser.email}</p>
          </div>
          <div className="overlap-4">
            <p className="join-our-car-rental">
              Join our car rental community and start earning extra income <br /> by enlisting your vehicles for rent. Share the convenience and benefits of your car while making money effortlessly.
            </p>
            <div className="fgh" />
          </div>
          <div className="jkl" />
          <div className="group-2">
            <button className="overlap-5" onClick={handleEditProfile}>
              <div className="text-wrapper-5">Edit Profile</div>
            </button>
          </div>
          <div className="group-3">
            <button className="overlap-6" onClick={handleRegisterAsOwner}>
              <div className="text-wrapper-6">Register as Owner</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVerified;