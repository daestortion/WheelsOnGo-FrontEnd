import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/CheckoutPopup.css";
import close from "../Images/close.svg";
import vector7 from "../Images/vector7.png";
import PaymentPopup from "./PaymentPopup";
import axios from 'axios';
import provincesData from '../Data/refprovince.json';
import citiesData from '../Data/refcitymun.json';
import barangaysData from '../Data/refbrgy.json';

export const CheckoutPopup = ({ car, closePopup }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); 
  const [deliveryOption, setDeliveryOption] = useState("Pickup");
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');
  const [houseNumberStreet, setHouseNumberStreet] = useState('');

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedUserId = storedUser.userId;

  // Fetch booked dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/order/getOrdersByCarId/${car.carId}`);
        const orders = response.data;
        console.log(response.data);
        const bookedRanges = orders.map(order => ({
          start: new Date(order.startDate),  
          end: new Date(order.endDate)       
        }));

        setBookedDates(bookedRanges);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    fetchBookedDates();
  }, [car.carId]);

  const handleStartDateChange = (date) => {
    const normalizedDate = new Date(date.getTime());
    normalizedDate.setHours(12, 0, 0, 0); // Set the time to noon to avoid time zone issues
    setStartDate(normalizedDate);
    setStartDateOpen(false);
    if (endDate && date && endDate <= date) {
      setEndDate(null);
    }
  };
  
  const handleEndDateChange = (date) => {
    const normalizedDate = new Date(date.getTime());
    normalizedDate.setHours(12, 0, 0, 0); // Set the time to noon to avoid time zone issues
    setEndDate(normalizedDate);
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

  // Recalculate the total price based on the selected start and end dates
  useEffect(() => {
    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const days = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const rentTotal = car.rentPrice * days;
      const systemFee = car.rentPrice * 0.15;
      const total = rentTotal + systemFee;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [startDate, endDate, car.rentPrice]);

  const handleBook = () => {
    if (!startDate || !endDate) {
      setErrorMessage("Please complete pick-up date and return date.");
    } else if (deliveryOption === "Delivery" && (!selectedProvince || !selectedCity || !selectedBarangay || !houseNumberStreet)) {
      setErrorMessage("Please complete the delivery address.");
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
      // Pass the newOrder to the PaymentPopup
      console.log(newOrder);
      setOrder(newOrder);
      setShowPaymentPopup(true);
    }
  };

  const [order, setOrder] = useState(null);

  const handlePaymentPopupClose = () => {
    setShowPaymentPopup(false);
    closePopup();
  };

  // Logic to disable both booked dates and the day after endDate
  const isDateBooked = (date) => {
    return bookedDates.some(({ start, end }) => {
      const oneDayAfterEndDate = new Date(end.getTime() + 24 * 60 * 60 * 1000); // One day after the booked end date
      return date >= start && date <= oneDayAfterEndDate;  // Disable the day after the end date as well
    });
  };

  const filteredCities = citiesData.RECORDS.filter(city => city.provCode === selectedProvince);

  const filteredBarangays = barangaysData.RECORDS.filter(barangay => barangay.citymunCode === selectedCity);

  const handleProvinceChange = (e) => {
    const selectedProv = e.target.value;
    setSelectedProvince(selectedProv);
    setSelectedCity('');
    setSelectedBarangay('');
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setSelectedCity(selectedCity);
    setSelectedBarangay('');
  };

  const handleBarangayChange = (e) => {
    setSelectedBarangay(e.target.value);
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
            <div className="text-wrapper-345">₱{car.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                filterDate={(date) => !isDateBooked(date)}
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
                filterDate={(date) => !isDateBooked(date)}  // Filter out booked dates and the day after
              />
            )}
          </div>

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
            </div>
          )}

          {deliveryOption === "Delivery" && !startDateOpen && !endDateOpen && (
            <div className="address-form">
              <select
                className="address-dropdown"
                value={selectedProvince}
                onChange={handleProvinceChange}
              >
                <option value="">Select Province</option>
                {provincesData.RECORDS.map((province, index) => (
                  <option key={index} value={province.provCode}>{province.provDesc}</option>
                ))}
              </select>

              <select
                className="address-dropdown"
                value={selectedCity}
                onChange={handleCityChange}
                disabled={!selectedProvince}
              >
                <option value="">Select City/Municipality</option>
                {filteredCities.map((city, index) => (
                  <option key={index} value={city.citymunCode}>{city.citymunDesc}</option>
                ))}
              </select>

              <select
                className="address-dropdown"
                value={selectedBarangay}
                onChange={handleBarangayChange}
                disabled={!selectedCity}
              >
                <option value="">Select Barangay</option>
                {filteredBarangays.map((barangay, index) => (
                  <option key={index} value={barangay.brgyCode}>{barangay.brgyDesc}</option>
                ))}
              </select>

              <input
                type="text"
                className="address-input"
                placeholder="House/Lot no./Street"
                value={houseNumberStreet}
                onChange={(e) => setHouseNumberStreet(e.target.value)}
              />
            </div>
          )}

          <div className="text-wrapper-8">Total: ₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
          <div className="text-wrapper-10">
            {deliveryOption === "Delivery" ? "Delivery Location:" : "Pick-up Location:"}
          </div>
          <div className="text-wrapper-11">
            {deliveryOption === "Delivery" 
              ? `${houseNumberStreet}, ${selectedBarangay ? barangaysData.RECORDS.find(b => b.brgyCode === selectedBarangay)?.brgyDesc : ""}, 
                ${selectedCity ? citiesData.RECORDS.find(c => c.citymunCode === selectedCity)?.citymunDesc : ""}, 
                ${selectedProvince ? provincesData.RECORDS.find(p => p.provCode === selectedProvince)?.provDesc : ""}` 
              : car.address}
          </div>
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
          deliveryOption={deliveryOption}  
          deliveryAddress={
            deliveryOption === "Delivery"
              ? `${houseNumberStreet}, ${selectedBarangay ? barangaysData.RECORDS.find(b => b.brgyCode === selectedBarangay)?.brgyDesc : ""}, 
                 ${selectedCity ? citiesData.RECORDS.find(c => c.citymunCode === selectedCity)?.citymunDesc : ""}, 
                 ${selectedProvince ? provincesData.RECORDS.find(p => p.provCode === selectedProvince)?.provDesc : ""}`
              : car.address
          }  
          isExtending={false}
        />
      )}
    </div>
  );
};

export default CheckoutPopup;
