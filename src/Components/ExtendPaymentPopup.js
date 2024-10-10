import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../Css/ExtendPaymentPopup.css";
import TAC from "../Images/WheelsOnGoTAC.pdf";
import close from "../Images/close.png";
import line1 from "../Images/line11.png";
import image1 from "../Images/image1.jpg";
import image2 from "../Images/image2.jpg";
import image3 from "../Images/image3.jpg";
import image4 from "../Images/image4.png";
import image5 from "../Images/image5.png";
import image6 from "../Images/image6.png";
import image7 from "../Images/image7.jpg";
import image8 from "../Images/image8.png";
import image9 from "../Images/image9.png";
import image10 from "../Images/image10.png";
import image11 from "../Images/image11.svg";
import image12 from "../Images/image12.png";
import image13 from "../Images/image13.jpg";
import image14 from "../Images/image14.jpg";
import paymonggo from "../Images/paymongo.svg";
import PayPal from "../Components/PayPal";
import PayPalError from "../Components/PaypalError";
import PayPalSuccessful from "../Components/PaypalSuccessful";
import ExtendSuccessPopup from './ExtendSuccessPopup';
import { jsPDF } from "jspdf";

const ExtendPaymentPopup = ({ orderId, endDate, onClose }) => {
  const [isChecked, setIsChecked] = useState(false);
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
  
      const { totalPrice: originalTotalPrice } = orderDetails;
      const updatedTotalPrice = originalTotalPrice + priceSummary.total; // Add extension cost to the existing total
      const extendedEndDate = new Date(endDate).toISOString().split("T")[0]; // Format the extended end date
  
      console.log("Updating order with new total price and extended end date...");
  
      // Prepare updated order data for extending the order
      const updatedOrderData = {
        totalPrice: updatedTotalPrice, // Update total price
        paymentOption: "PayPal", // Set payment option to PayPal
        paid: true, // Mark as paid
        active: true, // Ensure order is still active
      };
  
      // Make request to extend the order with the new end date
      const updateResponse = await axios.put(
        `http://localhost:8080/order/extendOrder/${orderDetails.orderId}?newEndDate=${extendedEndDate}`,
        updatedOrderData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (updateResponse.data) {
        console.log("Order updated successfully with new price and date:", updateResponse.data);
  
        // Prepare payment data for updating the payment status
        const paymentData = {
          orderId: orderDetails.orderId,
          transactionId: details.id,  // Use the PayPal transaction ID from details
          paymentOption: "PayPal", // Set payment option as PayPal
        };
  
        // Update the payment status
        const paymentResponse = await axios.post(`http://localhost:8080/order/updatePaymentStatus`, paymentData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (paymentResponse.data) {
          console.log("Payment status updated successfully.");
          generateReceipt({ ...orderDetails, referenceNumber: details.id }); // Generate receipt using PayPal transaction ID
          setShowExtendSuccessPopup(true); // Show success popup
        } else {
          throw new Error("Failed to update payment status.");
        }
      } else {
        throw new Error("Failed to update the order with the extended date and total price.");
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
      <div className="overlap-wrapper-popup">
        <div className="content">
          <div className="header">Extend Rent Payment</div>

          <button className="close-button" onClick={onClose}>
            <img className="vector-2" alt="Close" src={close} />
          </button>

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
          {car && (
            <div className="car-deets">{car.carBrand} {car.carModel} {car.carYear}</div>
          )}
          <div className="price-pnum">
            <div className="price">₱{car?.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="pnum">{car?.owner?.pNum}</div>
            <img className="vertical" alt="Vector" src={line1} />
          </div>

          <div className="ref-id">Reference Id: {referenceNumber}</div>
          <div className="start-date">Start Date: {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}</div>
          <div className="end-date">New Return Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</div>
          <div className="balance">Balance: ₱{priceSummary.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

          <p className="by-click">By clicking, you are confirming that you have read,</p>
          <p className="understood-agree">
            <span className="spanthis">understood and agree to the </span>
            <a href={TAC} target="_blank" rel="noopener noreferrer" className="tac-link">terms and conditions</a>
            <span className="spanthis">.</span>
          </p>
          <input
            type="checkbox"
            className="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />

          <div className="image-slide">
            <ImageSlider />
          </div>

          <div className="payment-options">
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
                  position: 'absolute',
                  top: '530px',
                  left: '85px',
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
      {showPayPalSuccess && <PayPalSuccessful onClose={handleClosePayPalPopup} />}
      {showPayPalError && <PayPalError onClose={handleClosePayPalPopup} />}
      {showExtendSuccessPopup && <ExtendSuccessPopup order={orderDetails} onClose={handleExtendSuccessPopupClose} />}
    </div>
  );
};

export default ExtendPaymentPopup;
