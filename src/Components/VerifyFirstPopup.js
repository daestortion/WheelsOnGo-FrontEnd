import React from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/VerifyFirstPopup.css";

export const VerifyFirstPopup = () => {
    const navigate = useNavigate();

    const handleOkClick = () => {
      navigate('/userprofile');
    };

  return (
    <div className="verify-first-popup">
      <div className="overlap-wrappera">
        <div className="overlaps">
          <p className="text-wrapperd">You need to verify your account first to rent.</p>
          <div className="groupq">
            <button className="overlap-groupt"onClick={handleOkClick}>
              <div className="div12">OK</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyFirstPopup;