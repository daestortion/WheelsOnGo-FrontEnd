import React, { useState } from "react";
import "../Css/CheckoutPopup.css";
import close from "../Images/close.svg";
import vector7 from "../Images/vector7.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CheckoutPopup = ({ car, closePopup }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalendarEndOpen, setIsCalendarEndOpen] = useState(false);
  const [isDivCalendarOpen, setIsDivCalendarOpen] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  console.log(car);

  const handleStartDateClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
    setIsCalendarEndOpen(false);
    setIsDivCalendarOpen(false);
  };

  const handleEndDateClick = () => {
    setIsCalendarEndOpen(!isCalendarEndOpen);
    setIsCalendarOpen(false);
    setIsDivCalendarOpen(false);
  };

  const handleDivDateClick = () => {
    setIsDivCalendarOpen(!isDivCalendarOpen);
    setIsCalendarOpen(false);
    setIsCalendarEndOpen(false);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setIsCalendarOpen(false);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setIsCalendarEndOpen(false);
  };

  const handleDivDateChange = (date) => {
    setStartDate(date);
    setIsDivCalendarOpen(false);
  };

  return (
    <div className="checkout-popup">
      <div className="overlap-wrapper">
        <div className="cp-overlap">
          <div className="text-wrapper">Checkout</div>
          <div className="rectangle">
            <img src={car.carImage} alt="Car" className="car-image" />
          </div>
          <div className={`div-checkbox ${isChecked ? 'checked' : ''}`} onClick={handleCheckboxChange}></div>
          <div className="text-wrapper-2">{car.carBrand} {car.carModel} {car.carYear}</div>
          <div className="cp-overlap-group">
            <div className="text-wrapper-3">₱{car.rentPrice}</div>
            <div className="text-wrapper-4">{car.owner.pNum}</div>
            <img className="vector" alt="Vector" src={vector7} />
          </div>
          <div className="text-wrapper-5">Return Date</div>
          <div className="text-wrapper-6">Pick-up Date</div>
          <div className="div-wrapper" onClick={handleDivDateClick}>
            <div className="text-wrapper-7">
              {startDate ? startDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {isDivCalendarOpen && (
              <DatePicker
                selected={startDate}
                onChange={handleDivDateChange}
                inline
              />
            )}
          </div>
          <div className="text-wrapper-8">Total: ₱</div>
          <div className="text-wrapper-9"></div>
          <div className="text-wrapper-10">Pick-up Location:</div>
          <div className="text-wrapper-11">{car.address}</div>
          <div className="overlap-2" onClick={handleStartDateClick}>
            <div className="text-wrapper-12">
              {startDate ? startDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {isCalendarOpen && (
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                inline
              />
            )}
          </div>
          <div className="overlap-2" onClick={handleEndDateClick}>
            <div className="text-wrapper-12">
              {endDate ? endDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {isCalendarEndOpen && (
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                inline
              />
            )}
          </div>
          <div className="group">
            <div className="overlap-group-2">
              <div className="text-wrapper-13">Book</div>
            </div>
          </div>
          <p className="p">by clicking, you are confirming that you have read,</p>
          <p className="understood-and-agree">
            <span className="span">understood and agree to the </span>
            <span className="text-wrapper-14">terms and conditions</span>
            <span className="span">.</span>
          </p>
          <div className="close" onClick={closePopup}>
            <img className="img" alt="Close" src={close} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
