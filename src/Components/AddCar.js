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
  Toyota: ['Vios', 'Hilux', 'Fortuner', 'Innova', 'Wigo', 'Avanza', 'Rush', 'Hiace', 'Camry', 'Corolla Altis', 'Land Cruiser', 'Prado', 'RAV4', 'Yaris', 'Alphard'],
  Honda: ['City', 'Civic', 'CR-V', 'Jazz', 'BR-V', 'Mobilio', 'HR-V', 'Brio', 'Accord', 'Odyssey'],
  Mitsubishi: ['Mirage', 'Mirage G4', 'Xpander', 'Montero Sport', 'Strada', 'Pajero', 'L300', 'Outlander PHEV'],
  Nissan: ['Navara', 'Terra', 'Almera', 'Patrol', 'Juke', 'X-Trail', 'Urvan', 'GT-R', 'Leaf'],
  Hyundai: ['Accent', 'Tucson', 'Kona', 'H-100', 'Santa Fe', 'Starex', 'Elantra', 'Reina', 'Palisade', 'Creta'],
  Ford: ['Ranger', 'Everest', 'EcoSport', 'Territory', 'Explorer', 'Mustang', 'Expedition', 'Transit'],
  Mazda: ['3', '2', 'CX-5', 'CX-3', 'CX-9', 'MX-5', '6'],
  Suzuki: ['Ertiga', 'Vitara', 'Celerio', 'Swift', 'Dzire', 'Jimny', 'S-Presso', 'APV'],
  Kia: ['Picanto', 'Soluto', 'Seltos', 'Sportage', 'Stonic', 'Sorento', 'Carnival'],
  Chevrolet: ['Trailblazer', 'Colorado', 'Spark', 'Tracker', 'Malibu', 'Suburban', 'Camaro'],
  Subaru: ['Forester', 'XV', 'Outback', 'WRX', 'Levorg', 'BRZ'],
  Isuzu: ['D-Max', 'mu-X', 'Traviz', 'Crosswind'],
  'Other Brands': ['Volkswagen Santana', 'Volkswagen Lavida', 'Volkswagen Lamando', 'Volkswagen Tiguan', 'Volkswagen Touareg']
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
  const [showOverlap1, setShowOverlap1] = useState(true);

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

  // Function to check if all required fields are filled
  const isFormValid = () => {
    return (
      carBrand &&
      carModel &&
      carYear &&
      carDescription &&
      carOR &&
      carCR &&
      color &&
      plateNumber &&
      capacity &&
      carImage
    );
  };

  const handleNextClick = () => {
    if (isFormValid()) {
      setShowOverlap1(false); // Hide overlap1 and show overlap2
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleBackClick = () => {
    setShowOverlap1(true); // Show overlap1 and hide overlap2
  };

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
    if (!isFormValid()) {
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
            <div className="text-wrapper" onClick={handleHomeClick}>Home</div>
            <div className="div" onClick={handleCarsClick}>Cars</div>
            <div className="text-wrapper-2" onClick={handleAboutClick}>About</div>
            <img className="sideview" alt="Sideview" src={sidelogo} />
            <Dropdown>
              <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>
  
          {showOverlap1 && (
            <div className="overlap-1">
              <div className="overlap-group-wrapper">
                <select className="div-wrapper" value={carBrand} onChange={(e) => setCarBrand(e.target.value)} required>
                  <option value="">Car Brand</option>
                  {Object.keys(carData).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="group-22">
                <select className="div-wrapper1" value={carModel} onChange={(e) => setCarModel(e.target.value)} disabled={!carBrand} required>
                  <option value="">Car Model</option>
                  {carBrand && carData[carBrand].map((model, index) => (
                    <option key={`${carBrand}-${model}-${index}`} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div className="group-3">
                <input className="div-wrapper2" type="text" placeholder="Car Year" value={carYear} onChange={(e) => setCarYear(e.target.value)} required />
              </div>
              <div className="description-textarea">
                <textarea className="description-wrapper" placeholder="Car Description" value={carDescription} onChange={(e) => setCarDescription(e.target.value)} required />
              </div>
              <div className="overlap-3">
                <div className="group-5">
                  <div className="overlap-4">
                    <div className="text-wrapper-44">{carORFileName || 'Car OR'}</div>
                  </div>
                </div>
                <div className="group-6">
                  <input type="file" ref={carORInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files[0], setCarOR, setCarORFileName)} required />
                  <button className="overlap-5" onClick={() => carORInputRef.current.click()}>
                    <div className="text-wrapper-555">Upload</div>
                  </button>
                </div>
              </div>
              <div className="overlap-6">
                <div className="group-5">
                  <div className="overlap-442">
                    <div className="text-wrapper-66">{carCRFileName || 'Car CR'}</div>
                  </div>
                  <input className="div-wrapper412" type="text" placeholder="Plate #" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
                </div>
                <div className="group-6">
                  <input type="file" ref={carCRInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files[0], setCarCR, setCarCRFileName)} required />
                  <button className="overlap-521" onClick={() => carCRInputRef.current.click()}>
                    <div className="text-wrapper-555">Upload</div>
                  </button>
                </div>
              </div>
              <input className="div-wrapper42" type="text" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} required />
              <select className="div-wrapper43" value={capacity} onChange={(e) => setCapacity(e.target.value)} required>
                <option value="">Capacity</option>
                <option value="4">4 Seat</option>
                <option value="5">5 Seat</option>
                <option value="7">7 Seat</option>
                <option value="8">8 Seat</option>
                <option value="12">12 Seat</option>
                <option value="15">15 Seat</option>
              </select>
  
              <button
                className="overlap-777"
                type="button"
                onClick={handleNextClick}
                disabled={!isFormValid()} // Disable button if the form is not valid
              >
                <div className="text-wrapper-8">Next</div>
              </button>
  
              <div className="text-wrapper-912">Step 1: Car Details</div>
            </div>
          )}
  
          {!showOverlap1 && (
            <div className="overlap-2">
              <div className="group-4">
                <select className="div-wrapper3" value={selectedProvince} onChange={handleProvinceChange} required>
                  <option value="">Province</option>
                  {provincesData.RECORDS.map((province, index) => (
                    <option key={`${province.provCode}-${index}`} value={province.provCode}>{province.provDesc}</option>
                  ))}
                </select>
              </div>
              <div className="group-4">
                <select className="div-wrapper31" value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince} required>
                  <option value="">City/Municipality</option>
                  {filteredCities.map((city, index) => (
                    <option key={`${city.citymunCode}-${index}`} value={city.citymunCode}>{city.citymunDesc}</option>
                  ))}
                </select>
              </div>
              <div className="group-4">
                <select className="div-wrapper32" value={selectedBarangay} onChange={handleBarangayChange} disabled={!selectedCity} required>
                  <option value="">Barangay</option>
                  {filteredBarangays.map((barangay, index) => (
                    <option key={`${barangay.brgyCode}-${index}`} value={barangay.brgyCode}>{barangay.brgyDesc}</option>
                  ))}
                </select>
              </div>
              <div className="group-7">
                <input className="div-wrapper41" type="text" placeholder="House/Lot no./Street" value={houseNumberStreet} onChange={(e) => setHouseNumberStreet(e.target.value)} required />
              </div>
              <div className="group-7">
                <input
                  className="div-wrapper4"
                  type="text"
                  inputMode="decimal"
                  placeholder="Price"
                  value={rentPrice} // Directly bind the value without formatting
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    // Allow only numbers and at most one decimal point
                    if (/^\d*\.?\d*$/.test(inputValue)) {
                      setRentPrice(inputValue);
                    }
                  }}
                  onBlur={() => {
                    // Format the value when input loses focus
                    if (rentPrice !== '' && !isNaN(rentPrice)) {
                      const parsedPrice = parseFloat(rentPrice).toFixed(2);
                      setRentPrice(parsedPrice);
                    }
                  }}
                  required
                />
              </div>
              <div className="group-8">
                <button className="overlap-7" onClick={debouncedHandleSubmit} type="button" disabled={isSubmitting}>
                  <div className="text-wrapper-8123">Register Car</div>
                </button>
  
                <button className="overlap-712" type="button" onClick={handleBackClick}>
                  <div className="text-wrapper-81">Back</div>
                </button>
              </div>
  
              <div className="text-wrapper-912">Step 2: Address & Pricing</div>
            </div>
          )}
  
          <div className="text-wrapper-9">Car Registration</div>
          {carImageURL && (
            <div className="rectangle12" style={{ backgroundImage: `url(${carImageURL})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'absolute'}} />
          )}
          <div className="group-9">
            <input type="file" ref={carImageInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e.target.files[0], setCarImage)} required />
            <button className="overlap-group-2" onClick={() => carImageInputRef.current.click()}>
              <div className="text-wrapper-10">Upload Car Image</div>
            </button>
            <a href="#" className="view-pricelist-link" onClick={(e) => { e.preventDefault(); setShowPriceList(true); }}>
              View Pricelist
            </a>
          </div>
          {showAddCarPopup && <AddCarPopup />}
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
