import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../Components/Dropdown.js";
import "../Css/AdminUsers.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import profileIcon from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'regular', 'owner'

  useEffect(() => {
    axios.get('https://extraordinary-abundance-production.up.railway.app/user/getAllUsers')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleHomeClick = () => {
    navigate('/home');
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

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  const filteredUsers = users.filter(user => {
    switch (filter) {
      case 'all':
        return true; // Include all users
      case 'regular':
        return !user.cars.length; // Only include regular users
      case 'owner':
        return user.cars.length > 0; // Only include users with cars
      default:
        return true; // Safe fallback, includes all users
    }
  });

  return (
    <div className="admin-page-users">
      <div className="div">
        <div className="overlap">
          <img className="rectangle" alt="Rectangle" src={adminbg} />
          <div className="rectangle-2" />
          <button className="group" onClick={handleAdminCars}>
            <div className="text-wrapper">Cars</div>
          </button>
          <button className="overlap-wrapper" onClick={handleAdminDashboard}>
            <div className="text-wrapper">Users</div>
          </button>
          <button className="overlap-group-wrapper" onClick={handleAdminVerify}>
            <div className="text-wrapper-2">Verifications</div>
          </button>
          <button className="group-2">
              <div className="text-wrapper">Orders</div>
          </button>
          <div className="text-wrapper-3" onClick={handleAdminDashboard}>Dashboard</div>
          <img className="vector" alt="Vector" src={vector} />
          <div className="text-wrapper-4">Manage Users</div>
          <div className="rectangle-3">
            <div className="rectangle-5">
              <select onChange={handleFilterChange} value={filter} className="user-filter-dropdown">
                  <option value="all">All Users</option>
                  <option value="regular">Regular Users</option>
                  <option value="owner">Car Owners</option>
              </select>
              <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Profile Pic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.fName}</td>
                                <td>{user.lName}</td>
                                <td>{user.pNum}</td>
                                <td>{user.cars.length ? 'Car Owner' : 'Regular User'}</td>
                                <td>
                                  {user.profilePicBase64 ?
                                    <img src={`data:image/jpeg;base64,${user.profilePicBase64}`} alt="Profile" className="profile-pic" />
                                    : 'No image'
                                  }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
      </div>
    </div>
  );
};

export default AdminPageUsers;
