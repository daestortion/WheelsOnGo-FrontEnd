import axios from 'axios';
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../Css/CheckoutPopup.css";
import barangaysData from '../Data/refbrgy.json';
import citiesData from '../Data/refcitymun.json';
import provincesData from '../Data/refprovince.json';
import close from "../Images/close.svg";
import vector7 from "../Images/vector7.png";
import Loading from "./Loading"; // Import Loading component
import PaymentPopup from "./PaymentPopup";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

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
  const [days, setDays] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for calendar

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedUserId = storedUser.userId;

  const formatDateForManila = (date) => {
    const options = { timeZone: "Asia/Manila", year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Intl.DateTimeFormat('en-PH', options).format(date);
  };

  // Fetch booked dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        setLoading(true); // Start loading when fetching booked dates
        const response = await axios.get(`${BASE_URL}/order/getOrdersByCarId/${car.carId}`);
        const orders = response.data;

        // Filter out returned or terminated orders and map the booked dates
        const bookedRanges = orders
          .filter(order => !order.returned && !order.terminated) // Exclude returned or terminated orders
          .map(order => ({
            start: new Date(order.startDate),
            end: new Date(order.endDate)
          }));

        setBookedDates(bookedRanges);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
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
    if (!startDate) {
      setErrorMessage("Please select a pick-up date first."); // Show message if start date is not selected
      return;
    }
    setEndDateOpen(!endDateOpen);
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const handleDeliveryOptionChange = (event) => {
    setDeliveryOption(event.target.value);
  };

  // Function to calculate days
  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const timeDifference = end.getTime() - start.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  };

  // Recalculate the total price and days based on the selected start and end dates
  useEffect(() => {
    const daysCount = calculateDays(startDate, endDate);
    setDays(daysCount);

    if (daysCount > 0) {
      const rentTotal = car.rentPrice * daysCount;
      setTotalPrice(rentTotal);
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
      setOrder(newOrder);
      setShowPaymentPopup(true); // Show payment popup directly
    }
  };

  const [order, setOrder] = useState(null);

  const handlePaymentPopupClose = () => {
    setShowPaymentPopup(false);
    closePopup();
  };

  const isDateBooked = (date) => {
    return bookedDates.some(({ start, end }) => {
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      const oneDayAfterEndDate = new Date(endDateOnly.getTime() + 24 * 60 * 60 * 1000); // One day after the booked end date

      const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Ensure that the start date and all days between start and end, including one day after, are disabled
      return dateToCheck >= startDateOnly && dateToCheck <= oneDayAfterEndDate;
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
      <div className="cp-overlap">
        <div className='head'>
          <div className="spacer"></div>
          <div className="text-wrapper">Checkout</div>
          <button className="closes" onClick={closePopup}>
            <img className="imgss" alt="Close" src={close} />
          </button>
        </div>

        <div className="finale">
          <div className="overall1">
            <div className="groups2">
              <div className="rectangle">
                <img src={car.carImage} alt="Car" className="car-image" />
              </div>

              <div className="groups1">
                <div className="text-wrapper-234">
                  {car.carBrand} {car.carModel} {car.carYear}
                </div>

                <div className="cp-overlap-group">
                  <div className="text-wrapper-345">₱{car.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <img className="vector2" alt="Vector" src={vector7} />
                  <div className="text-wrapper-412">{car.owner.pNum}</div>
                </div>
              </div>
            </div>

            <div className="groups3">
              <div className="text-wrapper-101">
                Description: <span className="normal-text">{car.carDescription}</span>{" "}
              </div>
              <div className="text-wrapper-101">
                Color: <span className="normal-text">{car.color}</span>
              </div>
              <div className="text-wrapper-101">
                Seat Capacity: <span className="normal-text">{car.maxSeatingCapacity}</span>
              </div>
              <div className="text-wrapper-101">
                Plate Number: <span className="normal-text">{car.plateNumber}</span>
              </div>
              <div className="text-wrapper-101">
                {deliveryOption === "Delivery" ? "Delivery Location:" : "Pick-up Location:"}
              </div>
              <div className="text-wrapper-11">
                {deliveryOption === "Delivery"
                  ? `${houseNumberStreet}, ${selectedBarangay ? barangaysData.RECORDS.find(b => b.brgyCode === selectedBarangay)?.brgyDesc : ""}, 
                    ${selectedCity ? citiesData.RECORDS.find(c => c.citymunCode === selectedCity)?.citymunDesc : ""}, 
                    ${selectedProvince ? provincesData.RECORDS.find(p => p.provCode === selectedProvince)?.provDesc : ""}`
                  : car.address}
              </div>
            </div>
          </div>

          <div className="overall2">
            <div className="groups5">
              <div className="groups4">
                <span className="text-wrapper-51">Pick-up Date</span>
                <div className="div-wrapper12" onMouseEnter={clearErrorMessage}>
                  <div className="text-wrapper-7" onClick={toggleStartDatePicker}>
                    {startDate ? formatDateForManila(startDate) : "mm/dd/yyyy"}
                  </div>
                  {startDateOpen && (
                    <>
                      {loading && <Loading />} {/* Show loading when fetching dates */}
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartDateChange}
                        inline
                        shouldCloseOnSelect
                        minDate={new Date()}
                        filterDate={(date) => !isDateBooked(date)}  // Apply isDateBooked to disable booked dates
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="groups4">
                <div className="text-wrapper-51">Return Date</div>
                <div className="overlap-2" onMouseEnter={clearErrorMessage}>
                  <div className="text-wrapper-12" onClick={toggleEndDatePicker}>
                    {endDate ? formatDateForManila(endDate) : "mm/dd/yyyy"}
                  </div>
                  {endDateOpen && (
                    <>
                      {loading && <Loading />} {/* Show loading when fetching dates */}
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndDateChange}
                        inline
                        shouldCloseOnSelect
                        minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}  // Ensure end date is after start date with 1-day allowance
                        filterDate={(date) => !isDateBooked(date)}  // Apply isDateBooked for end date validation
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

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

            <div className="wew11">

              <div className='divide1'>
                <div className="text-wrapper-8">Total: ₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

                {/* Display number of days */}
                <div className="text-wrapper-8">
                  Days: {days}
                </div>
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
            </div>

            {errorMessage && <div className="error-messagea">{errorMessage}</div>}

            <button className="overlap-group-2121" onClick={handleBook}>
              Next
            </button>
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
