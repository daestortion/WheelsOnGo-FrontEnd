import React, { useState } from 'react';
import "../Css/PaymentPopup.css";
import qrcode from "../Images/qrcode.png";
import line1 from "../Images/line11.png";
import close from "../Images/close.png";
import back from "../Images/back.png";
import BookedPopup from './BookedPopup'; // Import BookedPopup component
import TAC from "../Images/WheelsOnGoTAC.pdf";

export const PaymentPopup = ({ car, startDate, endDate, totalPrice, onClose, onBack }) => {
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = () => {
    if (isChecked) {
      setShowBookedPopup(true); // Show BookedPopup when Book button is clicked
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleBookedPopupClose = () => {
    setShowBookedPopup(false);
    onClose(); // Close the PaymentPopup when BookedPopup is closed
  };

  return (
    <div className="payment-popup">
      <div className="overlap-wrapper">
        <div className="overlap11">
          <div className="text-wrapper">Payment</div>
          <button className="back" onClick={onBack}>
            <img className="vector" alt="Vector" src={back} />
          </button>
          <p className="pp">Scan the QR code to pay, then upload a screenshot of the receipt.</p>
          <p className="divv">by clicking, you are confirming that you have read,</p>
          <p className="understood-and-agree">
            <span className="span">understood and agree to the </span>
            <a href={TAC} target="_blank" rel="noopener noreferrer" className="text-wrapper-22">terms and conditions</a>
            <span className="span">.</span>
          </p>
          <input
            type="checkbox"
            className="rectangle11"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className="rectangle-2">
            <img src={car.carImage} alt="Car" className="car-image" />
          </div>
          <div className="text-wrapper-3">{car.carBrand} {car.carModel} {car.carYear}</div>
          <div className="overlap-groupp">
            <div className="text-wrapper-444">₱{car.rentPrice}</div>
            <div className="text-wrapper-55">{car.owner.pNum}</div>
            <img className="img" alt="Vector" src={line1} />
          </div>
          <div className="text-wrapper-61">Return Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</div>
          <div className="text-wrapper-7">Total: ₱{totalPrice.toFixed(2)}</div>
          <div className="text-wrapper-8">Pick-up Date: {startDate ? startDate.toLocaleDateString() : "N/A"}</div>
          <div className="text-wrapper-9">Pick-up Location: {car.address}</div>
          <div className="overlap-2">
            <div className="group11">
              <button className="div-wrapper111">
                <div className="text-wrapper-101">Upload</div>
              </button>
            </div>
            <div className="payment-screenshot">Payment&nbsp;&nbsp;Screenshot</div>
          </div>
          <div className="overlap-group-wrapper">
            <button
              className="overlap-33"
              onClick={handleClick}
              disabled={!isChecked} // Disable the button if the checkbox is not checked
            >
              <div className="text-wrapper-11">Book</div>
            </button>
          </div>
          <button className="close" onClick={onClose}>
            <img className="vector-2" alt="Vector" src={close} />
          </button>
          <img className="image" alt="Image" src={qrcode} />
        </div>
      </div>
      {showBookedPopup && <BookedPopup onClose={handleBookedPopupClose} />}
    </div>
  );
};

export default PaymentPopup;
