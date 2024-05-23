import React, { useState } from "react";
import "../Css/CheckoutPopup.css";
import close from "../Images/close.svg";
import vector7 from "../Images/vector7.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const CheckoutPopup = ({ car, closePopup }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartDateOpen(false);  // Close the date picker
    // Reset endDate if it is before the new startDate
    if (endDate && date && endDate < date) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndDateOpen(false);  // Close the date picker
  };

  const toggleStartDatePicker = () => {
    setStartDateOpen(!startDateOpen);
  };

  const toggleEndDatePicker = () => {
    setEndDateOpen(!endDateOpen);
  };

  return (
    <div className="checkout-popup">
      <div className="overlap-wrapper">
        <div className="cp-overlap">
          <div className="text-wrapper">Checkout</div>
          <div className="rectangle">
            <img src={car.carImage} alt="Car" className="car-image" />
          </div>
          <div className="text-wrapper-2">
            {car.carBrand} {car.carModel} {car.carYear}
          </div>
          <div className="cp-overlap-group">
            <div className="text-wrapper-3">₱{car.rentPrice}</div>
            <div className="text-wrapper-4">{car.owner.pNum}</div>
            <img className="vector" alt="Vector" src={vector7} />
          </div>
          <div className="text-wrapper-5">Return Date</div>
          <div className="text-wrapper-6">Pick-up Date</div>
          <div className="div-wrapper">
            <div className="text-wrapper-7" onClick={toggleStartDatePicker}>
              {startDate ? startDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {startDateOpen && (
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                inline
                shouldCloseOnSelect
              />
            )}
          </div>
          <div className="overlap-2">
            <div className="text-wrapper-12" onClick={toggleEndDatePicker}>
              {endDate ? endDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {endDateOpen && (
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                inline
                shouldCloseOnSelect
                minDate={startDate}  // Disable dates before the start date
              />
            )}
          </div>
          <div className="text-wrapper-8">Total: ₱</div>
          <div className="text-wrapper-9"></div>
          <div className="text-wrapper-10">Pick-up Location:</div>
          <div className="text-wrapper-11">{car.address}</div>
          <div className="group">
            <div className="overlap-group-2">
              <div className="text-wrapper-13">Book</div>
            </div>
          </div>
          <div className="close" onClick={closePopup}>
            <img className="img" alt="Close" src={close} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
