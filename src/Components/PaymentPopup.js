import React, { useState, useEffect } from 'react';
import "../Css/PaymentPopup.css";
import qrcode from "../Images/qrcode.png";
import line1 from "../Images/line11.png";
import close from "../Images/close.png";
import back from "../Images/back.png";
import BookedPopup from './BookedPopup'; // Import BookedPopup component
import TAC from "../Images/WheelsOnGoTAC.pdf";
import axios from 'axios';
import PayPal from "../Components/PayPal";

const PaymentPopup = ({ car, startDate, endDate, totalPrice, onClose, onBack, userId, carId }) => {
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);  // Store the file Blob
  const [order, setOrder] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  useEffect(() => {
    const newOrder = {
      startDate,
      endDate,
      totalPrice,
      isDeleted: false,
      referenceNumber: '',
      payment: uploadedFile ? { method: 'image', screenshot: uploadedFile } : null  // Use Blob directly
    };
    setOrder(newOrder);
  }, [startDate, endDate, totalPrice, uploadedFile]);

  console.log(order);

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
      setUploadedFile(file);  // Store the Blob directly
      setUploadedFileName(file.name);  // Set the file name
    }
  };

  const handleClick = async () => {
    if (order && isChecked) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('order', new Blob([JSON.stringify({
          startDate: order.startDate,
          endDate: order.endDate,
          totalPrice: order.totalPrice,
          isDeleted: order.isDeleted,
          referenceNumber: order.referenceNumber,
          // Do not include the file data here
        })], { type: 'application/json' }));
  
        const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log(response.data);
        if (response.data) {
          setOrder(response.data); // Update the order with the response
          setShowBookedPopup(true); // Show the booked popup
        }
      } catch (error) {
        console.error('Error submitting order:', error);
      }
    }
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
          <div className="text-wrapper-9">Pick-up Location: {car.address}</div>
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
              >
                <div className="text-wrapper-101">Upload</div>
              </button>
            </div>
            <div className="payment-screenshot">
              {uploadedFileName || "Payment Screenshot"}
            </div>
          </div>

          <PayPal totalPrice={totalPrice} /> {/* Pass totalPrice as a prop to PayPal component */}
          
          <div className="overlap-group-wrapper">
            <button
              className="overlap-33"
              onClick={handleClick}
              disabled={!isChecked} // Disable the button if the checkbox is not checked
            >
              <div className="text-wrapper-11">Book</div>
            </button>
          </div>
          <button className="close" onClick={onClose}>
            <img className="vector-2" alt="Vector" src={close} />
          </button>
          <img className="image" alt="Image" src={qrcode} />
        </div>
      </div>
      {showBookedPopup && <BookedPopup order={order} onClose={handleBookedPopupClose} />}
    </div>
  );
};

export default PaymentPopup;
