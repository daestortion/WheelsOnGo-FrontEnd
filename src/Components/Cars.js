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
import { PendingRent } from './PendingPopup.js';
import provincesData from '../Data/refprovince.json';
import citiesData from '../Data/refcitymun.json';
import barangaysData from '../Data/refbrgy.json';

export const Cars = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyFirst, setShowVerifyFirst] = useState(false);
  const [showRentOwnPopup, setShowRentOwnPopup] = useState(false);
  const [showPendingRentPopup, setShowPendingRentPopup] = useState(false);
  const [isRenting, setIsRenting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Updated when user clicks "Search"
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/car/getAllCars');
        const approvedCars = response.data.filter(car => car.approved && !car.deleted);
        
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
    
    // Fetch user renting status
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      axios.get(`http://localhost:8080/user/getUserById/${userId}`).then((response) => {
        if (response.status === 200) {
          setIsRenting(response.data.renting);
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(storedUser), isRenting: response.data.renting }));
        } else {
          navigate('/login');
        }
      }).catch(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Map province, city, barangay codes to descriptions
  const getProvinceDesc = (provCode) => {
    return provincesData.RECORDS.find(prov => prov.provCode === provCode)?.provDesc || '';
  };

  const getCityDesc = (cityCode) => {
    return citiesData.RECORDS.find(city => city.citymunCode === cityCode)?.citymunDesc || '';
  };

  const getBarangayDesc = (barangayCode) => {
    return barangaysData.RECORDS.find(brgy => brgy.brgyCode === barangayCode)?.brgyDesc || '';
  };

  // Handle search execution
  const handleSearch = () => {
    setSearchQuery(searchTerm.toLowerCase()); // Set the search query to lowercase for case-insensitive search
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
      // Case-insensitive search string
      const searchString = searchQuery.toLowerCase();

      // Extract car attributes
      const carBrand = car.carBrand?.toLowerCase() || '';
      const carModel = car.carModel?.toLowerCase() || '';

      // Get province, city, and barangay descriptions
      const province = getProvinceDesc(car.province).toLowerCase();
      const city = getCityDesc(car.city).toLowerCase();
      const barangay = getBarangayDesc(car.barangay).toLowerCase();

      // Match search string with car attributes and location data
      return (
        carBrand.includes(searchString) ||
        carModel.includes(searchString) ||
        province.includes(searchString) ||
        city.includes(searchString) ||
        barangay.includes(searchString)
      );
    });

  return (
    <div className="cars">
      {isLoading && <Loading />}
      <div className="div">
        <div className="overlap">
          <img className="vector" alt="Vector" src={design} />
          <div className="frame">
            <div className="filter-container">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} // Capture user input
                className="search-bar"
              />
              <button onClick={handleSearch} className="submit-button">Search</button>
              <select onChange={e => setFilter(e.target.value)} value={filter} className="user-filter">
                <option value="all">All Cars</option>
                <option value="lowest">Lowest Price</option>
                <option value="highest">Highest Price</option>
                <option value="capacity">Seat Capacity</option>
              </select>
            </div>
            <div className="cars-grid">
              {filteredCars.length > 0 ? filteredCars.map((car, index) => (
                <div key={index}>
                  <div className="overlap-group">
                    {car.carImage && (
                      <img src={car.carImage} alt="Car" className="car-image" />
                    )}
                    <div className="overlap-group-wrapper">
                      <button className="div-wrapper" onClick={() => setSelectedCar(car)}>
                        <div className="text-wrapper">Rent</div>
                      </button>
                    </div>
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
        <Dropdown>
          <img className="group-4" alt="Group" src={profile} />
        </Dropdown>
        <div className="text-wrapper-2" onClick={() => navigate('/home')}>Home</div>
        <div className="text-wrapper-3" onClick={() => navigate('/cars')}>Cars</div>
        <div className="text-wrapper-4" onClick={() => navigate('/aboutus')}>About</div>
        <img className="sideview" alt="Sideview" onClick={() => navigate('/home')} src={sidelogo} />
      </div>

      {selectedCar && <CheckoutPopup car={selectedCar} closePopup={() => setSelectedCar(null)} />}
      {showVerifyFirst && <VerifyFirstPopup />}
      {showRentOwnPopup && <RentOwnPopup />}
      {showPendingRentPopup && <PendingRent closePopup={() => setShowPendingRentPopup(false)} />}
    </div>
  );
};

export default Cars;
