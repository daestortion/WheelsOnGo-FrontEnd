import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import "../Css/UpdateCar.css";
import CarUpdated from "./CarUpdated.js";
import Header from "./Header.js";

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
        const response = await axios.get(`https://tender-curiosity-production.up.railway.app/car/getCarById/${carId}`);
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
        const updatedCarDetails = {
            carId: carId,
            carDescription: carDetails.description || null,
            rentPrice: carDetails.price || 0,
            address: carDetails.location || null,
            color: carDetails.color || null,
            plateNumber: carDetails.plateNumber || null,
            maxSeatingCapacity: carDetails.maxSeatingCapacity || 0,
            carImage: carDetails.imageSrc ? carDetails.imageSrc.split(',')[1] : null // Ensure this is handled in the backend
        };

        const response = await axios.put(`https://tender-curiosity-production.up.railway.app/car/updateCar`, updatedCarDetails);
        
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
      <Header />

      <div className="div">

      <div className="group212">
        <div className="text-wrapper-9">Update Car</div>
          <div className="rectangle">
            {carDetails.imageSrc && <img src={carDetails.imageSrc} alt="Uploaded" className="rectangle12" />}
          </div>
               <input
              id="image-upload-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button className="overlap-group-212" onClick={() => document.getElementById('image-upload-input').click()}>
            Upload
            </button>


        </div>

        <div className="overlap-group">

          <div className="new-car-details">New Car Details</div>
          <span className="p">Please enter your new car details. Upon confirming, your car details will be updated.</span>

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

          <input
            id="car-upload-input"
            type="file"
            style={{ display: 'none' }}
            onChange={handleCarFileChange}
          />

          <span className="car-file-name-placeholder">{carDetails.carFileName}</span>

          <button className="overlap-333" onClick={() => document.getElementById('car-upload-input').click()}>
            Upload
          </button>

          

          </div>



              <button className="overlap-55" onClick={handleUpdateCar}>
              Update Car
              </button>

          
        </div>

      </div>
      {showCarUpdatedPopup && <CarUpdated />}
    </div>
  );
};

export default UpdateCar;
