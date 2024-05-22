// src/components/Login.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import "../Css/Login.css";
import logo from "../Images/wheelsongo.png";
import axios from "axios";
import Loading from './Loading';

export const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Attempting login with identifier:", identifier, "and password:", password);
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://extraordinary-abundance-production.up.railway.app/user/login", {
        identifier,
        password,
      });
      console.log("Login response:", response.data);

      if (response.data && response.data.userId) {
        const userId = response.data.userId;

        // Fetch user profile including isRenting status
        try {
          const userProfileResponse = await axios.get(`https://extraordinary-abundance-production.up.railway.app/user/getUserById/${userId}`);
          const userProfile = userProfileResponse.data;

          // Fetch verification status
          try {
            const verificationResponse = await axios.get(`https://extraordinary-abundance-production.up.railway.app/verification/getVerificationByUserId/${userId}`);
            const userWithVerification = {
              ...userProfile,
              verificationStatus: verificationResponse.data.status
            };

            localStorage.setItem('user', JSON.stringify(userWithVerification));
            login();
            navigate("/home");
          } catch (verificationError) {
            console.error("Error fetching verification status:", verificationError);
            const userWithVerification = {
              ...userProfile,
              verificationStatus: null
            };

            localStorage.setItem('user', JSON.stringify(userWithVerification));
            login();
            navigate("/home");
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          setErrorMessage("An error occurred while fetching user profile.");
        }
      } else {
        setErrorMessage("Invalid username/email or password!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred while logging in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      {isLoading && <Loading />}
      <div className="div">
        <div className="overlap">
          <div className="text-wrapper">LOGIN</div>
          <input
            className="overlap-group"
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            name="identifier"
            autoComplete="username"
          />
          <input
            className="div-wrapper"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            autoComplete="current-password"
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="not-registered">
            <span className="span">Not Registered? </span>
            <Link to="/register" className="text-wrapper-3">
              Create an Account
            </Link>
          </p>
          <p className="forgot-password">
            <Link to="/forgotpassword" className="text-wrapper-3">
              Forgot Password?
            </Link>
          </p>
          <button className="overlap-group-2" onClick={handleLogin}>
            Login
          </button>
        </div>
        <img className="wheels-on-go" alt="Wheels on go" src={logo} />
      </div>
    </div>
  );
};

export default Login;
