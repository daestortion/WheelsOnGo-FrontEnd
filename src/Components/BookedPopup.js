import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/BookedPopup.css";

const BookedPopup = ({ order, onClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose(); // Close the BookedPopup and the PaymentPopup
    navigate('/cars'); // Redirect to the Cars page
  };

  return (
    <div className="booked-successpopup">
      <div className="overlap-wrapper">
        <div className="bp-overlap">
        <p className="bp-car-booked">
                        {order.paymentOption === "PayPal"
                          ? `Order is completed, this is your referrence number: ${order?.referenceNumber}`
                          : `Order ${order?.referenceNumber} is now pending. Please check history for approval.`}
                    </p>
          <div className="group" >
            <div className="bp-overlap-group" onClick={handleOkClick}>
              <div className="text-wrapper">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedPopup;
