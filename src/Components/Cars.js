// src/components/Cars.js
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Css/Cars.css";
import sidelogo from "../Images/sidelogo.png";
import profile from "../Images/profile.png";
import design from "../Images/design.png";
import Dropdown from "../Components/Dropdown.js";
import CheckoutPopup from "../Components/CheckoutPopup.js";
import Loading from "../Components/Loading.js"; // Import the Loading component

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading spinner
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get('https://extraordinary-abundance-production.up.railway.app/car/getAllCars');
        setCars(response.data.map(car => ({
          ...car,
          carImage: car.carImage ? `data:image/jpeg;base64,${car.carImage}` : null
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchCars();
  }, []);

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleCarsClick = () => {
    navigate('/cars');
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
  };

  const handleRentClick = (car) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.verificationStatus === 1) {
      setSelectedCar(car);
    } else {
      alert("Verify your account first");
    }
  };

  return (
    <div className="cars">
      {isLoading && <Loading />} {/* Display loading spinner when loading */}
      <div className="div">
        <div className="overlap">
          <img className="vector" alt="Vector" src={design} />
          <div className="frame">
            {cars.length > 0 ? cars.map((car, index) => (
              <div key={index} className={`overlap-group overlap-${index + 1}`}>
                {car.carImage && (
                  <img src={car.carImage} alt="Car" style={{ position: 'absolute', width: '100%', height: 'auto' }} />
                )}
                <div className="overlap-group-wrapper">
                  <div className="div-wrapper" onClick={() => handleRentClick(car)}>
                    <div className="text-wrapper">Rent</div>
                  </div>
                </div>
              </div>
            )) : 
            
            <p className="unavailable">No cars available for rent.</p>
            
            }
          </div>
        </div>
        <Dropdown>
          <img className="group-4" alt="Group" src={profile} />
        </Dropdown>
        <div className="text-wrapper-2" onClick={handleHomeClick}>Home</div>
        <div className="text-wrapper-3" onClick={handleCarsClick}>Cars</div>
        <div className="text-wrapper-4" onClick={handleAboutClick}>About</div>
        <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
      </div>

      {selectedCar && <CheckoutPopup car={selectedCar} closePopup={() => setSelectedCar(null)} />}
    </div>
  );
};

export default Cars;
