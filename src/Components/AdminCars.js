import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import "../Css/AdminCars.css";
import sidelogo from "../Images/sidelogo.png";
import Loading from './Loading';
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const AdminPageCars = () => {
  const [cars, setCars] = useState([]); // Initially empty
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // Track if data was fetched
  const navigate = useNavigate();

  const fetchCars = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get('${BASE_URL}/car/getAllCars');
      setCars(response.data);
      setHasFetchedOnce(true); // Mark data as fetched
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]); // Clear cars on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (carId) => {
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/car/approveCar/${carId}`);
      fetchCars();
    } catch (error) {
      console.error('Error approving car:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    setIsLoading(true);
    try {
      await axios.put(`${BASE_URL}/car/deleteCar/${carId}`);
      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const filteredCars = cars
    .filter(car => {
      switch (filter) {
        case 'approved':
          return car.approved === true;
        case 'active':
          return car.deleted === false;
        default:
          return true;
      }
    })
    .filter(car => {
      const searchString = searchQuery.toLowerCase();
      const userName = car.owner ? `${car.owner.fName} ${car.owner.lName}` : '';
      const carBrand = car.carBrand || '';
      const carModel = car.carModel || '';

      return (
        userName.toLowerCase().includes(searchString) ||
        carBrand.toLowerCase().includes(searchString) ||
        carModel.toLowerCase().includes(searchString)
      );
    });

  const handleShowImage = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  return (
    <div className="admin-cars-page">
      {isLoading && <Loading />}
      {/* Topbar */}
      <div className="admin-dashboard-topbar">
        <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-sidebar">
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/admin-dashboard')}>Dashboard</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminusers')}>Users</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/admincars')}>Cars</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminverify')}>Verifications</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminorder')}>Transactions</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminreport')}>Reports</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admin-payments")}>Payments</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/activitylogs')}>Activity Logs</button>
        </div>

        {/* Main Content */}
        <div className="admin-dashboard-content">
          <div className="fetch-data-container">
            <button className="fetch-data-btn" onClick={fetchCars}>
              Fetch Data
            </button>
          </div>

          <h2 className="content-title">Manage Cars</h2>

          {/* Search and Filter */}
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button onClick={handleSearch} className="submit-button">Search</button>
            <select onChange={handleFilterChange} value={filter} className="user-filter">
              <option value="all">All Cars</option>
              <option value="approved">Approved Cars</option>
              <option value="active">Active Cars</option>
            </select>
          </div>

          {/* Cars Table */}
          <div className="cars-table-container">
            <table className="cars-table">
              <thead>
                <tr>
                  <th>Registered</th>
                  <th>Owner</th>
                  <th>Car Brand</th>
                  <th>Car Model</th>
                  <th>Car Image</th>
                  <th>Car OR</th>
                  <th>Car CR</th>
                  <th>Price</th>
                  <th>Approved</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.length > 0 ? (
                  filteredCars.map(car => (
                    <tr key={car.carId}>
                      <td>{new Date(car.timeStamp).toLocaleString()}</td>
                      <td>{car.owner ? `${car.owner.fName} ${car.owner.lName}` : 'No owner'}</td>
                      <td>{car.carBrand}</td>
                      <td>{car.carModel}</td>
                      <td>
                        <button onClick={() => handleShowImage(car.carImage)} className="button-show-image">Show Image</button>
                      </td>
                      <td>
                        <button onClick={() => handleShowImage(car.carOR)} className="button-show-image">Show Image</button>
                      </td>
                      <td>
                        <button onClick={() => handleShowImage(car.carCR)} className="button-show-image">Show Image</button>
                      </td>
                      <td>₱{car.rentPrice.toFixed(2)}</td>
                      <td>{car.approved ? 'Yes' : 'No'}</td>
                      <td>{car.deleted ? 'Inactive' : 'Active'}</td>
                      <td>
                        <button className="button-approve" onClick={() => handleApprove(car.carId)}>Approve</button>
                        <button className="button-delete" onClick={() => handleDeleteCar(car.carId)}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      {hasFetchedOnce
                        ? "No cars match the current filter."
                        : "No data available. Click 'Fetch Data' to load cars."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Modal */}
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
