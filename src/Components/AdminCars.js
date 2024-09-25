import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import "../Css/AdminCars.css"; // Matching AdminDashboard CSS
import sidelogo from "../Images/sidelogo.png"; // Logo image

const AdminPageCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars(); // Fetch cars on component mount
  }, []);

  // Fetch all cars
  const fetchCars = async () => {
    try {
      const response = await axios.get('http://localhost:8080/car/getAllCars');
      setCars(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error); // Log error if fetch fails
    }
  };

  // Approve a car
  const handleApprove = async (carId) => {
    try {
      await axios.put(`http://localhost:8080/car/approveCar/${carId}`);
      console.log(`Approved Car ID: ${carId}`); // Log approved car ID
      fetchCars(); // Refresh the list of cars after approval
    } catch (error) {
      console.error('Error approving car:', error); // Log error if approval fails
    }
  };

  // Delete a car
  const handleDeleteCar = async (carId) => {
    try {
      await axios.put(`http://localhost:8080/car/deleteCar/${carId}`);
      console.log(`Deleted Car ID: ${carId}`); // Log deleted car ID
      fetchCars(); // Refresh the list of cars after deletion
    } catch (error) {
      console.error('Error deleting car:', error); // Log error if deletion fails
    }
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    console.log(`Filter applied: ${event.target.value}`); // Log the selected filter
  };

  // Handle search
  const handleSearch = () => {
    console.log("Search Term:", searchTerm); // Log search term
    setSearchQuery(searchTerm);
  };

  // Filtered and searched cars
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
      const carBrand = car.carBrand ? car.carBrand : '';
      const carModel = car.carModel ? car.carModel : '';

      // Log the filtering process
      const match = (
        userName.toLowerCase().includes(searchString) ||
        carBrand.toLowerCase().includes(searchString) ||
        carModel.toLowerCase().includes(searchString)
      );
      console.log(`Matching Car: ${car.carBrand} ${car.carModel} Owner: ${userName} Match: ${match}`);
      return match;
    });

  // Show car image in a modal
  const handleShowImage = (imageData) => {
    setSelectedImage(imageData);
    console.log("Showing Image Data:", imageData); // Log the image data being shown
  };

  // Close image modal
  const handleCloseModal = () => {
    setSelectedImage(null);
    console.log("Closed Image Modal"); // Log when the modal is closed
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out..."); // Log when logging out
    navigate('/adminlogin');
  };

  return (
    <div className="admin-cars-page">
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
        </div>

        {/* Main Content */}
        <div className="admin-dashboard-content">
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
                {filteredCars.map(car => (
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
                    <td>₱{car.rentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{car.approved ? 'Yes' : 'No'}</td>
                    <td>{car.deleted ? 'Inactive' : 'Active'}</td>
                    <td>
                      <button className="button-approve" onClick={() => handleApprove(car.carId)}>Approve</button>
                      <button className="button-delete" onClick={() => handleDeleteCar(car.carId)}>Delete</button>
                    </td>
                  </tr>
                ))}
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
