import React from "react";
import "../Css/PendingPopup.css";

export const PendingRent = ({ closePopup }) => {
  return (
    <div className="pending-rent">
      <div className="overlap-wrapper343">
        <div className="overlap1212">
          <p className="text-wrapperr3">You already have a pending/active rent.</p>
          <div className="group121a">
            <button className="overlap-groupdfas" onClick={closePopup}>
              <div className="div1aa">OK</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
