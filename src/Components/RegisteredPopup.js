import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/RegisteredPopup.css";

export const RegisteredPopup = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    // Close the popup (this could be a state change in the parent component)
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="successful-register">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="ok-text-wrapper">You have successfully registered.</div>
          <div className="group">
            <div className="overlap-group23" onClick={handleOkClick}>
              <div className="ok-div">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredPopup;
