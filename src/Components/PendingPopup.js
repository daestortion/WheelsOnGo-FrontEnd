import React from "react";
import "../Css/PendingPopup.css";

export const PendingRent = ({ closePopup }) => {
  return (
    <div className="pending-rent">
      <div className="overlap-wrapper">
        <div className="overlap">
          <p className="text-wrapper">You already have a pending/active rent.</p>
          <div className="group">
            <div className="overlap-group" onClick={closePopup}>
              <div className="div">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
