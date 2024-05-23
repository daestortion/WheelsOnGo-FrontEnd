import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AdminCars.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import sidelogo from "../Images/sidelogo.png";
import Modal from 'react-modal';

export const AdminPageCars = () => {
  const [cars, setCars] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('https://extraordinary-abundance-production.up.railway.app/car/getAllCars');
      const data = await response.json();
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error('API response is not an array:', data);
        setCars([]); // Set to an empty array to avoid map errors
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]); // Set to an empty array to avoid map errors
    }
  };

  const handleHomeClick = () => {
    navigate('/home');
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

  const handleAdminDashboard = () => {
    navigate('/admindashboard');
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

  return (
    <div className="admin-page-cars">
      <div className="overlap-wrapper">
        <div className="overlap">
          <img className="img" alt="Rectangle" src={adminbg} />
          <div className="manage-cars">Manage&nbsp;&nbsp;Cars</div>
          <div className="div">
            <table className="car-table">
              <thead>
                <tr>
                  <th>Car Brand</th>
                  <th>Car Model</th>
                  <th>Owner</th>
                  <th>Car OR</th>
                  <th>Car CR</th>
                  <th>Car Image</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cars) && cars.map(car => (
                  <tr key={car.carId}>
                    <td>{car.carBrand}</td>
                    <td>{car.carModel}</td>
                    <td>{car.owner ? car.owner.username : 'No owner'}</td>
                    <td>
                      <button onClick={() => handleShowImage(car.carOR)}>Show Image</button>
                    </td>
                    <td>
                      <button onClick={() => handleShowImage(car.carCR)}>Show Image</button>
                    </td>
                    <td>
                      <button onClick={() => handleShowImage(car.carImage)}>Show Image</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rectangle-2" />
          <div className="rectangle-3" />
          <div className="text-wrapper-4" onClick={handleAdminDashboard}>Dashboard</div>
          <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
          <div className="overlap-group-wrapper" onClick={handleAdminCars}>
            <div className="overlap-group">
              <div className="text-wrapper-5">Cars</div>
            </div>
          </div>
          <button className="div-wrapper" onClick={handleAdminUsers}>
            <div className="text-wrapper-5">Users</div>
          </button>
          <img className="vector" alt="Vector" src={vector} />
          <button className="group-2" onClick={handleAdminVerify}>
            <div className="text-wrapper-6">Verifications</div>
          </button>
          <button className="group-222">
            <div className="text-wrapper-34">Orders</div>
          </button>
          <div className="table-container">
          </div>
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
          <button onClick={handleCloseModal}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default AdminPageCars;
