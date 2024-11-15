import axios from 'axios';
import { jsPDF } from "jspdf";
import React, { useEffect, useRef, useState } from 'react';
import PayPal from "../Components/PayPal";
import PayPalError from "../Components/PaypalError";
import PayPalSuccessful from "../Components/PaypalSuccessful";
import "../Css/PaymentPopup.css";
import back from "../Images/back.png";
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
import BookedPopup from './BookedPopup';

const PaymentPopup = ({ car, startDate, endDate, deliveryOption, deliveryAddress, totalPrice, onClose, onBack, userId, carId }) => {
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [order, setOrder] = useState(null);
  const [showPayPalSuccess, setShowPayPalSuccess] = useState(false);
  const [showPayPalError, setShowPayPalError] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [isAcceptEnabled, setIsAcceptEnabled] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const termsBodyRef = useRef(null);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(endDate) - new Date(startDate)) / oneDay));
  };
  const days = calculateDays();

  const toggleTermsPopup = () => {
    setShowTermsPopup(!showTermsPopup);
    setIsAcceptEnabled(false);
  };

  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setShowTermsPopup(false);
  };

  const handleTermsCheckbox = () => {
    if (isTermsAccepted) {
      setIsTermsAccepted(!isTermsAccepted);
    } else {
      toggleTermsPopup();
    }
  };

  const handleScroll = () => {
    const isBottom = termsBodyRef.current.scrollHeight - termsBodyRef.current.scrollTop === termsBodyRef.current.clientHeight;
    setIsAcceptEnabled(isBottom);
  };

  const handleCash = async () => {
    try {
        const orderPayload = {
            startDate,
            endDate,
            totalPrice,
            deliveryOption,
            deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,
            paymentOption: "Cash"
        };

        const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, orderPayload);

        if (response.data) {
            setOrder(response.data);
            setShowBookedPopup(true);
            console.log("Cash order created successfully:", response.data);

            // Now use the order object directly from the state
            const paymentData = {
                orderId: response.data.orderId, // Use orderId from the response
                transactionId: null,  // No transaction ID for cash payments
                paymentOption: "Cash",
                amount: parseFloat(totalPrice),  // Ensure this is a float
                status: 0 // Indicate 'pending' status for Cash payment
            };
            console.log("Payment Data being sent to the backend:", paymentData);

            // Create the payment with 'pending' status for cash
            const paymentResponse = await axios.post("http://localhost:8080/api/payment/create", paymentData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (paymentResponse.data) {
                console.log("Payment created with 'pending' status.");
            }
        }
    } catch (error) {
        console.error("Error submitting cash order:", error);
    }
};

  const createPaymentLink = async () => {
    const amountInCentavos = Math.round(totalPrice * 100);

    try {
      const response = await fetch('http://localhost:8080/api/payment/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          amount: amountInCentavos,
          description: `Payment for renting ${car.carBrand} ${car.carModel} ${car.carYear}`,
        }),
      });

      const data = await response.json();
      if (data && data.data && data.data.attributes && data.data.attributes.checkout_url) {
        const paymentUrl = data.data.attributes.checkout_url;
        window.open(paymentUrl, '_blank');
      } else {
        console.error('Failed to create payment link');
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  };

  let isProcessingPayment = false;

const handlePayPalSuccess = async (details, data) => {
    if (isProcessingPayment) return; // Prevent duplicate submissions
    isProcessingPayment = true;

    try {
        setShowPayPalSuccess(true);
        const transactionId = details.id;

        if (!transactionId) {
            console.error("PayPal transaction ID is missing.");
            return;
        }

        let currentOrder = order;
        if (!currentOrder || !currentOrder.orderId) {
            const newOrder = {
                startDate,
                endDate,
                totalPrice,
                paymentOption: "PayPal",
                isDeleted: false,
                deliveryOption,
                deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,
            };

            const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, newOrder, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data) {
                currentOrder = response.data;
                setOrder(currentOrder);
                console.log("Order created successfully:", response.data);
            } else {
                throw new Error("Failed to create order before PayPal success.");
            }
        }

        const paymentData = {
            orderId: currentOrder.orderId,
            transactionId: transactionId,
            paymentOption: "PayPal",
            amount: totalPrice,
            status: 1
        };

        console.log("Payment Data being sent to the backend:", paymentData);

        const paymentResponse = await axios.post("http://localhost:8080/api/payment/create", paymentData, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (paymentResponse.data) {
            generateReceipt();
            setShowPayPalSuccess(true);
            console.log("Payment created successfully.");
        }
    } catch (error) {
        console.error("Error processing payment:", error.message);
    } finally {
        isProcessingPayment = false; // Reset flag after processing
    }
};



  const handlePayPalError = (error) => {
    console.error("Handling PayPal error:", error);
    setShowPayPalError(true);
  };

  const handleClosePayPalPopup = () => {
    setShowPayPalSuccess(false);
    setShowPayPalError(false);
  };

  const handleCloseCash = () => {
    setShowBookedPopup(false);
  };

  const generateReceipt = async () => {
    try {
      const renterResponse = await axios.get(`http://localhost:8080/user/getUserById/${userId}`);
      const renter = renterResponse.data;

      const ownerResponse = await axios.get(`http://localhost:8080/user/getUserById/${car.owner.userId}`);
      const owner = ownerResponse.data;

      const doc = new jsPDF();

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Official Receipt", 105, 20, { align: "center" });
      doc.setFontSize(16);
      doc.text("Wheels On Go", 105, 30, { align: "center" });

      doc.setFontSize(12);
      const currentDate = new Date().toLocaleDateString();
      doc.text(`Date: ${currentDate}`, 150, 20);
      doc.text(`Receipt No: R-${Math.floor(Math.random() * 100000)}`, 150, 30);

      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      doc.setFont("helvetica", "bold");
      doc.text("RECEIVED BY", 20, 45);
      doc.setFont("helvetica", "normal");
      doc.text(`Renter Name: ${renter.fName} ${renter.lName}`, 20, 55);
      doc.text(`Phone: ${renter.pNum || "N/A"}`, 20, 65);
      doc.text(`Email: ${renter.email || "N/A"}`, 20, 75);
      doc.text(`Address: ${deliveryOption === "Delivery" ? deliveryAddress : car.address}`, 20, 85);

      doc.setLineWidth(0.5);
      doc.line(20, 90, 190, 90);

      doc.setFont("helvetica", "bold");
      doc.text("ORDER DETAILS", 20, 100);
      doc.setFont("helvetica", "normal");
      doc.text(`Car Name: ${car.carBrand} ${car.carModel} ${car.carYear}`, 20, 110);
      doc.text(`Car Owner: ${owner.fName} ${owner.lName}`, 20, 120);
      doc.text(`Renter Name: ${renter.fName} ${renter.lName}`, 20, 130);
      doc.text(`Start Date: ${startDate ? startDate.toLocaleDateString() : "N/A"}`, 20, 140);
      doc.text(`End Date: ${endDate ? endDate.toLocaleDateString() : "N/A"}`, 20, 150);
      doc.text(`Number of Days: ${days}`, 20, 160);

      if (deliveryOption === "Pickup") {
        doc.text(`Pick-up Location: ${car.address}`, 20, 170);
      } else {
        doc.text(`Delivery Location: ${deliveryAddress}`, 20, 170);
      }
      
      doc.text(`Rent Price per Day: ₱${car.rentPrice.toFixed(2)}`, 20, 180);

      doc.setLineWidth(0.5);
      doc.line(20, 185, 190, 185);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount: ₱${totalPrice.toFixed(2)}`, 20, 195);

      doc.text("Signature: _____________________", 20, 210);

      doc.save("receipt.pdf");

    } catch (error) {
      console.error("Error generating receipt:", error);
    }
  };

  const ImageSlider = () => {
    const images = [
      image1, image2, image3, image4, image5, image6, image7,
      image8, image9, image10, image11, image12, image13, image14,
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [shuffledImages, setShuffledImages] = useState([]);

    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    useEffect(() => {
      setShuffledImages(shuffleArray(images));
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= shuffledImages.length) {
            setShuffledImages(shuffleArray(images));
            return 0;
          }
          return nextIndex;
        });
      }, 1500);

      return () => clearInterval(interval);
    }, [shuffledImages]);

    return <img src={images[currentImageIndex]} alt="Slideshow" width="500" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
  };

  return (
    <div className="payment-popup">
      <div className="overlap11">
        <div className='groups88'>
          <button className="back" onClick={onBack}>
              <img className="vector" alt="Vector" src={back} />
          </button>
          <div className="text-wrapper">Payment</div>
          <button className="closes" onClick={onClose}>
              <img className="vector-2" alt="Vector" src={close} />
          </button>
        </div>
        <div className='groups77'>
          <div className='groups44'>
            <div className='groups22'>
              <div className="rectangle-2">
                <img src={car.carImage} alt="Car" className="car-images" />
              </div>
              <div className='groups11'>
                <div className="text-wrapper-33">{car.carBrand} {car.carModel} {car.carYear}</div>
                <div className="overlap-groupp">
                  <div className="text-wrapper-444">₱{car.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <img className="imgs" alt="Vector" src={line1} />
                  <div className="text-wrapper-555">{car.owner.pNum}</div>  
                </div>
              </div>
            </div>
            <div className='groups33'>
              <div className="text-wrapper-611">Return Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</div>
              <div className="text-wrapper-81">Pick-up Date: {startDate ? startDate.toLocaleDateString() : "N/A"}</div>
              <div className="text-wrapper-77">Total: ₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-wrapper-99">
                {deliveryOption === "Pickup" ? (
                  <>Pick-up Location: {car.address}</>
                ) : (
                  <>Delivery Location: {deliveryAddress}</>
                )}
              </div>
            </div>

            <div className="terms-conditions" style={{ marginTop: '15px' }}>
  <input
    type="checkbox"
    id="termsCheckbox"
    checked={isTermsAccepted}
    onChange={handleTermsCheckbox} // Only toggle check state here
    style={{ width: '30px', height: '30px', marginRight: '10px' }}
  />
  <label htmlFor="termsCheckbox" style={{ color: 'red', fontSize: '18px', lineHeight: '1.2', display: 'inline-block' }}>
    <span>by clicking, you are confirming that you have read,</span><br />
    <span>understood and agree to the </span>
    <a
      onClick={toggleTermsPopup} // Open modal only when the link is clicked
      style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
    >
      terms and conditions
    </a>.
  </label>
</div>



          </div>
          <div className='groups66'>
            <div className="image">
              <ImageSlider />
            </div>
            <p className="pp">Choose Payment Method</p>
            <button
              className='cashbackground'
              onClick={handleCash}
              disabled={!isTermsAccepted}
              style={{ opacity: isTermsAccepted ? 1 : 0.5 }}
            >
              Cash
            </button>
            <button
              onClick={createPaymentLink}
              className="paymongo-button"
              disabled={!isTermsAccepted}
              style={{ opacity: isTermsAccepted ? 1 : 0.5 }}
            >
              <img src={paymonggo} alt="PayMongo Logo" className="paymongo-logo" />
            </button>
            <div style={{ position: 'relative', opacity: isTermsAccepted ? 1 : 0.5 }}>
              {isTermsAccepted ? (
                <PayPal totalPrice={totalPrice} onSuccess={handlePayPalSuccess} onError={handlePayPalError} />
              ) : (
                <div className="paypal-placeholder" style={{ cursor: "not-allowed" }}>
                  Pay with PayPal
                </div>
              )}
              {showPayPalSuccess && (
                
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
      </div>

      {showBookedPopup && <BookedPopup order={order} onClose={handleCloseCash} />}
      {showPayPalSuccess && (
        <PayPalSuccessful
          onClose={handleClosePayPalPopup} // Closes the PayPal success popup
          closePaymentPopup={onClose}     // Closes the entire payment popup
        />
      )}
      {showPayPalError && <PayPalError onClose={handleClosePayPalPopup} />}

      {showTermsPopup && (
        <div className="payment-terms-modal">
          <div className="payment-terms-content">
            <div className="payment-terms-header">
              <h2>Terms and Conditions</h2>
              <img
                src={close}
                alt="Close"
                onClick={toggleTermsPopup}
                className="payment-close-icon"
              />
            </div>
            <div
              className="payment-terms-body"
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
              
              {/* Additional terms sections */}

            </div>
            <div className="payment-terms-footer">
              <button
                className={`payment-terms-button accept ${isAcceptEnabled ? "active" : "inactive"}`}
                onClick={handleAcceptTerms}
                disabled={!isAcceptEnabled}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPopup;
