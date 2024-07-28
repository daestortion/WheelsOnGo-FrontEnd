import React from "react";
import "../Css/PaypalError.css";

const PayPalError = ({ onClose }) => {
  return (
    <div className="payment-error-popup">
      <div className="overlap-wrapper312">
        <div className="overlap312">
          <div className="text-wrapper312">Payment Error!</div>
          <p className="div312">Something went wrong, please try again.</p>
          <div className="group312" onClick={onClose}>
            <div className="overlap-group312">
              <div className="text-wrapper-2312">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPalError;
