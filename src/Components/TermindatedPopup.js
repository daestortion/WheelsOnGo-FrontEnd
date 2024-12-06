import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/TerminatePopup.css";

export const TerminatedPopup = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/history');
  };

  return (
    <div className="terminate-popup">
        <div className="overlap">
          <h1 className="ok-text-wrapper">Order Terminated Successfully.</h1>
            <button className="overlap-group23" onClick={handleOkClick}>
              <span className="ok-div">OK</span>
            </button>
        </div>

    </div>
  );
};

export default TerminatedPopup;
