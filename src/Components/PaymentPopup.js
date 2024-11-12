import axios from 'axios';
import { jsPDF } from "jspdf";
import React, { useEffect, useState } from 'react';
import { CashOptionPopup } from "../Components/BookingPopup";
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
  const [showBookingPopup, setBookingPopup] = useState(false);
  const [paypalPaid, setPaypalPaid] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(endDate) - new Date(startDate)) / oneDay));
  };
  const days = calculateDays();

  useEffect(() => {
    const paymentOption = "Cash";
    const newOrder = {
      startDate,
      endDate,
      totalPrice,
      paymentOption,
      isDeleted: false,
      referenceNumber: '',
    };
    setOrder(newOrder);
  }, [startDate, endDate, totalPrice]);

  const handleBookedPopupClose = () => {
    setShowBookedPopup(false);
    onClose();
  };

  // Polling for PayMongo webhook confirmation every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (order && order.orderId) {
        try {
          const response = await fetch(`http://localhost:8080/api/payment/check-status?orderId=${order.orderId}`);
          const data = await response.json();
          if (data.status === "paid") {
            setIsPaymentConfirmed(true);
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [order]);

  const handleCash = async () => {
    if (order) {
      try {
        const orderPayload = {
          ...order,
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
        }
      } catch (error) {
        console.error('Error submitting cash order:', error);
      }
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

  const handlePayPalSuccess = async (details, data) => {
    try {
      setPaypalPaid(true);
      const transactionId = details.id;
      if (!transactionId) {
        console.error("PayPal transaction ID is missing.");
        return;
      }
  
      // Ensure the order has an orderId before updating the payment status
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
          currentOrder = response.data;  // Set the new order with orderId
          setOrder(currentOrder);  // Update state with the newly created order
          console.log("Order created successfully:", response.data);
        } else {
          throw new Error("Failed to create order before PayPal success.");
        }
      }
  
      // Update payment status for the order
      const paymentData = {
        orderId: currentOrder.orderId,
        transactionId: transactionId,
        paymentOption: "PayPal",
        amount: totalPrice,
        status: 1
      };
  
      const paymentResponse = await axios.post("http://localhost:8080/order/updatePaymentStatus", paymentData, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (paymentResponse.data) {
        generateReceipt();
        setShowPayPalSuccess(true);
        console.log("Payment status updated successfully.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error.message);
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
    setBookingPopup(false);
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
          </div>
          <div className='groups66'>
            <div className="image">
              <ImageSlider />
            </div>
            <p className="pp">Choose Payment Method</p>
            <button
              className='cashbackground'
              onClick={handleCash}
            >
              Cash
            </button>
            <button
              onClick={createPaymentLink}
              className="paymongo-button"
            >
              <img src={paymonggo} alt="PayMongo Logo" className="paymongo-logo" />
            </button>
            <div style={{ position: 'relative' }}>
              <PayPal totalPrice={totalPrice} onSuccess={handlePayPalSuccess} onError={handlePayPalError} />
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
      </div>
      
      {showBookedPopup && <BookedPopup order={order} onClose={handleBookedPopupClose} />}
      {showPayPalSuccess && <PayPalSuccessful onClose={handleClosePayPalPopup} />}
      {showPayPalError && <PayPalError onClose={handleClosePayPalPopup} />}
      {showBookingPopup && <CashOptionPopup onClose={handleCloseCash} />}
    </div>
  );
};

export default PaymentPopup;
