import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import "../Css/AdminCars.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [searchQuery, setSearchQuery] = useState(''); // To store the search on submit

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('http://localhost:8080/car/getAllCars');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCars(data); // Include all cars, both active and inactive
      } else {
        console.error('API response is not an array:', data);
        setCars([]);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
    }
  };

  const handleAdminUsers = () => {
    navigate('/adminusers');
  };

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleAdminVerify = () => {
    navigate('/adminverify');
  };

  const handleAdminOrder = () => {
    navigate('/adminorder');
  };

  const handleReport = () => {
    navigate('/adminreport');
  };

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  const handleShowImage = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleApprove = async (carId) => {
    try {
      await fetch(`http://localhost:8080/car/approveCar/${carId}`, {
        method: 'PUT',
      });
      fetchCars(); // Refresh the cars list after approving
    } catch (error) {
      console.error('Error approving car:', error);
    }
  };

  const handleDeleteCar = async (carId) => {
    try {
        const response = await axios.put(`http://localhost:8080/car/deleteCar/${carId}`);
        if (response.status === 200) {
            console.log(response.data);
            fetchCars(); // Update the car list after deletion
        } else {
            console.error('Error deleting car:', response.status);
        }
    } catch (error) {
        console.error('Error deleting car:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm); // Set search query to the value in the search bar
  };
  
  const filteredCars = cars.filter(car => {
    switch (filter) {
      case 'all':
        return true; // Include all cars
      case 'approved':
        return car.approved === true; // Only include approved cars
      case 'active':
        return car.deleted === false; // Only include active cars (not deleted)
      default:
        return true; // Safe fallback, includes all cars
    }
  })
  .filter(car => {
    // Search logic based on search query
    const userName = car.owner ? `${car.owner.fName} ${car.owner.lName}` : ''; // Get owner's full name
    const carBrand = car.carBrand ? car.carBrand : ''; // Get car brand
    const carModel = car.carModel ? car.carModel : ''; // Get car model
    const searchString = searchQuery.toLowerCase(); // Convert search query to lowercase for case-insensitive search

    return (
      userName.toLowerCase().includes(searchString) || // Check if owner's name matches search query
      carBrand.toLowerCase().includes(searchString) || // Check if car brand matches search query
      carModel.toLowerCase().includes(searchString)    // Check if car model matches search query
    );
  });

  return (
    <div className="admin-page-cars">
      <div className="overlap-wrapper">
        <div className="overlap">
          <img className="img" alt="Rectangle" src={adminbg} />
          <div className="manage-cars">Manage&nbsp;&nbsp;Cars</div>
          <div className="div">
          <div className="search-container">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button onClick={handleSearch} className="submit-button">
                Submit
              </button>
          </div>
          <select onChange={handleFilterChange} value={filter} className="user-filter-dropdown">
                <option value="all">All Cars</option>
                <option value="approved">Approved Cars</option>
                <option value="active">Active Cars</option>
          </select>
            <table className="car-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Car Brand</th>
                  <th>Car Model</th>
                  <th>Car OR</th>
                  <th>Car CR</th>
                  <th>Car Image</th>
                  <th>Price</th>
                  <th>Approved</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cars) && cars.map(car => (
                  <tr key={car.carId}>
                    <td>{car.owner ? `${car.owner.fName} ${car.owner.lName}` : 'No owner'}</td>
                    <td>{car.carBrand}</td>
                    <td>{car.carModel}</td>
                    <td>
                      <button onClick={() => handleShowImage(car.carOR)}>Show Image</button>
                    </td>
                    <td>
                      <button onClick={() => handleShowImage(car.carCR)}>Show Image</button>
                    </td>
                    <td>
                      <button onClick={() => handleShowImage(car.carImage)}>Show Image</button>
                    </td>
                    <td>{car.rentPrice}</td>
                    <td>{car.approved ? 'Yes' : 'No'}</td>
                    <td>{car.deleted ? 'Inactive' : 'Active'}</td>
                    <td>
                    <button className="button-approve" onClick={() => handleApprove(car.carId)}>Approve</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteCar(car.carId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rectangle-2" />
          <div className="rectangle-3" />
          <div className="text-wrapper-44">Dashboard</div>
          <img className="sideview" alt="Sideview" src={sidelogo} />
          <div className="overlap-group-wrapper" onClick={handleAdminCars}>
            <div className="overlap-group">
              <div className="text-wrapper-55">Cars</div>
            </div>
          </div>
          <button className="div-wrapper" onClick={handleAdminUsers}>
            <div className="text-wrapper-55">Users</div>
          </button>
          <img className="vector" alt="Vector" src={vector} />
          <button className="group-2" onClick={handleAdminVerify}>
            <div className="text-wrapper-66">Verifications</div>
          </button>

          <button className="group-222" onClick={handleAdminOrder}>
            <div className="text-wrapper-34">Transactions</div>
          </button>

          <button className="group-2123" onClick={handleReport}>
            <div className="text-wrapper-34">Reports</div>
          </button>

          <div className="table-container"></div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      {selectedImage && (
  <Modal
    isOpen={true}
    onRequestClose={handleCloseModal}
    contentLabel="Image Modal"
    className="image-modal"
    overlayClassName="image-modal-overlay"
  >
    <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Car Document" />
    <button onClick={handleCloseModal} className="close-button">Close</button>
  </Modal>
)}
</div>

  );
};

export default AdminPageCars;
