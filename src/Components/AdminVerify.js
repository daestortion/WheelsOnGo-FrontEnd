import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Css/AdminVerify.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminVerify = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    axios.get('https://extraordinary-abundance-production.up.railway.app/verification/getAllVerification')
      .then(response => {
        const verificationsData = response.data;
        setVerifications(verificationsData);

        const userIds = verificationsData
          .filter(verification => verification.user)
          .map(verification => verification.user.userId);
        const uniqueUserIds = [...new Set(userIds)];
        uniqueUserIds.forEach(userId => {
          axios.get(`https://extraordinary-abundance-production.up.railway.app/user/getUserById/${userId}`)
            .then(userResponse => {
              setUsers(prevUsers => ({ ...prevUsers, [userId]: userResponse.data }));
            })
            .catch(error => {
              console.error(`Error fetching user data for userId ${userId}:`, error);
            });
        });
      })
      .catch(error => {
        console.error('Error fetching verification data:', error);
      });
  }, []);

  const handleShowImage = (id, type) => {
    navigate(`/show-image/${id}/${type}`);
  };

  const handleApprove = (vId) => {
    axios.put(`https://extraordinary-abundance-production.up.railway.app/verification/changeStatus/${vId}?newStatus=1`)
      .then(response => {
        setVerifications(prevVerifications => prevVerifications.map(verification =>
          verification.vId === vId ? { ...verification, status: 1 } : verification
        ))
        console.log(vId);
      })
      .catch(error => {
        console.error(`Error approving verification ${vId}:`, error);
      });
  };

  const handleDeny = (vId) => {
    axios.delete(`https://extraordinary-abundance-production.up.railway.app/verification/deleteVerix  fication/${vId}`)
      .then(response => {
        setVerifications(prevVerifications => prevVerifications.filter(verification => verification.vId !== vId));
      })
      .catch(error => {
        console.error(`Error denying verification ${vId}:`, error);
      });
  };

  const handleHomeClick = () => {
    navigate('/home'); 
  };

  const handleAdminUser = () => {
    navigate('/adminusers');
  };

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleAdminDashboard = () => {
    navigate('/admindashboard'); 
  };

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  return (
    <div className="admin-page">
      <div className="div">
        <div className="overlap">
          <img className="rectangle" alt="Rectangle" src={adminbg} />
          <div className="text-wrapper">Pending Verifications</div>
          <div className="rectangle-2">
            <table className="verifications-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Gov ID</th>
                  <th>Driver's License</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {verifications.map((verification) => (
                  <tr key={verification.vid}>
                    <td>{verification.vid}</td>
                    <td>{verification.user ? (users[verification.user.userId] ? users[verification.user.userId].username : verification.user.userId) : 'N/A'}</td>
                    <td>{verification.status === 1 ? 'Verified' : 'Pending'}</td>
                    <td>
                      {verification.govId ? (
                        <button className="button-show-image" onClick={() => handleShowImage(verification.vid, 'govId')}>Show Image</button>
                      ) : 'Not Uploaded'}
                    </td>
                    <td>
                      {verification.driversLicense ? (
                        <button className="button-show-image" onClick={() => handleShowImage(verification.vid, 'driversLicense')}>Show Image</button>
                      ) : 'Not Uploaded'}
                    </td>
                    <td>
                      <button className="button-approve" onClick={() => handleApprove(verification.vid)}>Approve</button>
                      <button className="button-deny" onClick={() => handleDeny(verification.vid)}>Deny</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rectangle-3" />

          <button className="group-2">
            <div className="text-wrapper-34">Orders</div>
          </button>
          
          <button className="group" onClick={handleAdminCars}>
            <div className="text-wrapper-2">Cars</div>
          </button>
          <button className="overlap-wrapper" onClick={handleAdminUser}>
            <div className="text-wrapper-2">Users</div>
          </button>
          <button className="overlap-group-wrapper" onClick={handleAdminDashboard}>
            <div className="text-wrapper-3">Verifications</div>
          </button>
          <div className="rectangle-4" />
          <div className="text-wrapper-4" onClick={handleAdminDashboard}>Dashboard</div>
          <img className="vector" alt="Vector" src={vector} />
        </div>
        <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
      </div>
    </div>
  );
};

export default AdminVerify;
