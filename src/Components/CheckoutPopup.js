import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/CheckoutPopup.css";
import close from "../Images/close.svg";
import vector7 from "../Images/vector7.png";
import PaymentPopup from "./PaymentPopup"; // Import PaymentPopup component
import axios from 'axios';

export const CheckoutPopup = ({ car, closePopup }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false); // State to manage PaymentPopup visibility
  const [errorMessage, setErrorMessage] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedUserId = storedUser.userId;
  console.log(storedUserId);
  console.log(car);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartDateOpen(false); // Close the date picker
    // Reset endDate if it is before the new startDate
    if (endDate && date && endDate < date) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndDateOpen(false); // Close the date picker
  };

  const toggleStartDatePicker = () => {
    setStartDateOpen(!startDateOpen);
  };

  const toggleEndDatePicker = () => {
    setEndDateOpen(!endDateOpen);
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  useEffect(() => {
    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const rentTotal = car.rentPrice * days;
      const systemFee = rentTotal * 0.15;
      const total = rentTotal + systemFee;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, car.rentPrice]);

  const handleBook = () => {
    if (!startDate || !endDate) {
      setErrorMessage("Please complete pick-up date and return date.");
    } else {
      const newOrder = {
        startDate,
        endDate,
        totalPrice,
        isDeleted: false,
        referenceNumber: '', // Leave it empty as it will be generated on the server side
        payment: null // Handle payment later
      };
      setOrder(newOrder); // Set the order state
      setShowPaymentPopup(true); // Show the PaymentPopup
    }
  };



  const [order, setOrder] = useState(null);


  const handlePaymentPopupClose = () => {
    setShowPaymentPopup(false);
    closePopup(); // Close the CheckoutPopup when PaymentPopup is closed
  };

  return (
    <div className="checkout-popup">
      <div className="overlap-wrapper">
        <div className="cp-overlap">
          <div className="text-wrapper">Checkout</div>
          <div className="rectangle">
            <img src={car.carImage} alt="Car" className="car-image" />
          </div>
          <div className="text-wrapper-234">
            {car.carBrand} {car.carModel} {car.carYear}
          </div>
          <div className="cp-overlap-group">
            <div className="text-wrapper-345">₱{car.rentPrice}</div>
            <div className="text-wrapper-4">{car.owner.pNum}</div>
            <img className="vector" alt="Vector" src={vector7} />
          </div>
          <div className="text-wrapper-5">Return Date</div>
          <div className="text-wrapper-6">Pick-up Date</div>
          <div className="div-wrapper" onMouseEnter={clearErrorMessage}>
            <div className="text-wrapper-7" onClick={toggleStartDatePicker}>
              {startDate ? startDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {startDateOpen && (
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                inline
                shouldCloseOnSelect
                minDate={new Date()} // Disable dates before the current date
              />
            )}
          </div>
          <div className="overlap-2" onMouseEnter={clearErrorMessage}>
            <div className="text-wrapper-12" onClick={toggleEndDatePicker}>
              {endDate ? endDate.toLocaleDateString() : "mm/dd/yyyy"}
            </div>
            {endDateOpen && (
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                inline
                shouldCloseOnSelect
                minDate={startDate || new Date()} // Disable dates before the start date
              />
            )}
          </div>
          <div className="text-wrapper-8">Total: ₱{totalPrice.toFixed(2)}</div>
          <div className="text-wrapper-101">Description: {car.carDescription} </div>
          <div className="text-wrapper-10">Pick-up Location:</div>
          <div className="text-wrapper-11">{car.address}</div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="group">
            <div className="overlap-group-2" onClick={handleBook}>
              <div className="text-wrapper-13">Next</div>
            </div>
          </div>
          <div className="close" onClick={closePopup}>
            <img className="img" alt="Close" src={close} />
          </div>
        </div>
      </div>
      {showPaymentPopup && (
        <PaymentPopup
          car={car}
          startDate={startDate}
          endDate={endDate}
          totalPrice={totalPrice}
          order={order}
          userId={storedUserId}
          carId={car.carId}
          onClose={handlePaymentPopupClose}
          onBack={() => setShowPaymentPopup(false)}
        />
      )}
    </div>
  );
};

export default CheckoutPopup;
