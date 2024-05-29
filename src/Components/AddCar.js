import axios from "axios";
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AddCar.css";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import AddCarPopup from './AddCarPopup'; // Import AddCarPopup
import Dropdown from "./Dropdown";


export const AddCar = () => {
  const [userId, setUserId] = useState(null);
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [address, setAddress] = useState('');
  const [rentPrice, setRentPrice] = useState('');
  const [carImage, setCarImage] = useState(null);
  const [carOR, setCarOR] = useState(null);
  const [carCR, setCarCR] = useState(null);
  const [carORFileName, setCarORFileName] = useState('');  // New state variable for OR file name
  const [carCRFileName, setCarCRFileName] = useState('');  // New state variable for CR file name
  const [carImageURL, setCarImageURL] = useState(''); // State for storing the object URL
  const [carDescription, setCarDescription] = useState(''); // New state variable for car description
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddCarPopup, setShowAddCarPopup] = useState(false); // State for showing AddCarPopup
  const carImageInputRef = useRef(null);
  const carORInputRef = useRef(null);
  const carCRInputRef = useRef(null);
  const navigate = useNavigate(); 

  
  const handleHomeClick = () => {
    navigate('/home'); 
  };
  const handleCarsClick = () => {
    navigate('/cars');
  };
  const handleAboutClick = () => {
    navigate('/aboutus');
  };

  useEffect(() => {
    // Fetch the user from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userId) {
      setUserId(user.userId);
    }
  }, []);

  const handleFileChange = (file, setter, setFileName) => {
    setter(file);  // Set the file
    if (setFileName) {
      setFileName(file.name);  // Update the file name state only if setFileName function is provided
    }
    if (setter === setCarImage) {
      // If the file is for the car image, create and store the object URL
      setCarImageURL(URL.createObjectURL(file));
    }
  };
  

  const handleSubmit = async () => {
    if (isSubmitting) return;  // Prevent multiple submissions

    // Validation check
    if (!carBrand || !carModel || !carYear || !address || !carOR || !carCR || !rentPrice || !carImage || !carDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('carBrand', carBrand);
    formData.append('carModel', carModel);
    formData.append('carYear', carYear);
    formData.append('address', address);
    formData.append('rentPrice', parseFloat(rentPrice));
    formData.append('carDescription', carDescription); // Add carDescription to form data
    if (carImage) formData.append('carImage', carImage);
    if (carOR) formData.append('carOR', carOR);
    if (carCR) formData.append('carCR', carCR);

    try {
      const response = await axios.post(`http://localhost:8080/car/insertCar/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setShowAddCarPopup(true); // Show AddCarPopup on successful registration
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const debouncedHandleSubmit = debounce(handleSubmit, 300);

  if (!userId) {
    return <div>Please log in to manage cars.</div>;
  }

  return (
    <div className="car-management-owner">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper" onClick={handleHomeClick}>Home</div>
            <div className="div" onClick={handleCarsClick}>Cars</div>
            <div className="text-wrapper-2" onClick={handleAboutClick}>About</div>
            <img className="sideview" alt="Sideview" src={sidelogo} />
            <Dropdown>
              <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>
          <div className="overlap-2">
            <div className="overlap-group-wrapper">
              <input
                className="div-wrapper"
                type="text"
                placeholder="Car Brand"
                value={carBrand}
                onChange={(e) => setCarBrand(e.target.value)}
              />
            </div>
            <div className="group-22">
              <input
                className="div-wrapper1"
                type="text"
                placeholder="Car Model"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
              />
            </div>
            <div className="group-3">
              <input
                className="div-wrapper2"
                type="text"
                placeholder="Car Year"
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
              />
            </div>
            <div className="group-4">
              <input
                className="div-wrapper3"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="description-textarea">
              <textarea
                className="description-wrapper"
                placeholder="Car Description"
                value={carDescription}
                onChange={(e) => setCarDescription(e.target.value)}
              />
            </div>
            <div className="overlap-3">
              <div className="group-5">
                <div className="overlap-4">
                  <div className="text-wrapper-44">{carORFileName || 'Car OR'}</div>
                </div>
              </div>
              <div className="group-6">
                <input
                  type="file"
                  ref={carORInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileChange(e.target.files[0], setCarOR, setCarORFileName)}
                />
                <button className="overlap-5" onClick={() => carORInputRef.current.click()}>
                  <div className="text-wrapper-5">Upload</div>
                </button>
              </div>
            </div>
            <div className="overlap-6">
              <div className="group-5">
                <div className="overlap-4">
                  <div className="text-wrapper-66">{carCRFileName || 'Car CR'}</div>
                </div>
              </div>
              <div className="group-6">
                  <input
                    type="file"
                    ref={carCRInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e.target.files[0], setCarCR, setCarCRFileName)}
                  />
                <button className="overlap-5" onClick={() => carCRInputRef.current.click()}>
                  <div className="text-wrapper-5">Upload</div>
                </button>
              </div>
            </div>
            <div className="group-7">
              <input
                className="div-wrapper4"
                type="number"
                placeholder="Rent Price"
                value={rentPrice}
                onChange={(e) => setRentPrice(e.target.value)}
              />
            </div>
            <div className="group-8">
              <button
                className="overlap-7"
                onClick={debouncedHandleSubmit}
                type="button"
                disabled={isSubmitting}
              >
                <div className="text-wrapper-8">Register Car</div>
              </button>
            </div>
          </div>
          <div className="text-wrapper-9">Car Registration</div>
          {carImageURL && (
            <div className="rectangle" style={{ backgroundImage: `url(${carImageURL})`, backgroundSize: 'cover', position: 'relative'}} />
          )}
          <div className="group-9">
              <input
                type="file"
                ref={carImageInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files[0], setCarImage)}
              />
            <button className="overlap-group-2" onClick={() => carImageInputRef.current.click()}>
              <div className="text-wrapper-10">Upload Car Image</div>
            </button>
          </div>
        </div>
      </div>
      {showAddCarPopup && <AddCarPopup />} {/* Conditionally render AddCarPopup */}
    </div>
  );
};

export default AddCar;
