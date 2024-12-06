import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/RefundPopup.css";

export const RefundPopup = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/login');
  };

  return (
    <div className="successful-refund">
        <div className="overlap">
          <h1 className="ok-text-wrapper">Withdrawal request submitted successfully.</h1>
            <button className="overlap-group23" onClick={handleOkClick}>
              <span className="ok-div">OK</span>
            </button>
        </div>

    </div>
  );
};

export default RefundPopup;
