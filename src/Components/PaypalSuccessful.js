import React from "react";
import "../Css/PaypalSuccessful.css";

const PayPalSuccessful = ({ onClose, closePaymentPopup }) => {
  const handleOkClick = () => {
    // First, close the PayPal success popup
    onClose();
    // Then, close the payment popup
    closePaymentPopup();
  };
  return (
    <div className="payment-successful">

        <div className="overlap232">
          <div className="text-wrapper1231">Thank You! PayPal Payment Successful.</div>
          

            <button className="overlap-groupss" onClick={handleOkClick}>
              <div className="text-wrapper-2">OK</div>
            </button>
 
          
        </div>
      
    </div>
  );
};

export default PayPalSuccessful;
