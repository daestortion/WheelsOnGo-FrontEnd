import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminOrder.css"; // Matching AdminDashboard CSS
import sidelogo from "../Images/sidelogo.png"; // Logo image
import Loading from "./Loading";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const AdminPageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [proofImage, setProofImage] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // Track if data has been fetched
  const [selectedOrder, setSelectedOrder] = useState(null); // Track selected order for payment details
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`${BASE_URL}/order/getAllOrders`);
      const data = await response.json();
      console.log(data);

      if (Array.isArray(data)) {
        setOrders(data);
        setHasFetchedOnce(true); // Mark that data has been fetched

        // Extract userIds from orders
        const userIds = data.map((order) => order.user.userId);
        const uniqueUserIds = [...new Set(userIds)];

        // Make all user fetch requests in parallel using Promise.all
        const userRequests = uniqueUserIds.map((userId) => fetchUser(userId));

        // Wait for all user fetches to complete
        await Promise.all(userRequests);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Set orders to an empty array in case of error
    } finally {
      setIsLoading(false); // Stop loading once all fetches are done
    }
  };

  const fetchUser = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/getUserById/${userId}`);
      const data = await response.json();
      setUsers((prevUsers) => ({ ...prevUsers, [userId]: data }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProofOfPayment = async (orderId) => {
    try {
      const response = await fetch(`${BASE_URL}/order/getProofOfPayment/${orderId}`);
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
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/order/approveOrder/${orderId}`, {
        method: "PUT",
      });
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, paid: true } : order
          )
        );
        fetchOrders();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/order/denyOrder/${orderId}`, {
        method: "PUT",
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
  };

  const filteredOrders = orders
    .filter((order) => {
      switch (filter) {
        case "approved":
          return order.status === 1;
        case "active":
          return order.isActive === true;
        default:
          return true;
      }
    })
    .filter((order) => {
      const orderIdStr = String(order.orderId);
      const userName = order.user ? `${order.user.fName} ${order.user.lName}` : "";
      const carModel = order.car ? order.car.carModel : "";
      return (
        orderIdStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        carModel.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="admin-order-page">
      {isLoading && <Loading />}
      {/* Topbar */}
      <div className="admin-dashboard-topbar">
        <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-dashboard-logout" onClick={() => navigate("/adminlogin")}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-sidebar">
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/adminusers")}>
            Users
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/admincars")}>
            Cars
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/adminverify")}>
            Verifications
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/adminorder")}>
            Transactions
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/adminreport")}>
            Reports
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/admin-payments")}>
            Payments
          </button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate("/activitylogs")}>
            Activity Logs
          </button>
        </div>

        {/* Main Content */}
        <div className="admin-dashboard-content">
          {/* Fetch Data Button */}
          <div className="fetch-data-container">
            <button className="fetch-data-btn" onClick={fetchOrders}>
              Fetch Data
            </button>
          </div>

          <h2 className="content-title">Transaction History</h2>

          {/* Search & Filter */}
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-bar"
            />
            <button onClick={handleSearch} className="submit-button">
              Submit
            </button>
            <select onChange={(e) => setFilter(e.target.value)} value={filter} className="user-filter">
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
                  <th>Termination</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>
                        <button
                          onClick={() => setSelectedOrder(order)} // Open payment details popup
                          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
                        >
                          {order.orderId}
                        </button>
                      </td>
                      <td>{new Date(order.timeStamp).toLocaleString()}</td>
                      <td>
                        {order.user ? `${order.user.fName} ${order.user.lName}` : "N/A"}
                      </td>
                      <td>{order.car ? order.car.carModel : "N/A"}</td>
                      <td>{order.startDate}</td>
                      <td>{order.endDate}</td>
                      <td>
                        ₱
                        {order.totalPrice.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{order.paymentOption}</td>
                      <td>{order.referenceNumber}</td>
                      <td>{order.isActive ? "True" : "False"}</td>
                      <td>
                        {order.status === 1
                          ? "Approved"
                          : order.status === 2
                          ? "Denied"
                          : "Pending"}
                      </td>
                      <td>
                        {order.payments[order.payments.length - 1]?.status === 1
                          ? "Paid"
                          : "Not Paid"}
                      </td>
                      <td>
                        {order.paymentOption === "GCash" ? (
                          <button
                            className="button-show-image"
                            onClick={() => fetchProofOfPayment(order.orderId)}
                          >
                            Show Image
                          </button>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {order.terminated
                          ? `Terminated on ${new Date(order.terminationDate)
                              .toISOString()
                              .split("T")[0]}`
                          : ""}
                      </td>
                      <td>
                        {order.paymentOption === "Cash" ? (
                          <>
                            <button
                              className="button-approve"
                              onClick={() => handleApprove(order.orderId)}
                            >
                              Approve
                            </button>
                            <button
                              className="button-deny"
                              onClick={() => handleDeny(order.orderId)}
                            >
                              Deny
                            </button>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center" }}>
                      {hasFetchedOnce ? "No orders match the current filter." : "Click 'Fetch Data' to load orders."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Details Popup */}
      {selectedOrder && (
        <div className="payment-popup">
          <div className="popup-content">
            <h3>Payment Details for Order ID: {selectedOrder.orderId}</h3>
            <table className="payment-details-table">
              <thead>
                <tr>
                  <th>Payment Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.payments.map((payment, index) => (
                  <tr key={index}>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>
                      ₱
                      {payment.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setSelectedOrder(null)} className="close-popup-btn">
              Close
            </button>
          </div>
        </div>
      )}

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