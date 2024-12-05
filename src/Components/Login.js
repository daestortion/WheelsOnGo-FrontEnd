import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext';
import "../Css/Login.css";
import logo from "../Images/wheelsongo.png";
import Loading from './Loading';
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

export const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const clearLocalStorageIfEmpty = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/checkDatabaseEmpty`);
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
      const response = await axios.post(`${BASE_URL}/user/login`, {
        identifier,
        password,
      });
      console.log("Login response:", response.data);

      if (response.data && response.data.userId) {
        const userId = response.data.userId;

        // Fetch user profile including isRenting status and isActive status
        try {
          const userProfileResponse = await axios.get(`${BASE_URL}/user/getUserById/${userId}`);
          const userProfile = userProfileResponse.data;

          // Log user profile to see data structure
          console.log("User Profile Response:", userProfileResponse.data);

          // Check if the user account is active
          if (!userProfile.active) {  // Change isActive to active
            setErrorMessage("Your account has not been activated yet. Please check your email.");
            setIsLoading(false);
            return;  // Prevent login if account is not active
          }

          // Fetch verification status
          try {
            const verificationResponse = await axios.get(`${BASE_URL}/verification/getVerificationByUserId/${userId}`);
            const verificationStatus = verificationResponse.data ? verificationResponse.data.status : null;

            // Log verification response to check if status is missing
            console.log("Verification Response:", verificationResponse.data);

            const userWithVerification = {
              userId: userProfile.userId,
              userName: userProfile.userName,
              verificationStatus: verificationStatus,
            };

            localStorage.setItem('user', JSON.stringify(userWithVerification));
            login(); // Update authentication state
            navigate("/home");
          } catch (verificationError) {
            console.error("Error fetching verification status:", verificationError);
            const userWithVerification = {
              userId: userProfile.userId,
              userName: userProfile.userName,
              verificationStatus: null,  // Handle missing verification
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
        setErrorMessage("Your account has not been activated yet. Please check your email.");
      } else if (error.response && error.response.status === 401) {
        setErrorMessage("Invalid username/email or password!");
      } else {
        setErrorMessage("There has been a problem logging in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <div className="overlap11">
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

          <div className="password-field-login">
            <input
              className="div-wrapper"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              name="password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-login"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errorMessage && (
            <div className="error">
              <p className="error-messages">{errorMessage}</p>
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

          <button className="overlap-group-2as" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
