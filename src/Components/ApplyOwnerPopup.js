import React, { useState } from "react";
import "../Css/ApplyOwnerPopup.css";
import close from "../Images/close.svg";

const ApplyOwnerPopup = ({ closePopup, confirmRegister }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleYesClick = () => {
    if (isChecked) {
      console.log("Yes was clicked");
      confirmRegister();
    } else {
      console.log("Please agree to the terms and conditions first.");
    }
  };

  const handleNoClick = () => {
    console.log("No was clicked");
    closePopup();
  };

  return (
    <div className="apply-as-owner-popup">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="ao-overlap-group">
            <p className="do-you-want-to-apply">
              Do you want to <br /> apply as owner?
            </p>
          </div>
          <div className="group">
            <div className="ao-div-wrapper" onClick={handleYesClick}>
              <div className="text-wrapper">Yes</div>
            </div>
          </div>
          <div className="overlap-group-wrapper">
            <div className="ao-div-wrapper" onClick={handleNoClick}>
              <div className="text-wrapper">No</div>
            </div>
          </div>
          <div className="close" onClick={closePopup} style={{ cursor: "pointer" }}>
            <img className="ao-vector" alt="Vector" src={close} />
          </div>
          <p className="ao-div">
            by clicking, you are confirming that you have read,
          </p>
          <p className="ao-understood-and-agree">
            <span className="span">understood and agree to the </span>
            <a className="ao-text-wrapper-2" href="../Images/WheelsOnGoTAC.pdf" target="_blank" rel="noopener noreferrer">terms and conditions</a>
            <span className="span">.</span>
          </p>
          <div className="ao-rectangle">
            <input type="checkbox" id="terms" checked={isChecked} onChange={handleCheckboxChange} />
            <label htmlFor="terms"></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyOwnerPopup;
