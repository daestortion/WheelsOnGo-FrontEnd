import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminUsers.css"; // Matching styling to AdminDashboard
import sidelogo from "../Images/sidelogo.png"; // Logo image
import Loading from "./Loading";

const AdminPageUsers = () => {
  const [users, setUsers] = useState([]); // Initially empty
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // Track fetch state
  const navigate = useNavigate();

  const fetchUsers = () => {
    setIsLoading(true);
    axios
      .get("https://wheelsongo-backend.onrender.com/user/getAllUsers")
      .then((response) => {
        console.log("Fetched Users:", response.data); // Log fetched users
        setUsers(response.data);
        setHasFetchedOnce(true); // Mark that data has been fetched
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Log errors
        setUsers([]); // Clear users on error
      })
      .finally(() => {
        setIsLoading(false); // Stop loading spinner
      });
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "owner") return user.cars.length > 0;
    if (filter === "regular") return user.cars.length === 0;
    return true; // 'all'
  });

  const handleDelete = (userId) => {
    setIsLoading(true);
    axios
      .put(`https://wheelsongo-backend.onrender.com/user/deleteUser/${userId}`)
      .then(() => fetchUsers())
      .catch((error) => console.error("Error deleting user:", error))
      .finally(() => setIsLoading(false));
  };

  const handleReactivate = (userId) => {
    setIsLoading(true);
    axios
      .put(`https://wheelsongo-backend.onrender.com/user/reactivateUser/${userId}`)
      .then(() => fetchUsers())
      .catch((error) => console.error("Error reactivating user:", error))
      .finally(() => setIsLoading(false));
  };

  const handleLogout = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="admin-users-page">
      {isLoading && <Loading />}

      {/* Topbar */}
      <div className="admin-dashboard-topbar">
        <img
          className="admin-dashboard-logo"
          alt="Wheels On Go Logo"
          src={sidelogo}
        />
        <button className="admin-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-sidebar">
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminusers")}
          >
            Users
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/admincars")}
          >
            Cars
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminverify")}
          >
            Verifications
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminorder")}
          >
            Transactions
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminreport")}
          >
            Reports
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/admin-payments")}
          >
            Payments
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/activitylogs")}
          >
            Activity Logs
          </button>
        </div>

        {/* Main Content */}
        <div className="admin-dashboard-content">
          <div className="fetch-data-container">
            <button className="fetch-data-btn" onClick={fetchUsers}>
              Fetch Data
            </button>
          </div>

          <h2 className="content-title">Manage Users</h2>

          {/* Filter */}
          <div className="filter-container">
            <select
              id="filter"
              value={filter}
              onChange={handleFilterChange}
              className="user-filter"
            >
              <option value="all">All Users</option>
              <option value="regular">Regular Users</option>
              <option value="owner">Car Owners</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Created</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Profile Pic</th>
                  <th>isDeleted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{new Date(user.timeStamp).toLocaleString()}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.fName}</td>
                      <td>{user.lName}</td>
                      <td>{user.pNum}</td>
                      <td>
                        {user.cars.length ? "Car Owner" : "Regular User"}
                      </td>
                      <td>
                        {user.profilePicBase64 ? (
                          <img
                            src={`data:image/jpeg;base64,${user.profilePicBase64}`}
                            alt="Profile"
                            className="profile-pic"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td>{user.deleted ? "True" : "False"}</td>
                      <td>
                        {!user.deleted ? (
                          <button
                            className="button-deactivate"
                            onClick={() => handleDelete(user.userId)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="button-deactivate"
                            onClick={() => handleReactivate(user.userId)}
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" style={{ textAlign: "center" }}>
                      {hasFetchedOnce
                        ? "No users match the current filter."
                        : "No data available. Click 'Fetch Data' to load users."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageUsers;
