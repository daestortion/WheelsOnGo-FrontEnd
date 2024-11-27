import axios from 'axios';
import { jsPDF } from "jspdf";
import React, { useEffect, useRef, useState } from 'react';
import PayPal from "../Components/PayPal";
import PayPalError from "../Components/PaypalError";
import PayPalSuccessful from "../Components/PaypalSuccessful";
import "../Css/ExtendPaymentPopup.css";

import close from "../Images/close.png";

import image1 from "../Images/image1.jpg";
import image10 from "../Images/image10.png";
import image11 from "../Images/image11.svg";
import image12 from "../Images/image12.png";
import image13 from "../Images/image13.jpg";
import image14 from "../Images/image14.jpg";
import image2 from "../Images/image2.jpg";
import image3 from "../Images/image3.jpg";
import image4 from "../Images/image4.png";
import image5 from "../Images/image5.png";
import image6 from "../Images/image6.png";
import image7 from "../Images/image7.jpg";
import image8 from "../Images/image8.png";
import image9 from "../Images/image9.png";
import line1 from "../Images/line11.png";




import paymonggo from "../Images/paymongo.svg";



import ExtendSuccessPopup from './ExtendSuccessPopup';


const ExtendPaymentPopup = ({ orderId, endDate, onClose }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckboxEnabled, setIsCheckboxEnabled] = useState(false); // Define isCheckboxEnabled here
  const [paypalPaid, setPaypalPaid] = useState(false);
  const [showPayPalSuccess, setShowPayPalSuccess] = useState(false);
  const [showPayPalError, setShowPayPalError] = useState(false);
  const [showExtendSuccessPopup, setShowExtendSuccessPopup] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingError, setLoadingError] = useState(null);
  const [priceSummary, setPriceSummary] = useState({
    days: 0,
    pricePerDay: 0,
    total: 0,
  });
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [isAcceptEnabled, setIsAcceptEnabled] = useState(false);
  const termsBodyRef = useRef(null);

  useEffect(() => {
    // Ensure orderId is valid before making the request
    if (!orderId) {
      setLoadingError('Invalid Order ID');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/order/getOrderById/${orderId}`);
        if (response.status === 200 && response.data) {
          setOrderDetails(response.data);
          const { car, endDate: orderEndDate } = response.data;

          // Calculate the number of days between current and extended end date
          const currentEndDate = new Date(orderEndDate);
          const extendedEndDate = new Date(endDate);
          const days = Math.ceil((extendedEndDate - currentEndDate) / (1000 * 60 * 60 * 24));

          // Calculate total price
          const total = days * car.rentPrice;

          setPriceSummary({ days, pricePerDay: car.rentPrice, total });

          console.log("Order details fetched:", response.data);
        } else {
          throw new Error("Order details not found or invalid response");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoadingError("Failed to load order details. Please try again.");
      }
    };

    fetchOrderDetails();
  }, [orderId, endDate]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const toggleTermsPopup = () => {
    setShowTermsPopup(!showTermsPopup);
    setIsAcceptEnabled(false); // Reset the accept button when the popup is opened
    setIsCheckboxEnabled(false); // Disable the checkbox when opening the terms
  };

  const handleAcceptTerms = () => {
    setIsChecked(true);
    setIsCheckboxEnabled(true); // Enable and check the checkbox when terms are accepted
    setShowTermsPopup(false);
  };

  const handleScroll = () => {
    const element = termsBodyRef.current;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 5) { 
      // Use a tolerance to account for minor pixel differences
      setIsAcceptEnabled(true); // Enable "Accept" button when scrolled to bottom
    }
  };
  

  const handleAccept = () => {
    handleAcceptTerms(); // Check the checkbox and close modal
  };

  const ImageSlider = () => {
    // Array of image URLs
    const images = [
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      image7,
      image8,
      image9,
      image10,
      image11,
      image12,
      image13,
      image14,
    ];

    // State to track the current image index and shuffled images
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [shuffledImages, setShuffledImages] = useState([]);

    // Shuffle function (Fisher-Yates Shuffle)
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    useEffect(() => {
      // Shuffle the images when the component mounts
      setShuffledImages(shuffleArray(images));
    }, []);

    useEffect(() => {
      // Set up the interval to change the image every 2 seconds
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;

          // If we've gone through all the images, reshuffle and reset
          if (nextIndex >= shuffledImages.length) {
            setShuffledImages(shuffleArray(images));
            return 0; // Reset index to 0 after reshuffling
          }

          return nextIndex;
        });
      }, 1500); // Change image every 2 seconds

      // Clear the interval when the component unmounts
      return () => clearInterval(interval);
    }, [shuffledImages]);

    return <img src={images[currentImageIndex]} alt="Slideshow" width="500" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
  };

  const createPaymentLink = async () => {
    if (!orderDetails) return;

    const amountInCentavos = Math.round(priceSummary.total * 100);
    const response = await fetch('http://localhost:8080/api/payment/create-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountInCentavos,
        description: `Payment for Order ID: ${orderId}`,
      }),
    });

    const data = await response.json();
    if (data?.data?.attributes?.checkout_url) {
      window.location.href = data.data.attributes.checkout_url;
    } else {
      console.error('Failed to create payment link');
    }
  };

  const handlePayPalSuccess = async (details) => {
    try {
        setPaypalPaid(true); // Set PayPal as paid

        if (!orderDetails || !orderDetails.orderId) {
            throw new Error("Order details are missing or invalid.");
        }

        const extendedEndDate = new Date(endDate).toISOString().split("T")[0]; // Format the extended end date

        console.log("Creating a new order extension with the new end date...");

        // Make POST request to extend the order with the new end date
        const extensionResponse = await axios.post(
            `http://localhost:8080/order/extendOrder/${orderDetails.orderId}?newEndDate=${extendedEndDate}`,
            {}, // POST request; no request body needed as per the new API
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (extensionResponse.data) {
            console.log("New order extension created successfully:", extensionResponse.data);

            // Prepare payment data for updating the payment status
            const paymentData = {
                orderId: extensionResponse.data.orderId,  // Use the new order ID from response
                transactionId: details.id,               // Use the PayPal transaction ID from details
                paymentOption: "PayPal",                 // Set payment option as PayPal
                status: 1
            };

            // Update the payment status
            const paymentResponse = await axios.post(
                `http://localhost:8080/order/updatePaymentStatus`,
                paymentData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (paymentResponse.data) {
                console.log("Payment status updated successfully.");
                generateReceipt({ ...orderDetails, orderId: extensionResponse.data.orderId, referenceNumber: details.id }); // Generate receipt using new order ID and PayPal transaction ID
                setShowExtendSuccessPopup(true); // Show success popup
            } else {
                throw new Error("Failed to update payment status.");
            }
        } else {
            throw new Error("Failed to create the new order extension.");
        }
    } catch (error) {
        console.error("Error during PayPal success handling:", error.message);
        setShowPayPalError(true); // Show PayPal error popup
    }
  };

  const generateReceipt = (updatedOrder) => {
    const doc = new jsPDF();
    doc.text("Receipt", 20, 20);
    doc.text(`Order ID: ${orderId}`, 20, 30);
    doc.text(`New Return Date: ${endDate.toLocaleDateString()}`, 20, 40);
    doc.text(`Total: ₱${priceSummary.total.toFixed(2)}`, 20, 50);
    if (updatedOrder?.referenceNumber) {
      doc.text(`Reference Number: ${updatedOrder.referenceNumber}`, 20, 60);
    }
    doc.save("receipt.pdf");
  };

  const handleClosePayPalPopup = () => {
    setShowPayPalSuccess(false);
    setShowPayPalError(false);
  };

  const handleExtendSuccessPopupClose = () => {
    setShowExtendSuccessPopup(false);
    onClose();
  };

  // Error or Loading state
  if (loadingError) {
    return <div className="error-message">{loadingError}</div>;
  }

  if (!orderDetails) {
    return <div>Loading order details...</div>; // Show a loading state while fetching
  }

  const car = orderDetails.car; // Accessing the car object from orderDetails
  const referenceNumber = orderDetails.referenceNumber;
  const startDate = orderDetails.startDate;

  return (
    <div className="extend-payment-popup">

        <div className="content">


        <div className='extend9'>
          <div className="spacer1"></div>
            <h1 className="header">Extend Rent Payment</h1>

            <button className="close-buttosn" onClick={onClose}>
              <img className="vector-2" alt="Close" src={close} />
            </button>
          </div>

            <div className='extend8'>
              <div className='extend4'>
                <div className='extend2'>
                    <div className="car-picture">
                      {car && (
                        <img
                          src={`data:image/png;base64,${car.carImage}`}
                          alt={`${car.carBrand} ${car.carModel}`}
                          className="car-image"
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                    </div>


                  <div className='extend1'>
                      {car && (
                        <div className="car-deets">{car.carBrand} {car.carModel} {car.carYear}</div>
                      )}

                      <div className="group-pnum">
                        <div className="price">₱{car?.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <img className="vertical" alt="Vector" src={line1} />
                        <div className="pnum">{car?.owner?.pNum}</div>
                      </div>
                  </div>
              </div>

                <div className='extend3'>
                  <div className="ref-id">Reference No: {referenceNumber}</div>
                  <div className="start-date">Start Date: {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}</div>
                  <div className="end-date">New Return Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</div>
                  <div className="balance">Balance: ₱{priceSummary.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>

                <div className='extend5'>
                  <input
                       type="checkbox"
                       className="checkbox"
                       checked={isChecked}
                       disabled={!isCheckboxEnabled} // Disable checkbox unless terms are accepted
                       onChange={handleCheckboxChange}
                  />

              <div className="understood-agree">
                <p className="by-click">by clicking, you are confirming that you have read,</p>
                <span className="spanthis">
                   understood and agree to the 
              <button onClick={toggleTermsPopup} className="tac-link">terms and conditions.</button>
                 </span>
                 </div>
                 </div>
                </div>

                
                
              <div className='extend7'>
                  <div className="image-slide">
                    <ImageSlider />
                  </div>

                    <p className="payment-methods">Choose Payment Method</p>

                    <button
                      onClick={createPaymentLink}
                      className="paymongo-option"
                      disabled={!isChecked}
                      style={{
                        pointerEvents: isChecked ? 'auto' : 'none',
                        opacity: isChecked ? 1 : 0.5,
                      }}
                    >
                      <img src={paymonggo} alt="PayMongo Logo" className="paymongologo" />
                    </button>

                    <div
                      style={{
                        pointerEvents: isChecked && !paypalPaid ? 'auto' : 'none',
                        opacity: isChecked && !paypalPaid ? 1 : 0.5,
                        position: 'relative'
                      }}
                    >
                      <PayPal totalPrice={priceSummary.total} onSuccess={handlePayPalSuccess} onError={() => setShowPayPalError(true)} />
                      {paypalPaid && (
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          <span style={{ color: 'green', fontSize: '2rem' }}>✔</span>
                        </div>
                      )}
                    </div>
                  </div>
          </div>
 
           {/* Terms Modal Popup */}
      {showTermsPopup && (
        <div className="extend-terms-modal">
          <div className="extend-terms-content">
            <div className="extend-terms-header">
              <h2>Terms and Conditions</h2>
              <button onClick={toggleTermsPopup} className="extend-close-button">
                <img src={close} alt="Close" />
              </button>
            </div>
            <div
              className="extend-terms-body"
              ref={termsBodyRef}
              onScroll={handleScroll}
            >
              {/* Terms content */}
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

              {/* Additional terms content */}
            </div>
            <div className="extend-terms-footer">
            <button
              className={`extend-terms-button accept ${isAcceptEnabled ? "active" : "inactive"}`}
              onClick={handleAcceptTerms}
              disabled={!isAcceptEnabled}
                >
               Accept
             </button>

            </div>
          </div>
        </div>
      )}


        {/* Popups */}
      </div>
      {showPayPalSuccess && <PayPalSuccessful onClose={handleClosePayPalPopup} />}
      {showPayPalError && <PayPalError onClose={handleClosePayPalPopup} />}
      {showExtendSuccessPopup && <ExtendSuccessPopup order={orderDetails} onClose={handleExtendSuccessPopupClose} />}

    </div>
  );
};

export default ExtendPaymentPopup;