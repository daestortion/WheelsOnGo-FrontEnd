import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Css/AdminSendFunds.css"; // Matching styling to AdminDashboard
import sidelogo from "../Images/sidelogo.png"; // Logo image
import Loading from './Loading';

const AdminSendFunds = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [requestDetails, setRequestDetails] = useState(null); // State to store fetched request details
  const { requestId } = useParams(); // Get requestId from the URL params
  const navigate = useNavigate(); // Navigation handler

  // Function to fetch request details
  const fetchRequestDetails = async () => {
    setIsLoading(true); // Start loading indicator
    try {
      // Fetch the request details from your API
      const response = await axios.get(`http://localhost:8080/request-form/getRequestById/${requestId}`);
      setRequestDetails(response.data); // Store the request details in state
    } catch (err) {
      console.error("Error fetching request details:", err); // Log any errors
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  // UseEffect to call the fetch function on component mount or when requestId changes
  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]); // Runs whenever requestId changes

  // Logout handler
  const handleLogout = () => {
    navigate('/adminlogin');
  };

  return (
    <div className="admin-users-page">
      {/* Show loading spinner during the fetch */}
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
            {requestDetails ? (
              <>
                {/* Profile Picture */}
                <div className="request-profilePicture">
                  {requestDetails?.user?.profilePic && (
                    <img
                      src={
                        requestDetails.user.profilePic.startsWith("data:")
                          ? requestDetails.user.profilePic // If already in base64 format
                          : `data:image/jpeg;base64,${requestDetails.user.profilePic}` // Else assume it's base64 without prefix
                      }
                      alt="picture"
                      className="user-image"
                    />
                  )}
                </div>

                {/* User Details */}
                <div className="request-userdeets">
                  {`${requestDetails.user.fName} ${requestDetails.user.lName}`}
                  {requestDetails.user.pNum}
                </div>

                {/* Request Details */}
                <div className="request-deets">
                  <p><strong>Total Funds:</strong> {requestDetails.user.ownerWallet.onlineEarning?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p><strong>Requested Amount:</strong> ₱{requestDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p><strong>Request Type:</strong> {requestDetails.requestType}</p>
                </div>

                {/* Request Type Options */}
                <div className="request-type-options">
                  <button>Paymongo</button>
                  <button>Paypal</button>
                </div>

                {/* Terms and Conditions */}
                <div className="t-a-c">
                  <p>Terms and Conditions</p>
                </div>
              </>
            ) : (
              !isLoading && <p>No request details available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSendFunds;