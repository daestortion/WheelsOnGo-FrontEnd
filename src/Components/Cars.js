import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Css/Cars.css";
import sidelogo from "../Images/sidelogo.png";
import profile from "../Images/profile.png";
import design from "../Images/design.png";
import Dropdown from "../Components/Dropdown.js";
import CheckoutPopup from "../Components/CheckoutPopup.js";
import Loading from "../Components/Loading.js";
import VerifyFirstPopup from './VerifyFirstPopup.js';
import RentOwnPopup from './RentOwnPopup.js';

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyFirst, setShowVerifyFirst] = useState(false);
  const [showRentOwnPopup, setShowRentOwnPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/car/getAllCars');
        // Filter out cars that are deleted or have an order status of 1
        const activeCars = response.data.filter(car => !car.deleted && car.orders.every(order => order.status !== 1));
        setCars(activeCars.map(car => ({
          ...car,
          carImage: car.carImage ? `data:image/jpeg;base64,${car.carImage}` : null
        })));
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setIsLoading(false);
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
      if (car.owner.userId === user.userId) {
        setShowRentOwnPopup(true);
        
      } else {
        setSelectedCar(car);
      }
    } else {
      setShowVerifyFirst(true);
    }
  };

  return (
    <div className="cars">
      {isLoading && <Loading />}
      <div className="div">
        <div className="overlap">
          <img className="vector" alt="Vector" src={design} />
          <div className="frame">
            <div className="cars-grid">
              {cars.length > 0 ? cars.map((car, index) => (
                <div key={index} className="overlap-group">
                  {car.carImage && (
                    <img src={car.carImage} alt="Car" className="car-image" />
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
      {showVerifyFirst && <VerifyFirstPopup />}
      {showRentOwnPopup && <RentOwnPopup />}
    </div>
  );
};

export default Cars;
