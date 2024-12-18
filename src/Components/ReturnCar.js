import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'; // Use useParams to get orderId from URL
import axios from "axios";
import Header from "../Components/Header";
import Loading from "../Components/Loading.js";
import "../Css/ReturnCar.css";
import ReturnSuccessPopup from './ReturnSuccessPopup';
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary
import moment from 'moment-timezone'; // Import moment-timezone

export const ReturnCar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [proofURL, setproofURL] = useState('');
    const [proof, setProof] = useState(null);
    const [remarks, setRemarks] = useState('');
    const { orderId } = useParams(); // Get orderId from URL params
    const [showReturnSuccessPopup, setShowReturnSuccessPopup] = useState(false);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/order/getOrderById/${orderId}`);
                if (response.status === 200) {
                    setOrderDetails(response.data); // Set the fetched order details
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) { // Only fetch if orderId is defined
            fetchOrderDetails();
        }
    }, [orderId]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProof(file);
            setproofURL(URL.createObjectURL(file));
        }
    };

    const handleClickUpload = () => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleReturnCar = async () => {
        if (!proof || !remarks) {
            alert("Please upload proof of return and provide remarks.");
            return;
        }

        // Get the current date and convert it to Manila timezone for returnDate
        const returnDate = moment().tz('Asia/Manila').format('YYYY-MM-DD'); // Get the current date in Manila timezone

        setIsLoading(true);
        const formData = new FormData();
        formData.append("proof", proof);
        formData.append("remarks", remarks);
        formData.append("returnDate", returnDate); // Use the Manila date as returnDate
        formData.append("orderId", orderId);

        try {
            const response = await axios.post(`${BASE_URL}/returnProof/createReturnProof`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                console.log("Car return processed successfully.");
                setShowReturnSuccessPopup(true);
            }
        } catch (error) {
            console.error("Error returning car:", error);
            console.log("An error occurred while processing the return.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="return-car">
            <Header />
            <div className="overlap-wrapper">
                <div className="wew1">
                    <div className="text-wrapper-6wq">Return Car</div>

                    {(proofURL || !proofURL) && (
                        <div
                            className="proofOfReturn"
                            style={{
                                backgroundImage: proofURL
                                    ? `url(${proofURL})`
                                    : `url('path/to/default/background/image.jpg')`, // Replace with your default background image path
                                backgroundColor: proofURL ? 'transparent' : '#d7d1d1' // Set background color when no image is uploaded
                            }}
                        >
                            {!proofURL && (
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <p>Proof of Return <br />                    
                                    (You, owner, rented car)</p>
                                </div>
                            )}
                        </div>
                    )}

                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <button className="upload" onClick={handleClickUpload}>
                        Upload
                    </button>
                </div>

                <div className="overlap-22s">
                    <div className="order-carImage">
                        {/* Display the car image correctly */}
                        {orderDetails?.car?.carImage && (
                            <img
                                src={orderDetails.car.carImage.startsWith("data:") 
                                    ? orderDetails.car.carImage // If already in base64 format
                                    : `data:image/jpeg;base64,${orderDetails.car.carImage}`} // Else assume it's base64 without prefix
                                alt="Car"
                                className="car-image"
                            />
                        )}
                    </div>

                    {/* Display carBrand and carModel inside the <h1> */}
                    <h1 className="rented-car">
                        {orderDetails ? `${orderDetails.car.carBrand} ${orderDetails.car.carModel}` : "Loading car details..."}
                    </h1>

                    <div className='order-deets'>
                        {/* Access properties within orderDetails */}
                        <div className="ref-id">Reference No: {orderDetails?.referenceNumber || "N/A"}</div>
                        <div className="end-date">
                            End Date: {orderDetails?.endDate
                                ? moment(orderDetails.endDate).tz('Asia/Manila').format('YYYY-MM-DD') // Convert to Manila time
                                : "N/A"
                            }
                        </div>
                    </div>

                    <input className="assessment" type="text" placeholder="Remarks" onChange={(e) => setRemarks(e.target.value)} />

                    <button className="button-return" onClick={handleReturnCar}>
                        Return Car
                    </button>
                </div>
            </div>

            {isLoading && <Loading />}
            {showReturnSuccessPopup && <ReturnSuccessPopup />}
        </div>
    );
};

export default ReturnCar;
