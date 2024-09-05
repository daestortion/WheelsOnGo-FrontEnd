import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AdminOrder.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [proofImage, setProofImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [searchQuery, setSearchQuery] = useState(''); // To store the search on submit

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]); // Trigger fetchOrders when searchQuery changes

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/order/getAllOrders');
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
        
        // Fetch user data for each order
        const userIds = data.map(order => order.user.userId);
        const uniqueUserIds = [...new Set(userIds)];
        uniqueUserIds.forEach(userId => {
          fetchUser(userId);
        });
      } else {
        console.error('API response is not an array:', data);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/user/getUserById/${userId}`);
      const data = await response.json();
      setUsers(prevUsers => ({ ...prevUsers, [userId]: data }));
    } catch (error) {
      console.error(`Error fetching user data for userId ${userId}:`, error);
    }
  };

  const fetchProofOfPayment = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/order/getProofOfPayment/${orderId}`);
      if (response.ok) {
        const imageBlob = await response.blob();
        setProofImage(URL.createObjectURL(imageBlob));
        setShowImagePopup(true);
      } else {
        console.error('Error fetching proof of payment image:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching proof of payment image:', error);
    }
  };

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleAdminVerify = () => {
    navigate('/adminverify');
  };

  const handleAdminUsers = () => {
    navigate('/adminusers');
  };

  const handleReport = () => {
    navigate('/adminreport');
  };

  const handleApprove = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/order/approveOrder/${orderId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchOrders(); // Refresh the list of orders after approving
      } else {
        console.error('Error approving order:', response.statusText);
      }
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const handleDeny = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/order/denyOrder/${orderId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchOrders(); // Refresh the list of orders after denying
      } else {
        console.error('Error denying order:', response.statusText);
      }
    } catch (error) {
      console.error('Error denying order:', error);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm); // Set search query to the value in the search bar
  };

  // Filter the orders based on the search query
  const filteredOrders = orders.filter(order => {
    const orderIdStr = String(order.orderId); // Convert orderId to string
    const userName = order.user ? `${order.user.fName} ${order.user.lName}` : '';
    const carModel = order.car ? order.car.carModel : '';

    return (
      orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carModel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="admin-page-order">
      <div className="div">
        <div className="overlap">
          <img className="rectangle" alt="Rectangle" src={adminbg} />
          <div className="rectangle-2" />

          <button className="group" onClick={handleAdminCars}>
            <div className="text-wrapper">Cars</div>
          </button>

          <button className="overlap-wrapper" onClick={handleAdminUsers}>
            <div className="text-wrapper">Users</div>
          </button>

          <button className="overlap-group-wrapper" onClick={handleAdminVerify}>
            <div className="text-wrapper-22">Verifications</div>
          </button>

          <div className="group-2">
            <div className="text-wrapper">Transactions</div>
          </div>

          <button className="group-34" onClick={handleReport}>
            <div className="text-wrapper">Reports</div>
          </button>

          <div className="text-wrapper-33">Dashboard</div>
          <img className="vector" alt="Vector" src={vector} />
          <div className="text-wrapper-4444">Transaction History</div>
          <div className="rectangle-3">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-bar"
              />
              <button onClick={handleSearch} className="submit-button">
                Submit
              </button>
            </div>

            <div className="table-container112">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Car</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Total Price</th>
                    <th>Payment Option</th>
                    <th>Reference Number</th>
                    <th>isActive</th>
                    <th>Status</th>
                    <th>Proof of Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.user ? `${order.user.fName} ${order.user.lName}` : 'Name not available'}</td>
                      <td>{order.car ? order.car.carModel : 'Car not available'}</td>
                      <td>{order.startDate}</td>
                      <td>{order.endDate}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.paymentOption}</td>
                      <td>{order.referenceNumber}</td>
                      <td>{order.active ? 'True' : 'False'}</td>
                      <td>{order.status === 1 ? 'Approved' : order.status === 2 ? 'Denied' : order.status === 3 ? 'Finished' : 'Pending'}</td>
                      <td>
                        <button className="button-show-image" onClick={() => fetchProofOfPayment(order.orderId)}>Show Image</button>
                      </td>
                      <td>
                        <button className="button-approve" onClick={() => handleApprove(order.orderId)}>Approve</button>
                        <button className="button-deny" onClick={() => handleDeny(order.orderId)}>Deny</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <img className="sideview" alt="Sideview" src={sidelogo} />

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
