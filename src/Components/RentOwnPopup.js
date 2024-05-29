import React from "react";
import "../Css/RentOwnPopup.css";

export const RentOwnPopup = () => {
  return (
    <div className="cantrentown-popup">
      <div className="overlap-wrapper">
        <div className="ro-overlap">
          <p className="you-cannot-rent-your">
            You cannot rent <br /> your own car.
          </p>
          <div className="group">
            <div className="overlap-group">
              <div className="text-wrapper">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
