import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import "../Css/PaymentPopup.css";
import line1 from "../Images/line11.png";
import close from "../Images/close.png";
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
import back from "../Images/back.png";
import paymonggo from "../Images/paymongo.svg";
import BookedPopup from './BookedPopup';
import TAC from "../Images/WheelsOnGoTAC.pdf";
import axios from 'axios';
import PayPal from "../Components/PayPal";
import PayPalError from "../Components/PaypalError";
import PayPalSuccessful from "../Components/PaypalSuccessful";
import { CashOptionPopup } from "../Components/BookingPopup";



const PaymentPopup = ({ car, startDate, endDate, deliveryOption, deliveryAddress, totalPrice, onClose, onBack, userId, carId }) => {
  const [showBookedPopup, setShowBookedPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [order, setOrder] = useState(null);
  const [showPayPalSuccess, setShowPayPalSuccess] = useState(false);
  const [showPayPalError, setShowPayPalError] = useState(false);
  const [showBookingPopup, setBookingPopup] = useState(false);
  const [paypalPaid, setPaypalPaid] = useState(false);

  useEffect(() => {
    const paymentOption = uploadedFile ? "GCash" : "Cash";
    const newOrder = {
      startDate,
      endDate,
      totalPrice,
      paymentOption,  // Set GCash or Cash as the default option
      isDeleted: false,
      referenceNumber: '',
      payment: uploadedFile ? { method: 'image', screenshot: uploadedFile } : null
    };
    setOrder(newOrder);
  }, [startDate, endDate, totalPrice, uploadedFile]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleBookedPopupClose = () => {
    setShowBookedPopup(false);
    onClose();
  };

  // Handle GCash Payment
  const handleClick = async () => {
    if (order && isChecked) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);  // Upload screenshot if available
        formData.append('order', new Blob([JSON.stringify({
          startDate: order.startDate,
          endDate: order.endDate,
          totalPrice: order.totalPrice,
          paymentOption: "GCash",  // Explicitly set payment option as GCash
          isDeleted: order.isDeleted,
          referenceNumber: order.referenceNumber,
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

  const handleCash = async () => {
    if (order && isChecked) {
      try {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        formData.append('order', new Blob([JSON.stringify({
          ...order,
          startDate,  // Include startDate and endDate from props
          endDate,
          totalPrice,  // Include totalPrice
          deliveryOption,  // Include delivery option
          deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,  // Conditional delivery or pickup address
        })], { type: 'application/json' }));

        console.log(formData);
        // Post order to backend
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
        console.error('Error submitting cash order:', error);
      }
    }
  };

  const createPaymentLink = async () => {
    // Ensure that totalPrice is available and convert it to centavos
    const amountInCentavos = Math.round(totalPrice * 100);  // Convert to centavos (e.g. PHP 100.00 = 10000 centavos)
  
    try {
      const response = await fetch('http://localhost:8080/api/payment/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCentavos,  // Dynamically use totalPrice in centavos
          description: `Payment for renting ${car.carBrand} ${car.carModel} ${car.carYear}`,  // Add dynamic description if needed
        }),
      });
  
      const data = await response.json();
      console.log('Payment Link Response:', data);
  
      if (data && data.data && data.data.attributes && data.data.attributes.checkout_url) {
        const paymentUrl = data.data.attributes.checkout_url;
  
        // Redirect the user to PayMongo payment page
        window.open(paymentUrl, '_blank');
  
        // Once the payment is completed, insert the order with Paymongo as the payment option
        await insertOrderWithPaymongo();
      } else {
        console.error('Failed to create payment link');
      }
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  };
  
  // Function to insert the order with Paymongo as payment option
  const insertOrderWithPaymongo = async () => {
    try {
      const formData = new FormData();
      formData.append('order', new Blob([JSON.stringify({
        startDate: startDate,   // Use the prop startDate
        endDate: endDate,       // Use the prop endDate
        totalPrice: totalPrice, // Use the prop totalPrice
        paymentOption: "Paymongo",  // Set payment option to Paymongo
        isDeleted: false,
        referenceNumber: '',  // Generate reference number later
        deliveryOption,  // Include delivery option
        deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,  // Conditional delivery or pickup address
      })], { type: 'application/json' }));
  
      const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data) {
        setOrder(response.data);        // Update state with the new order
        console.log("Order created successfully with Paymongo:", response.data);
        setShowBookedPopup(true);       // Show the booked popup
      } else {
        throw new Error("Failed to create order with Paymongo.");
      }
    } catch (error) {
      console.error('Error inserting order with Paymongo:', error);
    }
  };

  

  const handlePayPalSuccess = async (details, data) => {
    try {
        setPaypalPaid(true);
        let newOrder = order;

        // If newOrder is null, create the order
        if (!newOrder || !newOrder.orderId) {
            console.log("Order object is null. Creating a new order...");
            
            const formData = new FormData();
            formData.append('order', new Blob([JSON.stringify({
                startDate: startDate,   // Use the prop startDate
                endDate: endDate,       // Use the prop endDate
                totalPrice: totalPrice, // Use the prop totalPrice
                paymentOption: "PayPal",  // Set payment option to PayPal
                isDeleted: false,
                referenceNumber: '',  // Generate reference number later
                deliveryOption,  // Include delivery option
                deliveryAddress: deliveryOption === "Delivery" ? deliveryAddress : car.address,  // Conditional delivery or pickup address
            })], { type: 'application/json' }));

            const response = await axios.post(`http://localhost:8080/order/insertOrder?userId=${userId}&carId=${carId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                newOrder = response.data;  // Save the created order with its ID
                setOrder(newOrder);        // Update state with the new order
                console.log("Order created successfully:", newOrder);
            } else {
                throw new Error("Failed to create order before PayPal success.");
            }
        }

        // Ensure that newOrder.orderId exists
        if (!newOrder || !newOrder.orderId) {
            throw new Error("OrderId is missing after order creation.");
        }

        console.log("Updating payment status for order:", newOrder.orderId);

        // Using details.id as transaction ID instead of data.transactionId
        const transactionId = details.id;  // This contains the PayPal transaction ID

        if (!transactionId) {
            console.error("PayPal transaction ID is missing.");
            return; // Exit early if transactionId is not found
        }

        // Now update the payment status
        const paymentData = {
            orderId: newOrder.orderId,  // Ensure orderId is used correctly
            transactionId: transactionId,  // PayPal transaction ID from details.id
            paymentOption: "PayPal",  // Set payment option as PayPal
        };

        const paymentResponse = await axios.post(`http://localhost:8080/order/updatePaymentStatus`, paymentData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (paymentResponse.data) {
            generateReceipt();           // Generate receipt after successful payment
            setShowBookedPopup(true);    // Show booked popup with PayPal transaction ID
            setOrder({
                ...newOrder,
                referenceNumber: transactionId  // Use the PayPal transaction ID as the reference number
            });
            console.log("Payment status updated successfully.");
        }

    } catch (error) {
        console.error("Error updating payment status:", error.message);
    }
  };

  const handlePayPalError = (error) => {
    console.error("Handling PayPal error:", error);  // Ensure error handling is logged
    setShowPayPalError(true);
  };

  const handleClosePayPalPopup = () => {
    setShowPayPalSuccess(false);
    setShowPayPalError(false);
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

  return (
    <div className="payment-popup">
      <div className="overlap-wrapperpopup">
        <div className="overlap11">
          <div className="text-wrapper">Payment</div>
          <button className="back" onClick={onBack}>
            <img className="vector" alt="Vector" src={back} />
          </button>
          <p className="pp">Choose Payment Method</p>
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
          <div className="text-wrapper-77">Total: ₱{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-wrapper-8">Pick-up Date: {startDate ? startDate.toLocaleDateString() : "N/A"}</div>
          <div className="text-wrapper-99">Pick-up Location: {car.address}</div>

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
              onClick={createPaymentLink}
              className="paymongo-button"
              disabled={!isChecked}  // Disable PayMongo button if not checked
              style={{
                pointerEvents: isChecked ? 'auto' : 'none',
                opacity: isChecked ? 1 : 0.5,
              }}
            >
              <img src={paymonggo} alt="PayMongo Logo" className="paymongo-logo" />
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

          <div className="image">
            <ImageSlider />
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