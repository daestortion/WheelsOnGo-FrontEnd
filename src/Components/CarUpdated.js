import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/CarUpdated.css";

export const CarUpdated = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    // Close the popup (this could be a state change in the parent component)
    // Navigate to login page
    navigate('/userprofile');
  };

  return (
    <div className="successful-register">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="ok-text-wrapper">Car updated successfully.</div>
          <div className="group">
            <div className="overlap-group" onClick={handleOkClick}>
              <div className="ok-div">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarUpdated;
