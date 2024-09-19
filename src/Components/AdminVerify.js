import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import "../Css/AdminVerify.css"; // Matching AdminDashboard CSS
import sidelogo from "../Images/sidelogo.png"; // Logo image

const AdminVerify = () => {
  const [verifications, setVerifications] = useState([]);
  const [users, setUsers] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

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
      })
      .catch(error => {
        console.error(`Error denying verification ${vId}:`, error);
      });
  };

  const handleLogout = () => {
    navigate('/adminlogin');
  };

  const handleAdminDashboard = () => {
    navigate('/admin-dashboard');
  };

  const handleAdminUser = () => {
    navigate('/adminusers');
  };

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleAdminVerify = () => {
    navigate('/adminverify');
  };

  const handleOrder = () => {
    navigate('/adminorder');
  };

  const handleReport = () => {
    navigate('/adminreport');
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredVerifications = verifications.filter(verification => {
    switch (filter) {
      case 'verified':
        return verification.status === 1;
      case 'pending':
        return verification.status === 0;
      default:
        return true;
    }
  });

  return (
    <div className="admin-verify-page">
      {/* Topbar */}
      <div className="admin-dashboard-topbar">
        <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-sidebar">
          <button className="admin-dashboard-menu-item" onClick={handleAdminDashboard}>Dashboard</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminUser}>Users</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminCars}>Cars</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminVerify}>Verifications</button>
          <button className="admin-dashboard-menu-item" onClick={handleOrder}>Transactions</button>
          <button className="admin-dashboard-menu-item" onClick={handleReport}>Reports</button>
        </div>

        {/* Main Content */}
        <div className="admin-dashboard-content">
          <h2 className="content-title">Pending Verifications</h2>

          {/* Filter */}
          <div className="filter-container">
            <select onChange={handleFilterChange} value={filter} className="user-filter">
              <option value="all">All Verifications</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Verifications Table */}
          <div className="verifications-table-container">
            <table className="verifications-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Submitted</th>
                  <th>User</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Gov ID</th>
                  <th>Driver's License</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.map(verification => (
                  <tr key={verification.vId}>
                    <td>{verification.vId}</td>
                    <td>{new Date(verification.timeStamp).toLocaleString()}</td>
                    <td>{verification.user ? (users[verification.user.userId] ? users[verification.user.userId].username : verification.user.userId) : 'N/A'}</td>
                    <td>{verification.user ? `${verification.user.fName} ${verification.user.lName}` : 'Name not available'}</td>
                    <td>{verification.status === 1 ? 'Verified' : 'Pending'}</td>
                    <td>{verification.govId ? <button onClick={() => handleShowImage(verification.govId)} className="button-show-image">Show Image</button> : 'Not Uploaded'}</td>
                    <td>{verification.driversLicense ? <button onClick={() => handleShowImage(verification.driversLicense)} className="button-show-image">Show Image</button> : 'Not Uploaded'}</td>
                    <td>
                      <button className="button-approve" onClick={() => handleApprove(verification.vId)}>Approve</button>
                      <button className="button-deny" onClick={() => handleDeny(verification.vId)}>Deny</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Modal
          isOpen={true}
          onRequestClose={handleCloseModal}
          contentLabel="Image Modal"
          className="image-modal"
          overlayClassName="image-modal-overlay"
        >
          <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Verification Document" />
          <button onClick={handleCloseModal} className="close-button">Close</button>
        </Modal>
      )}
    </div>
  );
};

export default AdminVerify;
