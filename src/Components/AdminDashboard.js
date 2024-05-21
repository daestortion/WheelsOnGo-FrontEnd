import React from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Dropdown from "../Components/Dropdown.js";
import "../Css/AdminDashboard.css";
import admincar1 from "../Images/admincar1.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageDashboard = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleHomeClick = () => {
      navigate('/home'); // Navigate to dashboard page which is at '/home'
    };
  
    const handleCarsClick = () => {
      navigate('/cars'); // Navigate to cars page
    };
  
    const handleAboutClick = () => {
      navigate('/about-us'); // Navigate to about-us page
    };

    const handleAdminUser = () => {
      navigate('/adminusers');
    };
  
    const handleAdminCars = () => {
      navigate('/admincars');
    };
  
    const handleAdminVerify = () => {
      navigate('/adminverify');
    };

    const handleLogout = () => {
      navigate('/adminlogin');
    };

  return (
    <div className="admin-page-dashboard">
      <div className="div">
        <div className="overlap">
          <div className="rectangle" />

          <button className="group-2">
              <div className="text-wrapper-34">Orders</div>
          </button>

          <button className="group" onClick={handleAdminCars}>
              <div className="text-wrapper">Cars</div>
          </button>
          <button className="overlap-wrapper" onClick={handleAdminUser}>
              <div className="text-wrapper">Users</div>
          </button>
          <div className="overlap-group-wrapper" onClick={handleAdminVerify}>
            <button className="div-wrapper">
              <div className="text-wrapper-2">Verifications</div>
            </button>

            

          </div>
          <img className="vector" alt="Vector" src={vector} />
          <img className="image" alt="Image" src={admincar1} />
          <div className="rectangle-2" />
          <div className="text-wrapper-3">Dashboard</div>
          
        </div>
        <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
      </div>
    </div>
  );
};

export default AdminPageDashboard;