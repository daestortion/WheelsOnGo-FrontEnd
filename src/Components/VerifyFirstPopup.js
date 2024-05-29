import React from "react";
import "../Css/VerifyFirstPopup.css";

export const VerifyFirstPopup = () => {
  return (
    <div className="verify-first-popup">
      <div className="overlap-wrapper">
        <div className="overlap">
          <p className="text-wrapper">You need to verify your account first to rent.</p>
          <div className="group">
            <div className="overlap-group">
              <div className="button">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyFirstPopup;