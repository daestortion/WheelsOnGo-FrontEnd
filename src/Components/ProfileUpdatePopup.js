import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/ProfileUpdatedPopup.css";

export const ProfileUpdated = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/userprofile'); // Navigate to the user profile page
  };

    return (
      <div className="profile-updated">

          <div className="overlappp">

            <div className="text-wrapper234">Profile updated successfully.</div>
          
              <button className="overlap-grouppp"  onClick={handleOkClick}>
                <div className="diver">OK</div>
              </button>
            
          </div>
        
      </div>
    );
  };
  

export default ProfileUpdated;
