import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/OwnerAcknowledgement.css";

export const OwnerAcknowledgement = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/balance-page');
  };

  return (
    <div className="Owner-Acknowledgement">
        <div className="overlap">
          <h1 className="ok-text-wrapper">Return Proof Acknowledgement Successfully.</h1>
            <button className="overlap-group23" onClick={handleOkClick}>
              OK
            </button>
        </div>

    </div>
  );
};

export default OwnerAcknowledgement;
