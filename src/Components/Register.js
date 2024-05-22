import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Css/Register.css";
import logo from "../Images/wheelsongo.png";
import axios from "axios";
import RegisteredPopup from './RegisteredPopup';

export const Registration = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setError("All fields are required.");
      return;
    }
    if (!email.match(emailRegex)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.match(passwordRegex)) {
      setError("Password must be 8 characters long with at least 1 capital letter, 1 small letter, 1 number, and 1 symbol.");
      return;
    }

    try {
      const response = await axios.post("https://extraordinary-abundance-production.up.railway.app/user/insertUser", {
        username: userName,
        fName: firstName,
        lName: lastName,
        email: email,
        pWord: password,
        pNum: phoneNumber,
        isAdmin: false,
        isDeleted: false,
      });
      console.log(response.data);
      setUserName("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setError("");
      setIsPopupVisible(true); // Show the popup upon successful registration
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.error("Registration Error:", error);
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="registration">
      <div className="div">
        <div className="overlap">
          <form onSubmit={handleSubmit}>
            <div className="text-wrapper">Registration</div>
            {error && <div className="error-message">{error}</div>}
            <div className="group">
              <button type="submit" className="overlap-group">Register</button>
            </div>
            <input
              className="div-wrapper"
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="overlap-2"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="last"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              className="overlap-3"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="overlap-4"
              type="number"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              className="overlap-5"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <p className="already-have-an">
            <span className="span">Already have an Account? </span>
            <Link to="/login" className="text-wrapper-3">Login</Link>
          </p>
        </div>
        <img className="wheels-on-go" alt="Wheels on go" src={logo} />
      </div>
      {isPopupVisible && <RegisteredPopup />} {/* Conditionally render the popup */}
    </div>
  );
};
export default Registration;
