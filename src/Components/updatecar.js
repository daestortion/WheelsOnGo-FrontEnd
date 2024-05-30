import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "../Css/UpdateCar.css";
import profileIcon from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import Dropdown from "./Dropdown.js";
import CarUpdated from "./CarUpdated.js";

const UpdateCar = () => {
  const navigate = useNavigate();
  const { carId } = useParams();

  const [carDetails, setCarDetails] = useState({
    description: '',
    price: '',
    location: '',
    carFileName: 'Upload Car OR',
    imageSrc: null
  });

  const [showCarUpdatedPopup, setShowCarUpdatedPopup] = useState(false);

  useEffect(() => {
    // Fetch car details based on carId
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/car/getCarById/${carId}`);
        if (response.status === 200) {
          const carData = response.data;
          setCarDetails({
            description: carData.carDescription,
            price: carData.rentPrice,
            location: carData.address,
            carFileName: 'Upload Car OR',
            imageSrc: carData.carImage ? `data:image/jpeg;base64,${carData.carImage}` : null
          });
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarDetails({ ...carDetails, [name]: value });
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleCarsClick = () => {
    navigate('/cars');
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
  };

  const handleCarFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCarDetails({ ...carDetails, carFileName: file.name });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarDetails({ ...carDetails, imageSrc: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCar = async () => {
    try {
        const response = await axios.put(`http://localhost:8080/car/updateCar`, {
            carId: carId,
            carDescription: carDetails.description,
            rentPrice: carDetails.price,
            address: carDetails.location,
            carImage: carDetails.imageSrc ? carDetails.imageSrc.split(',')[1] : null
        });
        if (response.status === 200) {
            setShowCarUpdatedPopup(true);
        } else {
            alert('Failed to update car');
        }
    } catch (error) {
        console.error('Error updating car:', error);
        alert('An error occurred. Please try again.');
    }
};

  return (
    <div className="update-car-owner">
      <div className="div">
        <div className="overlap">
          <div className="text-wrapper" onClick={handleHomeClick}>Home</div>
          <div className="text-wrapper-2" onClick={handleCarsClick}>Cars</div>
          <div className="text-wrapper-3" onClick={handleAboutClick}>About</div>
          <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
          <Dropdown>
            <button className="group">
              <img alt="Group" src={profileIcon} />
            </button>
          </Dropdown>
        </div>
        <div className="overlap-group">

          <input
            className="div-wrapper"
            type="text"
            name="description"
            placeholder="New Description"
            value={carDetails.description}
            onChange={handleInputChange}
          />

          <input
            className="div-wrapper123"
            type="text"
            name="price"
            placeholder="New Price"
            value={carDetails.price}
            onChange={handleInputChange}
          />

          <input
            className="div-wrapper12345"
            type="text"
            name="location"
            placeholder="New Location"
            value={carDetails.location}
            onChange={handleInputChange}
          />

          <div className="overlap-2">
            <div className="overlap-wrapper">
              <button className="overlap-333" onClick={() => document.getElementById('car-upload-input').click()}>
                <div className="text-wrapper-555">Upload</div>
              </button>
              <input
                id="car-upload-input"
                type="file"
                style={{ display: 'none' }}
                onChange={handleCarFileChange}
              />
            </div>
            <div className="text-wrapper-6">{carDetails.carFileName}</div>
          </div>
          <div className="group-22">
            <button className="overlap-55" onClick={handleUpdateCar}>
              <div className="text-wrapper-8">Update Car</div>
            </button>
          </div>
          <div className="new-car-details">New Car Details</div>
          <p className="p">Please enter your new car details. Upon confirming, your car details will be updated.</p>
        </div>
        <div className="text-wrapper-9">Update Car</div>
        <div className="rectangle">
          {carDetails.imageSrc && <img src={carDetails.imageSrc} alt="Uploaded" className="rectangle12" />}
        </div>
        <div className="group-3">
          <button className="overlap-group-2" onClick={() => document.getElementById('image-upload-input').click()}>
            <div className="text-wrapper-10">Upload</div>
          </button>
          <input
            id="image-upload-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>
      </div>
      {showCarUpdatedPopup && <CarUpdated />}
    </div>
  );
};

export default UpdateCar;
