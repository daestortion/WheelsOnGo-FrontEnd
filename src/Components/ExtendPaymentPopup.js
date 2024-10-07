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

export const ExtendPaymentPopup = ({ car, startDate, endDate, referenceNumber, totalPrice, onClose, userId, carId }) => {
    const [isChecked, setIsChecked] = useState(false);
    const [paypalPaid, setPaypalPaid] = useState(false);
    const [showPayPalSuccess, setShowPayPalSuccess] = useState(false);
    const [showPayPalError, setShowPayPalError] = useState(false);
    const [showExtendSuccessPopup, setShowExtendSuccesPopup] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        console.log("Car object:", car);
        console.log("Order object:", order)
    }, [car, order]);

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

        return <img src={images[currentImageIndex]} alt="Slideshow"  width="500" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    };

    const createPaymentLink = async () => {
        // Ensure that totalPrice is available and convert it to centavos
        const amountInCentavos = Math.round(totalPrice * 100);  // Convert to centavos (e.g. PHP 100.00 = 10000 centavos)
      
        const response = await fetch('http://localhost:8080/api/payment/create-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amountInCentavos,  // Dynamically use totalPrice in centavos
            description: `Payment for renting ${car.carBrand} ${car.carModel} ${car.carYear}`,  // You can add dynamic description if needed
          }),
        });
      
        const data = await response.json();
        console.log('Payment Link Response:', data);
      
        if (data && data.data && data.data.attributes && data.data.attributes.checkout_url) {
          const paymentUrl = data.data.attributes.checkout_url;
          // Redirect user to PayMongo payment page
          window.location.href = paymentUrl;
        } else {
          console.error('Failed to create payment link');
        }
    };

    const handlePayPalSuccess = async (details, data) => {
      try {
          setPaypalPaid(true);
  
          // We assume the order already exists, so we update it.
          let updatedOrder = order;
  
          if (!updatedOrder || !updatedOrder.orderId) {
              console.error("Order object is missing, cannot update order.");
              return;
          }
  
          // Using details.id as PayPal transaction ID
          const transactionId = details.id;
  
          if (!transactionId) {
              console.error("PayPal transaction ID is missing.");
              return;
          }
  
          // Adjusting the form data for the PUT request
          const formData = new FormData();
          formData.append('order', new Blob([JSON.stringify({
              endDate: endDate,            // Updated end date after extension
              balance: totalPrice,         // Updated balance to be paid
              paymentOption: "PayPal",     // Payment method
              isDeleted: false,            // Keep the order active
              referenceNumber: transactionId,  // PayPal transaction ID
          })], { type: 'application/json' }));
  
          // Sending a PUT request to update the order with new end date and payment details
          const response = await axios.put(
              `http://localhost:8080/order/updateOrder/${updatedOrder.orderId}?userId=${userId}&carId=${carId}`, 
              formData, 
              { headers: { 'Content-Type': 'multipart/form-data' } }
          );
  
          if (response.status === 200) {
              updatedOrder = response.data; // Store the updated order details
              setOrder(updatedOrder);       // Update the state with the updated order
  
              // Now proceed to update the payment status
              console.log("Updating payment status for order:", updatedOrder.orderId);
  
              const paymentData = {
                  orderId: updatedOrder.orderId,
                  transactionId: transactionId,  // PayPal transaction ID
                  paymentOption: "PayPal",       // Set payment option as PayPal
              };
  
              const paymentResponse = await axios.post(
                  `http://localhost:8080/order/updatePaymentStatus`, 
                  paymentData, 
                  { headers: { 'Content-Type': 'application/json' } }
              );
  
              if (paymentResponse.data) {
                  setShowPayPalSuccess(true);      // Trigger PayPal success popup
                  generateReceipt();               // Generate receipt after successful payment
                  setShowExtendSuccesPopup(true);  // Show success popup
                  setOrder({                       // Update the order state with the transaction ID
                      ...updatedOrder,
                      referenceNumber: transactionId,
                  });
                  console.log("Payment status updated successfully.");
              } else {
                  throw new Error("Failed to update payment status.");
              }
          } else {
              throw new Error("Failed to update the order.");
          }
  
      } catch (error) {
          console.error("Error updating payment status or order:", error.message);
      }
    };  
    
    const handlePayPalError = (error) => {
        console.error("Handling PayPal error:", error);  // Ensure error handling is logged
        setShowPayPalError(true);
    };

    const generateReceipt = () => {
      const doc = new jsPDF();
      doc.text("Receipt", 20, 20);
      doc.text(`Car: ${car.carBrand} ${car.carModel} ${car.carYear}`, 20, 30);
      doc.text(`Pick-up Date: ${startDate ? startDate.toLocaleDateString() : "N/A"}`, 20, 40);
      doc.text(`Return Date: ${endDate ? endDate.toLocaleDateString() : "N/A"}`, 20, 50);
      doc.text(`Total: ₱${totalPrice.toFixed(2)}`, 20, 60);
      if (order && order.referenceNumber) {
        doc.text(`Reference Number: ${order.referenceNumber}`, 20, 70);
      }
      doc.save("receipt.pdf");
    };

    const handleClosePayPalPopup = () => {
      setShowPayPalSuccess(false);
      setShowPayPalError(false);
    };

    const handleExtendSuccessPopupClose = () => {
      setShowExtendSuccesPopup(false);
      onClose();
    };

    return (
        <div className="extend-payment-popup">
            <div className="overlap-wrapper-popup">
                <div className="content">
                    <div className="header">Extend Rent Payment</div>

                    <button className="close-button" onClick={onClose}>
                        <img className="vector-2" alt="Vector" src={close} />
                    </button>

                    <div className="car-picture">
                        <img src={car.carImage} alt="Car" className="car-image" />
                    </div>
                    <div className="car-deets">{car.carBrand} {car.carModel} {car.carYear}</div>
                    <div className="price-pnum">
                        <div className="price">₱{car.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="pnum">{car.owner.pNum}</div>
                        <img className="vertical" alt="Vector" src={line1} />
                    </div>

                    <div className="ref-id">Reference Id: {referenceNumber}</div>
                    <div className="start-date">Start Date: {startDate ? startDate.toLocaleDateString() : "N/A"}</div>
                    <div className="end-date">New Return Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</div>
                    <div className="balance">Balance: ₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    
                    <p className="by-click">by clicking, you are confirming that you have read,</p>
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
                                disabled={!isChecked}  // Disable PayMongo button if not checked
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
                                <PayPal totalPrice={totalPrice} onSuccess={handlePayPalSuccess} onError={handlePayPalError} />
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
            {showExtendSuccessPopup && <ExtendSuccessPopup order={order} onClose={handleExtendSuccessPopupClose} />}
        </div>
    );
};
    
  
export default ExtendPaymentPopup;