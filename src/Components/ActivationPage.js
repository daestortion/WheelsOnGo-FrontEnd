import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../ApiConfig';

const ActivateAccountPage = () => {
  const { userId, token } = useParams(); // Get userId and token from URL params
  const [activationStatus, setActivationStatus] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const activateUser = async () => {
      try {
        console.log("Activating user with:", { userId, token }); // Debug log

        const response = await axios.get(`${BASE_URL}/user/activate`, {
          params: {
            userId: userId,   // Pass userId to backend
            token: token      // Pass token to backend
          }
        });
        
        console.log("Activation response:", response); // Debug log
        setActivationStatus('Your account has been successfully activated!');
        
        setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
      } catch (error) {
        console.error("Activation error:", error); // Log error details
        setActivationStatus('Invalid or expired activation link.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      activateUser();
    } else {
      setActivationStatus('Missing userId or token.');
      setLoading(false);
    }
  }, [userId, token, navigate]);

  return (
    <div className="activation-container">
      <h2>Activate Account</h2>
      {loading ? (
        <p>Activating your account...</p>
      ) : (
        <p>{activationStatus}</p>
      )}
    </div>
  );
};

export default ActivateAccountPage;
