import React, { useState } from "react";
import "../Css/BookingPopup.css";

export const CashOptionPopup = ({ onClose }) => {

  return (
    <div className="cash-option-popup">
      <div className="overlap-wrapperfgh">
        <div className="overlapfgh">
          <p className="text-wrapperfgh">To approve your booking, please complete the payment to the car owner first.</p>
          <div className="groupfgh">
            <button className="overlap-groupfgh" onClick={onClose}>
              <div className="divfgh">OK</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CashOptionPopup;