import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/AdminOrder.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageOrder = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/order/getAllOrders');
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('API response is not an array:', data);
        setOrders([]); // Set to an empty array to avoid map errors
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set to an empty array to avoid map errors
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
            <div className="text-wrapper-2">Verifications</div>
          </button>

          <button className="group-2">
            <div className="text-wrapper">Orders</div>
          </button>

          <div className="text-wrapper-3">Dashboard</div>
          <img className="vector" alt="Vector" src={vector} />
          <div className="text-wrapper-4444">Order History</div>
          <div className="rectangle-3">
            
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
                    <th>Reference Number</th>
                    <th>isActive</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.user.username}</td>
                      <td>{order.car.carModel}</td>
                      <td>{order.startDate}</td>
                      <td>{order.endDate}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.referenceNumber}</td>
                      <td>{order.active ? 'True' : 'False'}</td>
                      <td>{order.status === 1 ? 'Approved' : order.status === 2 ? 'Denied' : 'Pending'}</td>
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

      <button className="img">
        <img alt="Group" src={profile} />
      </button>
      <img className="sideview" alt="Sideview" src={sidelogo} />
    </div>
  );
};

export default AdminPageOrder;
