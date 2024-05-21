import React, { useState } from "react";
import "../Css/NewPassword.css";
import logo from "../Images/wheelsongo.png";

const NewPassword = () => {
  const [userInput, setUserInput] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch the user and userID from localStorage only once
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.userId : null;
  console.log(userId);

  // Function to validate password
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate userId is available
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }

    // Check if new passwords match
    if (userInput.newPassword !== userInput.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    // Validate the new password strength
    if (!validatePassword(userInput.newPassword)) {
      alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.");
      return;
    }

    // API call to reset the password
    try {
      const response = await fetch('http://localhost:8080/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userId=${userId}&newPassword=${encodeURIComponent(userInput.newPassword)}`
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Password reset successfully: ${data}`);
      } else {
        const errorText = await response.text(); // Handle non-JSON responses
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      alert(`Failed to reset password: ${error.message}`);
    }
  };

  return (
    <div className="new-password">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="overlap">
            <input 
              className="overlap-2" 
              type="password" 
              placeholder="New password" 
              name="newPassword"
              value={userInput.newPassword}
              onChange={handleChange}
            />
            <input 
              className="div-wrapper" 
              type="password" 
              placeholder="Confirm password"
              name="confirmPassword"
              value={userInput.confirmPassword}
              onChange={handleChange}
            />
            <button className="overlap-group" type="submit">
              <div className="text-wrapper">Reset Password</div>
            </button>
            <div className="text-wrapper-4">Forgot Password</div>
          </div>
        </form>
        <img className="wheels-on-go" alt="Wheels on go" src={logo} />
      </div>
    </div>
  );
};

export default NewPassword;
