import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminUsers.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'regular', 'owner'

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:8080/user/getAllUsers')
      .then(response => {
        console.log('API response:', response.data); // Log the response to check its structure
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('API response is not an array:', response.data);
          setUsers([]); // Set to an empty array to avoid filter errors
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setUsers([]); // Set to an empty array to avoid filter errors
      });
  };

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleAdminUsers = () => {
    navigate('/adminusers');
  };

  const handleAdminVerify = () => {
    navigate('/adminverify');
  };

  const handleOrder = () => {
    navigate('/adminorder'); 
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

  const handleDelete = (userId) => {
    axios.put(`http://localhost:8080/user/deleteUser/${userId}`)
      .then(response => {
        console.log(response.data);
        fetchUsers(); // Refresh the user list after deletion
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const handleReactivate = (userId) => {
    axios.put(`http://localhost:8080/user/reactivateUser/${userId}`)
      .then(response => {
        console.log(response.data);
        fetchUsers(); // Refresh the user list after reactivation
      })
      .catch(error => {
        console.error('Error reactivating user:', error);
      });
  };

  return (
    <div className="admin-page-users">
      <div className="div">
        <div className="overlap">
          <img className="rectangle" alt="Rectangle" src={adminbg} />
          <div className="rectangle-2" />
          <button className="group" onClick={handleAdminCars}>
            <div className="text-wrapper">Cars</div>
          </button>
          <button className="overlap-wrapper" onClick={handleAdminUsers}>
            <div className="text-wrapper">Users</div>
          </button>
          <button className="overlap-group-wrapper" onClick={handleAdminVerify}>
            <div className="text-wrapper-2">Verifications</div>
          </button>
          <button className="group-2" onClick={handleOrder}>
            <div className="text-wrapper">Orders</div>
          </button>
          <div className="text-wrapper-3">Dashboard</div>
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
                      <th>isDeleted</th>
                      <th>Action</th>
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
                        <td>{user.deleted ? 'True' : 'False'}</td>
<td>
  {!user.deleted ? (
    <button className="button-deactivate" onClick={() => handleDelete(user.userId)}>Deactivate</button>
  ) : (
    <button className="button-deactivate" onClick={() => handleReactivate(user.userId)}>Reactivate</button>
  )}
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
        <img className="sideview" alt="Sideview" src={sidelogo} />
      </div>
    </div>
  );
};

export default AdminPageUsers;
