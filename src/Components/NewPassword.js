import React, { useState, useEffect } from "react";
import "../Css/NewPassword.css";
import logo from "../Images/wheelsongo.png";

const NewPassword = () => {
  const [userInput, setUserInput] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIdParam = params.get('userId');
    setUserId(userIdParam);
    console.log(userIdParam);
  }, []);

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

    if (userInput.newPassword !== userInput.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    if (!validatePassword(userInput.newPassword)) {
      alert("Password must be at least 8 characters long, include at least one uppercase letter, one number, and one special character.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, newPassword: userInput.newPassword })
      });

      if (response.ok) {
        alert("Password reset successfully.");
        // Redirect to login page programmatically after successful password reset
        window.location.href = "/login";
      } else {
        const errorText = await response.text();
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
