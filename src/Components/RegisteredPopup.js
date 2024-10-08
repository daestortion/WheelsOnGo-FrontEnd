import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/RegisteredPopup.css";

export const RegisteredPopup = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/login');
  };

  return (
    <div className="successful-register">
        <div className="overlap">
          <h1 className="ok-text-wrapper">You have successfully registered.</h1>
            <button className="overlap-group23" onClick={handleOkClick}>
              <span className="ok-div">OK</span>
            </button>
        </div>

    </div>
  );
};

export default RegisteredPopup;
