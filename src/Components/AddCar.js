import axios from "axios";
import { debounce } from 'lodash';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AddCar.css";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import AddCarPopup from './AddCarPopup';
import Dropdown from "./Dropdown";
import WheelsOnGoPriceList from '../Images/WheelsOnGoPriceList.png';


const carData = {
  Toyota: [
    'Vios', 'Hilux', 'Fortuner', 'Innova', 'Wigo', 'Avanza', 'Rush', 'Hiace', 'Camry', 'Corolla Altis', 'Land Cruiser', 'Prado', 'RAV4', 'Yaris', 'Alphard'
  ],
  Honda: [
    'City', 'Civic', 'CR-V', 'Jazz', 'BR-V', 'Mobilio', 'HR-V', 'Brio', 'Accord', 'Odyssey'
  ],
  Mitsubishi: [
    'Mirage', 'Mirage G4', 'Xpander', 'Montero Sport', 'Strada', 'Pajero', 'L300', 'Outlander PHEV'
  ],
  Nissan: [
    'Navara', 'Terra', 'Almera', 'Patrol', 'Juke', 'X-Trail', 'Urvan', 'GT-R', 'Leaf'
  ],
  Hyundai: [
    'Accent', 'Tucson', 'Kona', 'H-100', 'Santa Fe', 'Starex', 'Elantra', 'Reina', 'Palisade', 'Creta'
  ],
  Ford: [
    'Ranger', 'Everest', 'EcoSport', 'Territory', 'Explorer', 'Mustang', 'Expedition', 'Transit'
  ],
  Mazda: [
    '3', '2', 'CX-5', 'CX-3', 'CX-9', 'MX-5', '6'
  ],
  Suzuki: [
    'Ertiga', 'Vitara', 'Celerio', 'Swift', 'Dzire', 'Jimny', 'S-Presso', 'APV'
  ],
  Kia: [
    'Picanto', 'Soluto', 'Seltos', 'Sportage', 'Stonic', 'Sorento', 'Carnival'
  ],
  Chevrolet: [
    'Trailblazer', 'Colorado', 'Spark', 'Tracker', 'Malibu', 'Suburban', 'Camaro'
  ],
  Subaru: [
    'Forester', 'XV', 'Outback', 'WRX', 'Levorg', 'BRZ'
  ],
  Isuzu: [
    'D-Max', 'mu-X', 'Traviz', 'Crosswind'
  ],
  'Other Brands': [
    'Volkswagen Santana', 'Volkswagen Lavida', 'Volkswagen Lamando', 'Volkswagen Tiguan', 'Volkswagen Touareg'
  ]
};


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
  const [carORFileName, setCarORFileName] = useState('');
  const [carCRFileName, setCarCRFileName] = useState('');
  const [carImageURL, setCarImageURL] = useState('');
  const [carDescription, setCarDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddCarPopup, setShowAddCarPopup] = useState(false);
  const [showPriceList, setShowPriceList] = useState(false); // New state for pricelist popup
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
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userId) {
      setUserId(user.userId);
    }
  }, []);

  const handleFileChange = (file, setter, setFileName) => {
    setter(file);
    if (setFileName) {
      setFileName(file.name);
    }
    if (setter === setCarImage) {
      setCarImageURL(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

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
    formData.append('carDescription', carDescription);
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
      setShowAddCarPopup(true);
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
              <select
                className="div-wrapper"
                value={carBrand}
                onChange={(e) => setCarBrand(e.target.value)}
              >
                <option value="">Car Brand</option>
                {Object.keys(carData).map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div className="group-22">
              <select
                className="div-wrapper1"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                disabled={!carBrand}
              >
                <option value="">Car Model</option>
                {carBrand && carData[carBrand].map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
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
            <div className="rectangle12" style={{ backgroundImage: `url(${carImageURL})`, backgroundSize: 'cover', position: 'absolute'}} />
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
            {/* Add View Pricelist hyperlink */}
            <a href="#" className="view-pricelist-link" onClick={(e) => { e.preventDefault(); setShowPriceList(true); }}>
              View Pricelist
            </a>
          </div>
          {showAddCarPopup && <AddCarPopup />}
          {/* Pricelist Popup */}
          {showPriceList && (
            <div className="pricelist-popup" onClick={() => setShowPriceList(false)}>
              <img src={WheelsOnGoPriceList} alt="Pricelist" className="pricelist-image" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCar;