import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const ActivateAccountPage = () => {
  const { userId, token } = useParams(); // Get userId and token from URL
  const [activationStatus, setActivationStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const activateUser = async () => {
      try {
        const response = await axios.put(`${BASE_URL}/user/activate`, {
          userId,
          token
        });
        setActivationStatus('Your account has been successfully activated!');
        setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
      } catch (error) {
        setActivationStatus('Invalid or expired activation link.');
      }
    };

    if (userId && token) {
      activateUser();
    }
  }, [userId, token, navigate]);

  return (
    <div className="activation-container">
      <h2>Activate Account</h2>
      {activationStatus ? (
        <p>{activationStatus}</p>
      ) : (
        <p>Activating your account...</p>
      )}
    </div>
  );
};

export default ActivateAccountPage;
