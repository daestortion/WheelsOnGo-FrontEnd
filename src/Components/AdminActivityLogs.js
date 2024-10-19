import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminActivityLogs.css"; // Matching styling to AdminDashboard
import sidelogo from "../Images/sidelogo.png"; // Logo image
import Loading from './Loading';

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]); // State to hold logs
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  useEffect(() => {
    // Set loading to true before the fetch
    setIsLoading(true);

    axios.get('https://tender-curiosity-production.up.railway.app/activity/logs')
      .then(response => {
        console.log("Fetched logs: ", response.data); // Debug: Check if logs are fetched

        // Sort logs to show the newest first by reversing the array
        const sortedLogs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sortedLogs); // Set sorted logs data
      })
      .catch(error => {
        console.error("Error fetching activity logs", error);
      })
      .finally(() => {
        // Set loading to false after the fetch is complete (either success or failure)
        setIsLoading(false);
      });
}, []);


  // Function to format timestamp to 12-hour format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-users-page">
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
          <h2 className="content-title">Activity Logs</h2>

          {/* Activity Logs */}
          <div className="activity-logs-container">
            {logs.length > 0 ? (
              <ul>
                {logs.map((log) => (
                  <li key={log.logId}>
                    {formatTimestamp(log.timestamp)} - {log.action}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No activity logs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityLogs;
