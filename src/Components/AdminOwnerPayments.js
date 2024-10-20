import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminOwner.css";
import sidelogo from "../Images/sidelogo.png";
import Loading from './Loading';

const AdminOwnerPayments = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/wallet/getAllRequests")
      .then((response) => {
        console.log("Fetched payment requests:", response.data);
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching payment requests:", error);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  const handleApprove = async (requestId, userId, amountRequested) => {
    setLoading(true);
    try {
      console.log("Approve button clicked");
      console.log("Request ID:", requestId);
      console.log("User ID:", userId);
      console.log("Amount Requested:", amountRequested);

      if (!userId) {
        console.error("Invalid user ID");
        throw new Error("Invalid user ID");
      }

      console.log("Sending approve request to backend...");
      await axios.put(`http://localhost:8080/wallet/approveRequest/${requestId}`);
      console.log("Approve request sent successfully!");

      console.log("Fetching updated requests...");
      fetchRequests(); // Simply refetch the requests without recalculation

      alert("Request approved and wallet updated successfully!");
    } catch (error) {
      console.error("Error approving request or updating wallet:", error);
      alert("Error processing approval: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = (requestId) => {
    setLoading(true);
    axios
      .put(`http://localhost:8080/wallet/denyRequest/${requestId}`)
      .then(() => {
        fetchRequests();
        alert("Request denied successfully!");
      })
      .catch((error) => {
        console.error("Error denying request:", error);
        alert("Error denying request: " + error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="admin-owner-payments-page">
      {loading && <Loading />}
      <div className="admin-owner-dashboard-topbar">
        <img className="admin-owner-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-owner-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-owner-dashboard-wrapper">
        <div className="admin-owner-dashboard-sidebar">
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admin-dashboard")}>Dashboard</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminusers")}>Users</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admincars")}>Cars</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminverify")}>Verifications</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminorder")}>Transactions</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminreport")}>Reports</button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admin-payments")}>Payments</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/activitylogs')}>Activity Logs</button>
        </div>

        <div className="admin-owner-dashboard-content">
          <h2 className="admin-owner-content-title">Owner Payments Requests</h2>

          <div className="owner-payments-table-container">
            <table className="owner-payments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Request Type</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.requestId}>
                    <td>{request.requestId}</td>
                    <td>{request.user.username}</td>
                    <td>{request.requestType}</td>
                    <td>
                      {request.requestType === 'gcash' ? (
                        <>
                          <strong>Full Name:</strong> {request.fullName || 'N/A'}<br />
                          <strong>GCash Number:</strong> {request.gcashNumber || 'N/A'}
                        </>
                      ) : request.requestType === 'bank' ? (
                        <>
                          <strong>Account Name:</strong> {request.fullName || 'N/A'}<br />
                          <strong>Bank Name:</strong> {request.bankName || 'N/A'}<br />
                          <strong>Account Number:</strong> {request.accountNumber || 'N/A'}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>₱{request.amount.toFixed(2)}</td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                    <td>{request.status || "pending"}</td>
                    <td>
                      <button
                        className="button-approve"
                        onClick={() => handleApprove(request.requestId, request.user.userId, request.amount)}
                        disabled={loading || (request.status === "approved" || request.status === "denied")}
                      >
                        Approve
                      </button>
                      <button
                        className="button-deny"
                        onClick={() => handleDeny(request.requestId)}
                        disabled={loading || (request.status === "approved" || request.status === "denied")}
                      >
                        Deny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerPayments;
