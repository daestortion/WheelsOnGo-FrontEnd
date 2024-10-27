import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Css/Register.css";
import logo from "../Images/wheelsongo.png";
import axios from "axios";
import RegisteredPopup from './RegisteredPopup';
import Loading from './Loading';

export const Registration = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/user/insertUser", {
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
      setConfirmPassword("");
      setError("");
      setIsPopupVisible(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        console.error("Registration Error:", error);
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="registration">
      {isLoading && <Loading />}
      <div className="div">
        <img className="wheels-on-go" alt="Wheels on go" src={logo} />
        <div className="overlap">
          <p className="text-wrapper">Registration</p>
          <form onSubmit={handleSubmit} className="registration-form">
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
            
            <div className="password-input-wrapper">
              <input
                className="overlap-5"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>


              <div className="password-input-wrapper">
                <input
                  className="overlap-6"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
          

          {error && <div className="error-message">{error}</div>}

          <div className="already-have-an">
            <span className="span">Already have an Account? </span>
            <Link to="/login" className="text-wrapper-3">Login</Link>
          </div>

          <button type="submit" className="overlap-group">Register</button>

          </form>
        </div>
      </div>
      {isPopupVisible && <RegisteredPopup />}
    </div>
  );
};

export default Registration;
