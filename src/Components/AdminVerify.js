import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AdminVerify.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminVerify = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/verification/getAllVerification')
      .then(response => {
        const verificationsData = response.data;
        setVerifications(verificationsData);

        const userIds = verificationsData
          .filter(verification => verification.user)
          .map(verification => verification.user.userId);
        const uniqueUserIds = [...new Set(userIds)];
        uniqueUserIds.forEach(userId => {
          axios.get(`http://localhost:8080/user/getUserById/${userId}`)
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

  const handleShowImage = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleApprove = (vId) => {
    axios.put(`http://localhost:8080/verification/changeStatus/${vId}?newStatus=1`)
      .then(response => {
        setVerifications(prevVerifications => prevVerifications.map(verification =>
          verification.vId === vId ? { ...verification, status: 1 } : verification
        ));
        window.location.reload(); // Refresh the page
      })
      .catch(error => {
        console.error(`Error approving verification ${vId}:`, error);
      });
  };

  const handleDeny = (vId) => {
    axios.put(`http://localhost:8080/verification/changeStatus/${vId}?newStatus=2`)
      .then(response => {
        setVerifications(prevVerifications => prevVerifications.map(verification =>
          verification.vId === vId ? { ...verification, status: 2 } : verification
        ));
        window.location.reload(); // Refresh the page
      })
      .catch(error => {
        console.error(`Error denying verification ${vId}:`, error);
      });
  };  

  const handleAdminVerify = () => {
    navigate('/adminverify'); 
  };

  const handleAdminUser = () => {
    navigate('/adminusers');
  };

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  const handleOrder = () => {
    navigate('/adminorder'); 
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
                        <button className="button-show-image" onClick={() => handleShowImage(verification.govId)}>Show Image</button>
                      ) : 'Not Uploaded'}
                    </td>
                    <td>
                      {verification.driversLicense ? (
                        <button className="button-show-image" onClick={() => handleShowImage(verification.driversLicense)}>Show Image</button>
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

          <button className="group-2"onClick={handleOrder}>
            <div className="text-wrapper-34">Orders</div>
          </button>
          
          <button className="group" onClick={handleAdminCars}>
            <div className="text-wrapper-2">Cars</div>
          </button>
          <button className="overlap-wrapper" onClick={handleAdminUser}>
            <div className="text-wrapper-2">Users</div>
          </button>
          <button className="overlap-group-wrapper" onClick={handleAdminVerify}>
            <div className="text-wrapper-3">Verifications</div>
          </button>
          <div className="rectangle-4" />
          <div className="text-wrapper-4">Dashboard</div>
          <img className="vector" alt="Vector" src={vector} />
        </div>
        <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        <img className="sideview" alt="Sideview" src={sidelogo} />
      </div>

     {/* Verify Image Modal */}
     {selectedImage && (
        <div className="verify-image-modal">
          <div className="modal-content">
            <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Car Document" />
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default AdminVerify;
