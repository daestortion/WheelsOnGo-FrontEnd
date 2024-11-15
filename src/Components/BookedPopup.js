import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/BookedPopup.css";

const BookedPopup = ({ order, onClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    if (onClose) {
      onClose(); // Close the PaymentPopup
    }
    navigate('/cars'); // Redirect to the Cars page
  };

  return (
    <div className="booked-successpopup">
      <div className="bp-overlap">
        <p className="bp-car-booked">
          {order.paymentOption === "PayPal"
            ? `Order is completed, this is your reference number: ${order?.referenceNumber}`
            : `Order ${order?.referenceNumber} is now pending. Please check history for approval.`}
        </p>
        <button className="bp-overlap-group" onClick={handleOkClick}>
          OK
        </button>
      </div>
    </div>
  );
};

export default BookedPopup;
