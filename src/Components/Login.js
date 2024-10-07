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
    const clearLocalStorageIfEmpty = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/checkDatabaseEmpty");
        if (response.data) {
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error("Error checking database status:", error);
      }
    };

    clearLocalStorageIfEmpty();

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
      const response = await axios.post("http://localhost:8080/user/login", {
        identifier,
        password,
      });
      console.log("Login response:", response.data);
  
      if (response.data && response.data.userId) {
        const userId = response.data.userId;
  
        // Fetch user profile including isRenting status
        try {
          const userProfileResponse = await axios.get(`http://localhost:8080/user/getUserById/${userId}`);
          const userProfile = userProfileResponse.data;
  
          // Fetch verification status
          try {
            const verificationResponse = await axios.get(`http://localhost:8080/verification/getVerificationByUserId/${userId}`);
            const userWithVerification = {
              userId: userProfile.userId,
              userName: userProfile.userName,
              verificationStatus: verificationResponse.data.status
            };
  
            localStorage.setItem('user', JSON.stringify(userWithVerification));
            login();
            navigate("/home");
          } catch (verificationError) {
            console.error("Error fetching verification status:", verificationError);
            const userWithVerification = {
              userId: userProfile.userId,
              userName: userProfile.userName,
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
      if (error.response && error.response.status === 403) {
        setErrorMessage("Your account has been deactivated.");
      } else if(error.response && error.response.status === 401) {
        setErrorMessage("Account Credentials are Invalid.");
      } else{
        setErrorMessage("There has a been a problem logging in. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  };

  return (
    <div className="login">
      {isLoading && <Loading />}
      <div className="div">
        <img className="wheels-on-go" alt="Wheels on go" src={logo} />
        <div className="overlap">
          <div className="text-wrapper">LOGIN</div>
    
          <input
            className="overlap-group"
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrorMessage(""); // Clear error message on input change
            }}
            onKeyPress={handleKeyPress}
            name="identifier"
            autoComplete="username"
          />
    
          <input
            className="div-wrapper"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage(""); // Clear error message on input change
            }}
            onKeyPress={handleKeyPress}
            name="password"
            autoComplete="current-password"
          />
    
          {errorMessage && (
            <div className="error">
              <p className="error-message">{errorMessage}</p>
            </div>
          )}
  
          <div className="not-registered">
            <span className="span">Not Registered? </span>
            <Link to="/register" className="text-wrapper-323">
              Create an Account
            </Link>
          </div>
    
          <div className="forgot-passwords">
            <Link to="/forgotpassword" className="text-wrapper-323">
              Forgot Password?
            </Link>
          </div>
    
          <button className="overlap-group-2" onClick={handleLogin}>
            Login
          </button>
      </div>
    </div>
    </div>
  );
};

export default Login;
