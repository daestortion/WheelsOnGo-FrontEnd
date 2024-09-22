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
// Import address data
import provincesData from '../Data/refprovince.json';
import citiesData from '../Data/refcitymun.json';
import barangaysData from '../Data/refbrgy.json';

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
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBarangay, setSelectedBarangay] = useState('');
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
  const [showPriceList, setShowPriceList] = useState(false);
  const carImageInputRef = useRef(null);
  const carORInputRef = useRef(null);
  const carCRInputRef = useRef(null);
  const navigate = useNavigate();
  const [capacity, setCapacity] = useState(''); // State for seating capacity
  const [color, setColor] = useState(''); // State for color
  const [plateNumber, setPlateNumber] = useState(''); // State for plate number
  const [houseNumberStreet, setHouseNumberStreet] = useState(''); // State for house/lot number and street

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

  // Filter cities based on selected province
  const filteredCities = citiesData.RECORDS.filter(city => city.provCode === selectedProvince);

  // Filter barangays based on selected city
  const filteredBarangays = barangaysData.RECORDS.filter(barangay => barangay.citymunCode === selectedCity);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedCity('');
    setSelectedBarangay('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedBarangay('');
  };

  const handleBarangayChange = (e) => {
    setSelectedBarangay(e.target.value);
  };

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

    if (!carBrand || !carModel || !carYear || !selectedProvince || !selectedCity || !selectedBarangay || !carOR || !carCR || !rentPrice || !carImage || !carDescription || !color || !plateNumber || !capacity || !houseNumberStreet) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Find descriptions based on selected codes
    const provinceDesc = provincesData.RECORDS.find(province => province.provCode === selectedProvince)?.provDesc || '';
    const cityDesc = citiesData.RECORDS.find(city => city.citymunCode === selectedCity)?.citymunDesc || '';
    const barangayDesc = barangaysData.RECORDS.find(barangay => barangay.brgyCode === selectedBarangay)?.brgyDesc || '';

    // Construct full address with descriptions
    const fullAddress = `${houseNumberStreet}, ${barangayDesc}, ${cityDesc}, ${provinceDesc}`;
    const formData = new FormData();
    formData.append('carBrand', carBrand);
    formData.append('carModel', carModel);
    formData.append('carYear', carYear);
    formData.append('address', fullAddress); // Use the full address
    formData.append('rentPrice', parseFloat(rentPrice));
    formData.append('carDescription', carDescription);
    formData.append('color', color); // Include color in form data
    formData.append('plateNumber', plateNumber); // Include plateNumber
    formData.append('maxSeatingCapacity', parseInt(capacity)); // Include maxSeatingCapacity
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
        <div className="logo-and-links">
          <img className="sideview" alt="Sideview" src={sidelogo} />
          <div className="navigation-links">
            <div className="text-wrapper" onClick={handleHomeClick}>Home</div>
            <div className="div" onClick={handleCarsClick}>Cars</div>
            <div className="text-wrapper-2" onClick={handleAboutClick}>About</div>
          </div>
        </div>
        <Dropdown>
          <img className="group" alt="Profile" src={profile} />
        </Dropdown>
      </div>


          {/* New Form UI */}
          <div className="form-container">
            <h1 className="form-title">Car Registration</h1>
            <form onSubmit={debouncedHandleSubmit} className="form-grid">
              <div className="form-group">
                <label>Car Brand</label>
                <select value={carBrand} onChange={(e) => setCarBrand(e.target.value)}>
                  <option value="">Select Car Brand</option>
                  {Object.keys(carData).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Car Model</label>
                <select value={carModel} onChange={(e) => setCarModel(e.target.value)} disabled={!carBrand}>
                  <option value="">Select Car Model</option>
                  {carBrand && carData[carBrand].map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Car Year</label>
                <input type="text" value={carYear} onChange={(e) => setCarYear(e.target.value)} placeholder="Enter Car Year" />
              </div>

              <div className="form-group">
                <label>Car Color</label>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Enter Car Color" />
              </div>

              <div className="form-group">
                <label>Seat Capacity</label>
                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="Seat Capacity" />
              </div>

              <div className="form-group">
                <label>Rent Price</label>
                <input type="number" value={rentPrice} onChange={(e) => setRentPrice(e.target.value)} placeholder="Rent Price" />
              </div>

              <div className="form-group">
                <label>Plate Number</label>
                <input type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="Plate Number" />
              </div>

              <div className="form-group">
                <label>Province</label>
                <select value={selectedProvince} onChange={handleProvinceChange}>
                  <option value="">Select Province</option>
                  {provincesData.RECORDS.map((province) => (
                    <option key={province.provCode} value={province.provCode}>{province.provDesc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City/Municipality</label>
                <select value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince}>
                  <option value="">Select City</option>
                  {filteredCities.map((city) => (
                    <option key={city.citymunCode} value={city.citymunCode}>{city.citymunDesc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Barangay</label>
                <select value={selectedBarangay} onChange={handleBarangayChange} disabled={!selectedCity}>
                  <option value="">Select Barangay</option>
                  {filteredBarangays.map((barangay) => (
                    <option key={barangay.brgyCode} value={barangay.brgyCode}>{barangay.brgyDesc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>House/Lot no./Street</label>
                <input type="text" value={houseNumberStreet} onChange={(e) => setHouseNumberStreet(e.target.value)} placeholder="House/Lot no./Street" />
              </div>

              <div className="form-group">
                <label>Car Description</label>
                <textarea value={carDescription} onChange={(e) => setCarDescription(e.target.value)} placeholder="Enter Car Description"></textarea>
              </div>

              <div className="form-group file-upload">
                <label>Car OR</label>
                <input type="file" ref={carORInputRef} onChange={(e) => handleFileChange(e.target.files[0], setCarOR, setCarORFileName)} />
              </div>

              <div className="form-group file-upload">
                <label>Car CR</label>
                <input type="file" ref={carCRInputRef} onChange={(e) => handleFileChange(e.target.files[0], setCarCR, setCarCRFileName)} />
              </div>

              <div className="form-group file-upload">
                <label>Car Image</label>
                <input type="file" ref={carImageInputRef} onChange={(e) => handleFileChange(e.target.files[0], setCarImage)} />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                Register Car
              </button>
            </form>

            {showAddCarPopup && <AddCarPopup />}
          </div>

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
