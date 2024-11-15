import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminSendFunds.css"; // Matching styling to AdminDashboard
import sidelogo from "../Images/sidelogo.png"; // Logo image
import Loading from './Loading';

const AdminSendFunds = () => {
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  return (
    <div className="admin-users-page">
      {/* Show loading spinner only during the first fetch */}
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
          <h2 className="content-title">Send Funds</h2>

          {/* Container */}
          <div className="send-funds">
            <div className="request-profilePicture">
                Profile Picture
            </div>

            <div className="request-userdeets">
                Name of User
                Contact Number
            </div>

            <div className="request-deets">
                <div className="total-funds">Total Funds: </div>
                <div className="requested-amount">Requested Amount: </div>
                <div className="request-type">Request Type: </div>                
            </div>

            <div className="request-type-options">
                Paymongo
                Paypal
            </div>

            <div className="t-a-c">
                Terms and Conditions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSendFunds;
