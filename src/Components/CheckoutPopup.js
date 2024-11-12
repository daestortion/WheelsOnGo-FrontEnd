import axios from 'axios';
import React, { useEffect, useRef, useState } from "react";
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

export const CheckoutPopup = ({ car, closePopup }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false); // Terms and Conditions popup state
  const [isAcceptEnabled, setIsAcceptEnabled] = useState(false); // To enable the accept button
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
  const termsBodyRef = useRef(null); // Ref for the terms body to track scrolling

  // Toggle the Terms and Conditions popup
  const toggleTermsPopup = () => {
    setShowTermsPopup(!showTermsPopup);
    setIsAcceptEnabled(false); // Reset accept button status when reopening
  };

  // Handle scroll to enable accept button only when scrolled to the bottom
  const handleScroll = () => {
    if (termsBodyRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsBodyRef.current;
      // Check if user has scrolled to the bottom
      const isBottom = scrollTop + clientHeight >= scrollHeight - 5; // Use a small buffer to ensure precision
      if (isBottom) {
        setIsAcceptEnabled(true);
      }
    }
  };

  // Fetch booked dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        setLoading(true); // Start loading when fetching booked dates
        const response = await axios.get(`http://localhost:8080/order/getOrdersByCarId/${car.carId}`);
        const orders = response.data;

        // Filter out returned orders and map the booked dates
        const bookedRanges = orders
          .filter(order => !order.returned) // Exclude returned orders
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
      toggleTermsPopup(); // Show Terms and Conditions before proceeding to payment
    }
  };

  const handleAcceptTerms = () => {
    toggleTermsPopup(); // Close the terms popup
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
    setShowPaymentPopup(true); // Show payment popup after accepting terms
  };

  const [order, setOrder] = useState(null);

  const handlePaymentPopupClose = () => {
    setShowPaymentPopup(false);
    closePopup();
  };

  // Logic to disable both booked dates and the day after endDate
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
          <button className="close" onClick={closePopup}>
            <img className="imgs" alt="Close" src={close} />
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
                <span className="text-wrapper-61">Pick-up Date</span>
                <div className="div-wrapper12" onMouseEnter={clearErrorMessage}>
                  <div className="text-wrapper-7" onClick={toggleStartDatePicker}>
                    {startDate ? startDate.toLocaleDateString() : "mm/dd/yyyy"}
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
                    {endDate ? endDate.toLocaleDateString() : "mm/dd/yyyy"}
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
              <div className="text-wrapper-8">Total: ₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              
              {/* Display number of days */}
              <div className="text-wrapper-8">
                Days: {days}
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
      
      {showTermsPopup && (
        <div className="checkout-terms-popup">
          <div className="checkout-terms-content">
            <div className="checkout-terms-header">
              <h2>Terms and Conditions</h2>
              <img
                src={close}
                alt="Close"
                onClick={toggleTermsPopup}
                className="checkout-close-icon"
              />
            </div>
            <div
              className="checkout-terms-body"
              ref={termsBodyRef}
              onScroll={handleScroll}
            >
              <p>Welcome to Wheels On Go. By using our services, you agree to comply with and be bound by the following terms and conditions. Please review the following terms carefully. If you do not agree to these terms, you should not use this site or our services.</p>
              
              <h3>1. Definitions</h3>
              <ul>
                <li><b>LENDER:</b> Wheels On Go</li>
                <li><b>BORROWER:</b> The individual renting the vehicle form Wheels On Go</li>
              </ul>
              
              <h3>2. General Terms</h3>
              <ul>
                <li>The BORROWER must handle the unit/car with care and respect and must return the vehicle in good running condition.</li>
                <li>In the event of loss, damage, or impoundment of the vehicle, the BORROWER is liable to pay the LENDER.  </li>
                <li>The vehicle must not be taken outside the designated area without prior notice.  </li>
                <li>The vehicle must not be used for illegal activities.  </li>
                <li>Non-compliance with the terms of this agreement may result in legal action. Any complaints should be filed in the court of the city where the rental took place. </li>
              </ul>
              
              <h3>3. Fuel and Maintenance</h3>
              <ul>
                <li>The vehicle must be refueled to the same level as at the start of the rental.</li>
                <li>Fuel type: <b>Gasoline Unleaded</b>  </li>
                <li>Tire pressure: <b>40 PSI</b>  </li>
              </ul>

              <h3>4. Vehicle Use and Restrictions</h3>
              <ul>
                <li>The BORROWER must use the vehicle responsibly and in accordance with all local laws.  </li>
                <li>The vehicle must not be used for racing, towing, or any other unauthorized purposes. </li>
              </ul>

              <h3>5. Insurance and Liability</h3>
              <ul>
                <li>The BORROWER is responsible for any damage or loss to the vehicle during the rental period. </li>
                <li>The BORROWER must pay for any traffic violations or parking tickets incurred during the rental period.  </li>
              </ul>

              <h3>6. Termination</h3>
              <ul>
                <li>The LENDER reserves the right to terminate the rental agreement at any time for breach of any terms.  </li>
                <li>If you withdraw your booking <b>at least 3 days before the rental start date, you will receive a full refund.</b> </li>
                <li>If the withdrawal is made <b>less than 3 days before the rental start date, 20% of your payment will be deducted.</b> </li>
                <li>If the withdrawal is made <b>on the start date of the rental, no refund will be issued.</b> </li>
              </ul>

              <h3>7. Termination</h3>
              <ul>
                <li>An excess fee of <b>P150/hour</b> will be charged for exceeding the contracted rental period.  </li>
                <li>The BORROWER must refill the fuel consumed. Excess fuel is non-refundable.  </li>
                <li>The vehicle must be returned clean. A penalty of <b>P200</b> and a cleaning fee of P500 will be charged for smoke and other unacceptable odors.  </li>
                <li>A fee of <b>P250-800</b> will be charged depending on the distance for drop-off or pick-up points outside the designated area.  </li>
                <li>In case of an accident, the BORROWER must pay a participation fee of <b>P15,000</b> plus additional fees depending on the severity of the damage as advised by the insurance company.  </li>
              </ul>

              <h3>8. Governing Law</h3>
              <ul>
                <li>This agreement is governed by the laws of the Philippines. Any disputes arising from this agreement shall be resolved in the courts of the city where the rental took place.  </li>
              </ul>

              <p>By agreeing to these terms and conditions, the BORROWER acknowledges that they have read, understood, and agreed to abide by all the terms and conditions stated above.</p>
              <p><b>IN WITNESS WHEREOF</b>, the parties hereto have hereunto set their hands the day, year, and place above written.</p>
            </div>
            <div className="checkout-terms-footer">
              <button
                className={`checkout-terms-button accept ${isAcceptEnabled ? "active" : "inactive"}`}
                onClick={handleAcceptTerms}
                disabled={!isAcceptEnabled}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

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
