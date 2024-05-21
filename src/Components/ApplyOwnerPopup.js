import React from "react";
import "../Css/ApplyOwnerPopup.css";
import close from "../Images/close.svg";

export const ApplyOwnerPopup = ({ closePopup }) => {

  const handleYesClick = () => {
    console.log("Yes Clicked");
  };

  const handleNoClick = () => {
    console.log("No Clicked");
  };

  return (
    <div className="apply-as-owner-popup">
      <div className="overlap-wrapper">
        <div className="overlap">
          <p className="do-you-want-to-apply">
            Do you want to <br /> apply as owner?
          </p>
          <div className="group">
            <div className="overlap-group" onClick={handleYesClick}>
              <div className="text-wrapper">Yes</div>
            </div>
          </div>
          <div className="overlap-group-wrapper">
            <div className="overlap-group" onClick={handleNoClick}>
              <div className="text-wrapper">No</div>
            </div>
          </div>
          <div className="close" onClick={closePopup}>
            <img className="vector" alt="Close" src={close} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyOwnerPopup;
