import React, { useState } from "react";
import "../Css/AdminRegister.css";
import wog from "../Images/adminlogoBLACK.png";
import vector from "../Images/vectorBLACK.png";

export const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!isPasswordValid(password)) {
      alert("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character");
      return;
    }

    const adminData = {
      username: username,
      pWord: password
    };

    try {
      const response = await fetch("https://extraordinary-abundance-production.up.railway.app/admin/insertAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(adminData)
      });

      if (response.ok) {
        alert("Registration successful");
        // Reset the form
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="admin-registration">
      <div className="overlap-wrapper">
        <form onSubmit={handleSubmit} className="overlap">
          <div className="text-wrapper">Admin Registration</div>
          <div className="password">
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
          <div className="password-2">
            <input
              className="overlap-group"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button className="register-btn" type="submit">
            <div className="overlap-2">
              <div className="text-wrapper-2">Register</div>
            </div>
          </button>
          <img className="vector" alt="Vector" src={vector} />
          <img className="wogo" alt="Wogo" src={wog} />
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;