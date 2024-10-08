import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminLogin.css";
import wog from "../Images/adminlogo.png";
import vector from "../Images/adminvector.png";
import { useAdminAuth } from '../AdminAuthContext';

export const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginClick = async (e) => {
    e.preventDefault(); // Prevent form submission

    const loginData = {
      username: username,
      password: password
    };

    try {
      const response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      const responseData = await response.json();

      if (response.ok && responseData.status === "success") {
        const adminId = responseData.adminId; // Extract adminId from the response
        adminLogin(adminId); // Call adminLogin and pass adminId to store it
        localStorage.setItem('adminId', adminId); // Store the adminId in localStorage
        console.log('Stored adminId:', localStorage.getItem('adminId')); // Verify it's stored
        navigate("/adminusers");
      } else {
        alert(`Login failed: ${responseData.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="admin-login">
      <div className="overlap-wrapper">
        <form onSubmit={handleLoginClick} className="overlap">
          <div className="text-wrapper">Admin Login</div>
          <div className="username">
            <input
              className="overlap-group"
              placeholder="Username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="overlap-group-wrapper">
            <input
              className="overlap-group"
              placeholder="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button className="login-btn" type="submit">
            <div className="login-wrapper">
              <div className="login-admin">Login</div>
            </div>
          </button>
          <img className="vector" alt="Vector" src={vector} />
          <img className="wog" alt="Wog" src={wog} />
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
