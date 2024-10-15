import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Css/Cars.css";
import CheckoutPopup from "../Components/CheckoutPopup.js";
import Loading from "../Components/Loading.js";
import VerifyFirstPopup from './VerifyFirstPopup.js';
import RentOwnPopup from './RentOwnPopup.js';
import { PendingRent } from './PendingPopup.js';
import provincesData from '../Data/refprovince.json';
import citiesData from '../Data/refcitymun.json';
import barangaysData from '../Data/refbrgy.json';
import Header from "../Components/Header";

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyFirst, setShowVerifyFirst] = useState(false);
  const [showRentOwnPopup, setShowRentOwnPopup] = useState(false);
  const [showPendingRentPopup, setShowPendingRentPopup] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Fetch data on load
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/car/getAllCars');
        const approvedCars = response.data.filter(car => car.approved && !car.deleted);
        
        console.log("Fetched Cars:", approvedCars); // Log fetched cars

        setCars(approvedCars.map(car => ({
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

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      axios.get(`http://localhost:8080/user/getUserById/${userId}`).then((response) => {
        if (response.status === 200) {
          console.log("User Renting Status:", response.data.renting); // Log user renting status
          setIsRenting(response.data.renting);
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(storedUser), isRenting: response.data.renting }));
        } else {
          navigate('/login');
        }
      }).catch((error) => {
        console.error("Error fetching user data:", error); // Log errors
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Map province, city, barangay codes to descriptions
  const getProvinceDesc = (provCode) => {
    const province = provincesData.RECORDS.find(prov => prov.provCode === provCode)?.provDesc || '';
    return province;
  };

  const getCityDesc = (cityCode) => {
    const city = citiesData.RECORDS.find(city => city.citymunCode === cityCode)?.citymunDesc || '';
    return city;
  };

  const getBarangayDesc = (barangayCode) => {
    const barangay = barangaysData.RECORDS.find(brgy => brgy.brgyCode === barangayCode)?.brgyDesc || '';
    return barangay;
  };

  // Handle search execution
  const handleSearch = () => {
    setSearchQuery(searchTerm.toLowerCase());
  };

  // Filter cars based on the search query
  const filteredCars = cars
    .sort((a, b) => {
      switch (filter) {
        case 'lowest':
          return a.rentPrice - b.rentPrice;
        case 'highest':
          return b.rentPrice - a.rentPrice;
        case 'capacity':
          return b.maxSeatingCapacity - a.maxSeatingCapacity;
        default:
          return 0;
      }
    })
    .filter(car => {
      const searchString = searchQuery.toLowerCase();
      const carBrand = car.carBrand?.toLowerCase() || '';
      const carModel = car.carModel?.toLowerCase() || '';
      const address = car.address?.toLowerCase() || '';

      return (
        carBrand.includes(searchString) ||
        carModel.includes(searchString) ||
        address.includes(searchString)
      );
    });

  const handleRentClick = (car) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      // Check if the user is the owner of the car
      if (car.owner.userId === storedUser.userId) {
        setShowRentOwnPopup(true);
        return;
      }

      // Check if the user is verified
      if (storedUser.verificationStatus !== 1) {
        setShowVerifyFirst(true);
        return;
      }

      // If the user is verified and not the owner, proceed to rent the car
      setSelectedCar(car);
    } else {
      // If no user is found, navigate to login
      navigate('/login');
    }
  };

  return (
    <div className="cars">
      {isLoading && <Loading />}
      <Header />

      <div className="div">

      <div className="filter-container2121">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <select onChange={e => setFilter(e.target.value)} value={filter} className="user-filter">
                <option value="all">All Cars</option>
                <option value="lowest">Lowest Price</option>
                <option value="highest">Highest Price</option>
                <option value="capacity">Seat Capacity</option>
              </select>
              <button onClick={handleSearch} className="submit-button">Search</button>
            </div>

          <div className="frame">
            <div className="cars-grid">
              {filteredCars.length > 0 ? filteredCars.map((car, index) => (
                <div key={index}>
                  <div className="overlap-group">
                    {car.carImage && (
                      <img src={car.carImage} alt="Car" className="car-image" />
                    )}
                      <button className="div-wrapper" onClick={() => handleRentClick(car)}>
                        Rent
                      </button>
                  </div>
                  <div className="car-info-outside">
                    <div className="car-details">
                      {car.carBrand} {car.carModel} ({car.carYear})
                    </div>
                    <div className="car-price">
                      ₱{car.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / day
                    </div>
                  </div>
                </div>
              )) :
              <p className="unavailable">No cars available for rent.</p>}
            </div>
          </div>
      </div>

      {selectedCar && <CheckoutPopup car={selectedCar} closePopup={() => setSelectedCar(null)} />}
      {showVerifyFirst && <VerifyFirstPopup />}
      {showRentOwnPopup && <RentOwnPopup />}
      {showPendingRentPopup && <PendingRent closePopup={() => setShowPendingRentPopup(false)} />}
    </div>
  );
};

export default Cars;
