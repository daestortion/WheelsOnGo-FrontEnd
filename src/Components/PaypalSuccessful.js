import React from "react";
import "../Css/PaypalSuccessful.css";

const PayPalSuccessful = ({ onClose }) => {
  return (
    <div className="payment-successful">
      <div className="overlap-wrapper232">
        <div className="overlap232">
          <div className="text-wrapper1231">PayPal payment successful.</div>
          <div className="div232">Thank You!</div>
          <div className="group" onClick={onClose}>
            <button className="overlap-group">
              <div className="text-wrapper-2">OK</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalSuccessful;
