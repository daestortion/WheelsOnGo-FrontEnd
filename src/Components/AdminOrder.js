import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AdminOrder.css"; // Matching AdminDashboard CSS
import sidelogo from "../Images/sidelogo.png"; // Logo image

const AdminPageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [proofImage, setProofImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/order/getAllOrders');
      const data = await response.json();
      console.log(data);
      if (Array.isArray(data)) {
        setOrders(data);
        const userIds = data.map(order => order.user.userId);
        const uniqueUserIds = [...new Set(userIds)];
        uniqueUserIds.forEach(userId => {
          fetchUser(userId);
        });
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/user/getUserById/${userId}`);
      const data = await response.json();
      setUsers(prevUsers => ({ ...prevUsers, [userId]: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProofOfPayment = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/order/getProofOfPayment/${orderId}`);
      if (response.ok) {
        const imageBlob = await response.blob();
        setProofImage(URL.createObjectURL(imageBlob));
        setShowImagePopup(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (orderId) => {
    try {
        const response = await fetch(`http://localhost:8080/order/approveOrder/${orderId}`, { method: 'PUT' });
        if (response.ok) {
            // Update the frontend to mark the order as paid
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId ? { ...order, paid: true } : order
            ));
            fetchOrders(); // Optionally refetch orders to reflect the changes
        }
      } catch (error) {
          console.error(error);
      }
  };

  const handleDeny = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/order/denyOrder/${orderId}`, { method: 'PUT' });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTerminate = () => {
    
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const filteredOrders = orders
    .filter(order => {
      switch (filter) {
        case 'approved':
          return order.status === 1;
        case 'active':
          return order.isActive === true;
        default:
          return true;
      }
    })
    .filter(order => {
      const orderIdStr = String(order.orderId);
      const userName = order.user ? `${order.user.fName} ${order.user.lName}` : '';
      const carModel = order.car ? order.car.carModel : '';
      return orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        carModel.toLowerCase().includes(searchQuery.toLowerCase());
    });

  return (
    <div className="admin-order-page">
      {/* Topbar */}
      <div className="admin-dashboard-topbar">
        <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-dashboard-logout" onClick={() => navigate('/adminlogin')}>Logout</button>
      </div>

      {/* Sidebar */}
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-sidebar">
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/admin-dashboard')}>Dashboard</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminusers')}>Users</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/admincars')}>Cars</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminverify')}>Verifications</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminorder')}>Transactions</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminreport')}>Reports</button>
        </div>

        {/* Main Content */}
        <div className="admin-dashboard-content">
          <h2 className="content-title">Transaction History</h2>

          {/* Search & Filter */}
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button onClick={handleSearch} className="submit-button">Submit</button>
            <select onChange={e => setFilter(e.target.value)} value={filter} className="user-filter">
              <option value="all">All Orders</option>
              <option value="approved">Approved</option>
              <option value="active">Pending</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="order-table-container">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Created</th>
                  <th>User</th>
                  <th>Car</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Price</th>
                  <th>Payment Option</th>
                  <th>Reference Number</th>
                  <th>isActive</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Proof of Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{new Date(order.timeStamp).toLocaleString('en-US')}</td>
                    <td>{order.user ? `${order.user.fName} ${order.user.lName}` : 'N/A'}</td>
                    <td>{order.car ? order.car.carModel : 'N/A'}</td>
                    <td>{order.startDate}</td>
                    <td>{order.endDate}</td>
                    <td>₱{order.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{order.paymentOption}</td>
                    <td>{order.referenceNumber}</td>
                    <td>{order.active ? 'True' : 'False'}</td>
                    <td>{order.status === 1 ? 'Approved' : order.status === 2 ? 'Denied' : 'Pending'}</td>
                    <td>{order.paid ? 'Paid' : 'Not Paid'}</td>
                    {order.paymentOption === "GCash" ? (
                    <td>
                      <button className="button-show-image" onClick={() => fetchProofOfPayment(order.orderId)}>Show Image</button>
                    </td>
                    ) : (
                      <td></td> // Empty cell when no button
                    )}
                    <td>
                      {order.paymentOption === "Cash" ? (
                        <>
                          <button className="button-approve" onClick={() => handleApprove(order.orderId)}>Approve</button>
                          <button className="button-deny" onClick={() => handleDeny(order.orderId)}>Deny</button>
                        </>
                      ) : null}
                      <button className="button-terminate" onClick={() => handleTerminate(order.orderId)}>Terminate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Image Popup */}
      {showImagePopup && (
        <div className="image-popup">
          <div className="popup-content">
            <img src={proofImage} alt="Proof of Payment" />
            <button onClick={() => setShowImagePopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPageOrder;
