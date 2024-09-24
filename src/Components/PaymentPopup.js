import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import "../Css/PaymentPopup.css";
import qrcode from "../Images/qrcode.png";
import line1 from "../Images/line11.png";
import close from "../Images/close.png";
import back from "../Images/back.png";
import BookedPopup from './BookedPopup';
import TAC from "../Images/WheelsOnGoTAC.pdf";
import axios from 'axios';
import PayPal from "../Components/PayPal";
import PayPalError from "../Components/PaypalError";
import PayPalSuccessful from "../Components/PaypalSuccessful";
import { CashOptionPopup } from "../Components/BookingPopup";

const PaymentPopup = ({
  car,
  startDate,
  endDate,
  totalPrice,
  initialOrder,
  deliveryOption,
  deliveryAddress,
  onClose,
  onBack,
  userId,
  carId
}) => {
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [showPayPalSuccess, setShowPayPalSuccess] = useState(false);
  const [showPayPalError, setShowPayPalError] = useState(false);
  const [showBookingPopup, setBookingPopup] = useState(false);
  const [paypalPaid, setPaypalPaid] = useState(false);

  // Local state for order
  const [order, setOrder] = useState(initialOrder);

  // Initialize order state from the initialOrder prop ONCE
  useEffect(() => {
    setOrder(initialOrder);
  }, [initialOrder]);

  // Update order when uploadedFile changes
  useEffect(() => {
    if (uploadedFile) {
      setOrder(prevOrder => ({
        ...prevOrder,
        paymentOption: "GCash",
        payment: { method: 'image', screenshot: uploadedFile }
      }));
    } else {
      setOrder(prevOrder => ({
        ...prevOrder,
        paymentOption: "Cash",
        payment: null
      }));
    }
  }, [uploadedFile]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleBookedPopupClose = () => {
    setShowBookedPopup(false);
    onClose();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
    }
  };

  // Function to handle form submission for GCash payment
  const handleClick = async () => {
    if (order && isChecked) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('order', new Blob([JSON.stringify({
          ...order,
          startDate,
          endDate,
          totalPrice,
          deliveryOption,
          deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,
        })], { type: 'application/json' }));

        const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data) {
          setOrder(response.data);
          setShowBookedPopup(true);
        }
      } catch (error) {
        console.error('Error submitting order:', error);
      }
    }
  };

  const handlePayPalSuccess = async (details) => {
    setPaypalPaid(true);
    let newOrder = order;

    if (!newOrder || !newOrder.orderId) {
      const formData = new FormData();
      formData.append('order', new Blob([JSON.stringify({
        startDate, endDate, totalPrice, paymentOption: "PayPal", isDeleted: false, referenceNumber: '',
      })], { type: 'application/json' }));

      const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data) {
        newOrder = response.data;
        setOrder(newOrder);
      }
    }

    const transactionId = details.id;
    if (!transactionId) return;

    const paymentData = {
      orderId: newOrder.orderId, transactionId, paymentOption: "PayPal",
    };

    const paymentResponse = await axios.post(`http://localhost:8080/order/updatePaymentStatus`, paymentData, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (paymentResponse.data) {
      setShowPayPalSuccess(true);
      generateReceipt();
      setShowBookedPopup(true);
    }
  };

  const handlePayPalError = (error) => {
    setShowPayPalError(true);
  };

  const handleClosePayPalPopup = () => {
    setShowPayPalSuccess(false);
    setShowPayPalError(false);
  };

  const handleCash = async () => {
    if (order && isChecked) {
      try {
        const formData = new FormData();
        formData.append('order', new Blob([JSON.stringify({
          ...order,
          startDate, endDate, totalPrice, deliveryOption,
          deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,
        })], { type: 'application/json' }));

        const response = await axios.post(`http://localhost:8080/order/insertCashOrder?userId=${userId}&carId=${carId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data) {
          setOrder(response.data);
          setShowBookedPopup(true);
        }
      } catch (error) {
        console.error('Error submitting cash order:', error);
      }
    }
  };

  const handleCloseCash = () => {
    setBookingPopup(false);
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

  return (
    <div className="payment-popup">
      <div className="overlap-wrapperpopup">
        <div className="overlap11">
          <div className="text-wrapper">Payment</div>
          <button className="back" onClick={onBack}>
            <img className="vector" alt="Vector" src={back} />
          </button>
          <p className="pp">Scan the QR code to pay via GCASH, then upload a screenshot of the receipt.</p>
          <p className="pppp">Or</p>
          <p className="ppp">____________________________________________________</p>
          <p className="divv">by clicking, you are confirming that you have read,</p>
          <p className="understood-and-agree">
            <span className="span">understood and agree to the </span>
            <a href={TAC} target="_blank" rel="noopener noreferrer" className="text-wrapper-22">terms and conditions</a>
            <span className="span">.</span>
          </p>
          <input
            type="checkbox"
            className="rectangle11"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className="rectangle-2">
            <img src={car.carImage} alt="Car" className="car-image" />
          </div>
          <div className="text-wrapper-33">{car.carBrand} {car.carModel} {car.carYear}</div>
          <div className="overlap-groupp">
            <div className="text-wrapper-444">₱{car.rentPrice}</div>
            <div className="text-wrapper-55">{car.owner.pNum}</div>
            <img className="img" alt="Vector" src={line1} />
          </div>
          <div className="text-wrapper-61">Return Date: {endDate ? endDate.toLocaleDateString() : "N/A"}</div>
          <div className="text-wrapper-77">Total: ₱{totalPrice.toFixed(2)}</div>
          <div className="text-wrapper-8">Pick-up Date: {startDate ? startDate.toLocaleDateString() : "N/A"}</div>
          <div className="text-wrapper-9">
            {deliveryOption === "Delivery" ? `Delivery Location: ${deliveryAddress}` : `Pick-up Location: ${car.address}`}
          </div>

          <div className="overlap-2">
            <div className="group11">
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <button
                className="div-wrapper111"
                onClick={() => document.getElementById('file-upload').click()}
                style={{
                  pointerEvents: isChecked ? 'auto' : 'none',
                  opacity: isChecked ? 1 : 0.5
                }}
              >
                <div className="text-wrapper-101">Upload</div>
              </button>
            </div>
            <div className="payment-screenshot">
              {uploadedFileName || "Proof Of Payment"}
            </div>
          </div>

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

          <div className="overlap-group-wrapper">
            <button
              className="overlap-33"
              onClick={handleClick}
              disabled={!isChecked}
              style={{
                pointerEvents: isChecked ? 'auto' : 'none',
                opacity: isChecked ? 1 : 0.5
              }}
            >
              <div className="text-wrapper-11">Book</div>
            </button>

            <button
              className='cashbackground'
              onClick={handleCash}
              style={{
                pointerEvents: isChecked ? 'auto' : 'none',
                opacity: isChecked ? 1 : 0.5
              }}
            >
              <div className="text-wrapper-321">Cash</div>
            </button>

          </div>
          <button className="close" onClick={onClose}>
            <img className="vector-2" alt="Vector" src={close} />
          </button>
          <img className="image" alt="Image" src={qrcode} />
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
