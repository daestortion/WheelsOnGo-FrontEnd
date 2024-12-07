import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../ApiConfig';
import '../Css/ActivationPage.css';  // Adjust the path if necessary

const ActivateAccountPage = () => {
  const { userId, token } = useParams();  // Extract userId and token from the URL
  const [activationStatus, setActivationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResending, setIsResending] = useState(false); // State to track resend status
  const navigate = useNavigate();

  useEffect(() => {
    const activateUser = async () => {
      try {
        console.log("Activating user with:", { userId, token });

        // Send userId and token as part of the URL path to match the backend route
        const response = await axios.get(`${BASE_URL}/user/activate/${userId}/${token}`);

        console.log("Activation response:", response);
        setActivationStatus('Your account has been successfully activated!');

        // Redirect to login page after a few seconds
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        console.error("Activation error:", error);

        if (error.response) {
          if (error.response.status === 400) {
            setActivationStatus('Invalid or expired activation link.');
          } else if (error.response.status === 404) {
            setActivationStatus('User not found.');
          } else {
            setActivationStatus('An unexpected error occurred. Please try again later.');
          }
        } else {
          setActivationStatus('Network error. Please check your internet connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      activateUser();  // Call the activation function if userId and token exist
    } else {
      setActivationStatus('Missing userId or token.');
      setLoading(false);
    }
  }, [userId, token, navigate]);

  // Resend activation link handler
  const handleResendLink = async () => {
    setIsResending(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/resend-activation-email/${userId}`);
      if (response.status === 200) {
        setActivationStatus('Activation link has been resent. Please check your email.');
      } else {
        setActivationStatus('Failed to resend the activation link.');
      }
    } catch (error) {
      console.error('Resend Link Error:', error);
      setActivationStatus('There was an issue resending the activation link.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="activation-container">
      <h2>Activate Account</h2>
      {loading ? (
        <p>Activating your account...</p>
      ) : (
        <p>{activationStatus}</p>
      )}
      {activationStatus === 'Invalid or expired activation link.' && (
        <button
          onClick={handleResendLink}
          disabled={isResending}
          className="resend-link-button"
        >
          {isResending ? 'Resending...' : 'Resend Activation Link'}
        </button>
      )}
    </div>
  );
};

export default ActivateAccountPage;
