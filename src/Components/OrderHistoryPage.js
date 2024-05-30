import React, { useEffect, useState } from "react";
import "../Css/OrderHistoryPage.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/order/getOrdersByUserId'); // Assuming the API endpoint
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

  return (
    <div className="order-history-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper">Cars</div>
            <div className="div">About</div>

            <img className="sideview" alt="Sideview" src={sidelogo} />

            <div className="text-wrapper-2">Home</div>
            <Dropdown>
              <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>
          <div className="overlap-2">
            <div className="fgh" />
            <div className="jkl" />
            <div className="rectangle">
              <div className="table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Car</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Price</th>
                      <th>Reference Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.car.carModel}</td>
                        <td>{order.startDate}</td>
                        <td>{order.endDate}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.referenceNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <img className="vector" alt="Vector" src={vector}/>
          </div>
          <div className="overlap-group-wrapper">
            <div className="div-wrapper">
              <div className="text-wrapper-3">Ongoing Rent</div>
            </div>
          </div>
          <div className="group-2">
            <div className="div-wrapper">
              <div className="text-wrapper-4">Order History</div>
            </div>
          </div>
          <div className="group-3">
            <div className="div-wrapper">
              <div className="text-wrapper-4">Rent History</div>
            </div>
          </div>
          <div className="text-wrapper-5">Order History</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
