import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/ProfileUpdatedPopup.css";

export const ProfileUpdatePopup = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/userprofile'); // Navigate to the user profile page
  };

  return (
    <div className="profile-uploaded">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="ok-text-wrapper">Profile uploaded successfully.</div>
          <div className="group">
            <div className="overlap-group" onClick={handleOkClick}>
              <div className="div">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdatePopup;
