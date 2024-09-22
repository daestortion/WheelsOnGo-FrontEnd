import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/CheckoutPopup.css";
import close from "../Images/close.svg";
import vector7 from "../Images/vector7.png";
import PaymentPopup from "./PaymentPopup";
import axios from 'axios';

export const CheckoutPopup = ({ car, closePopup }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); // For disabling booked dates
  const [deliveryOption, setDeliveryOption] = useState("Pickup");

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedUserId = storedUser.userId;

  // Fetch booked dates for the car
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/order/getOrdersByCarId/${car.carId}`);
        const orders = response.data;

        // Convert dates to JavaScript Date objects
        const bookedRanges = orders.map(order => ({
          start: new Date(order.startDate),  // Convert to Date object
          end: new Date(order.endDate)       // Convert to Date object
        }));

        setBookedDates(bookedRanges);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    fetchBookedDates();
  }, [car.carId]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartDateOpen(false);
    if (endDate && date && endDate <= date) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndDateOpen(false);
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

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
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
        deliveryOption,
        isDeleted: false,
        referenceNumber: '',
        payment: null
      };
      setOrder(newOrder);
      setShowPaymentPopup(true);
    }
  };

  const [order, setOrder] = useState(null);

  const handlePaymentPopupClose = () => {
    setShowPaymentPopup(false);
    closePopup();
  };

  // Helper function to check if a date is within any booked date range
  const isDateBooked = (date) => {
    return bookedDates.some(({ start, end }) => {
      return date >= start && date <= end;  // Check if the date is within any booked range
    });
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
            <div className="text-wrapper-345">₱{car.rentPrice.toFixed(2)}</div>
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
                minDate={new Date()}
                filterDate={(date) => !isDateBooked(date)} // Disable booked dates
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
                minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                filterDate={(date) => !isDateBooked(date)} // Disable booked dates
              />
            )}
          </div>

            {/* Conditionally hide delivery options when either calendar is open */}
            {!startDateOpen && !endDateOpen && (
              <div className="delivery-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    value="Pickup"
                    checked={deliveryOption === "Pickup"}
                    onChange={handleDeliveryOptionChange}
                  />
                  Pickup
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    value="Delivery"
                    checked={deliveryOption === "Delivery"}
                    onChange={handleDeliveryOptionChange}
                  />
                  Delivery
                </label>

                {/* Render the "Setup your delivery address" button beside the Delivery option */}
                {deliveryOption === "Delivery" && (
                  <button className="setup-delivery-address-btn" onClick={() => alert('Setup your delivery address')}>
                    Setup your delivery address
                  </button>
                )}
              </div>
            )}


          <div className="text-wrapper-8">Total: ₱{totalPrice.toFixed(2)}</div>
          <div className="text-wrapper-101">
            Description: <span className="normal-text">{car.carDescription}</span>{" "}
          </div>
          <div className="text-wrapper-102">
            Color: <span className="normal-text">{car.color}</span>
          </div>
          <div className="text-wrapper-103">
            Seat Capacity: <span className="normal-text">{car.maxSeatingCapacity}</span>
          </div>
          <div className="text-wrapper-104">
            Plate Number: <span className="normal-text">{car.plateNumber}</span>
          </div>
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
