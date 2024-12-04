import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminActivityLogs.css"; // Matching styling to AdminDashboard
import sidelogo from "../Images/sidelogo.png"; // Logo image
import Loading from './Loading';
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]); // State to hold logs
  const [isLoading, setIsLoading] = useState(false); // State to show loading indicator
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // Track if the first fetch is done
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  useEffect(() => {
    // Define a function to fetch logs
    const fetchLogs = (initialFetch = false) => {
      if (initialFetch) {
        setIsLoading(true); // Only show loading on the first fetch
      }
      axios
        .get("${BASE_URL}/activity/logs")
        .then((response) => {
          console.log("Fetched logs: ", response.data); // Debug: Check if logs are fetched

          // Sort logs to show the newest first by reversing the array
          const sortedLogs = response.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setLogs(sortedLogs); // Set sorted logs data
        })
        .catch((error) => {
          console.error("Error fetching activity logs", error);
        })
        .finally(() => {
          if (initialFetch) {
            setIsLoading(false); // Stop loading after the first fetch completes
            setHasFetchedOnce(true); // Mark that we've completed the first fetch
          }
        });
    };

    // Fetch logs immediately when the component mounts (initial load)
    fetchLogs(true); // Pass true to indicate initial fetch

    // Set an interval to fetch logs every 5 seconds (5000 ms)
    const intervalId = setInterval(() => fetchLogs(false), 5000); // Pass false for subsequent fetches

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Helper functions for filtering
  const isSameDay = (logDate, today) => {
    return logDate.getFullYear() === today.getFullYear() &&
           logDate.getMonth() === today.getMonth() &&
           logDate.getDate() === today.getDate();
  };

  // Updated `isSameWeek()` to correctly calculate the week start and end
  const isSameWeek = (logDate, today) => {
    const dayOfWeek = today.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
    
    // Adjust to start the week from Monday (1 = Monday, 0 = Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // If Sunday, subtract 6, else go to Monday

    // End of the week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // 6 days after Monday is Sunday

    // Check if the log date is within the current week
    return logDate >= startOfWeek && logDate <= endOfWeek;
  };

  const isSameMonth = (logDate, today) => {
    return logDate.getFullYear() === today.getFullYear() &&
           logDate.getMonth() === today.getMonth();
  };

  // Filter logs based on the selected filter (day, week, month, or all)
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const today = new Date();

    switch (filter) {
      case 'day':
        // Filter logs that are from the same calendar day (midnight to midnight)
        return isSameDay(logDate, today);

      case 'week':
        // Filter logs that are from the current week (Monday to Sunday)
        return isSameWeek(logDate, new Date()); // Reset today to now after `setDate` in `isSameWeek`.

      case 'month':
        // Filter logs that are from the current month
        return isSameMonth(logDate, today);

      default:
        return true; // Show all logs
    }
  });

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
          <h2 className="content-title">Activity Logs</h2>

          {/* Filter */}
          <div className="filter-container">
            <select id="filter" value={filter} onChange={handleFilterChange} className="user-filter">
              <option value="all">All</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>

          {/* Activity Logs */}
          <div className="activity-logs-container">
            {filteredLogs.length > 0 ? (
              <ul>
                {filteredLogs.map((log) => (
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
