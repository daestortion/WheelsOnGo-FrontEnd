import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminOwner.css"; // Unique CSS for AdminOwnerPayments
import sidelogo from "../Images/sidelogo.png"; // Logo image

const AdminOwnerPayments = () => {
  const [requests, setRequests] = useState([]); // Store payment requests
  const [loading, setLoading] = useState(false); // Add loading state to disable buttons during requests
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all payment requests
  const fetchRequests = () => {
    setLoading(true); // Start loading
    axios
      .get("http://localhost:8080/wallet/getAllRequests") // Correct endpoint
      .then((response) => {
        console.log('Fetched payment requests:', response.data); // Add console log for debugging
        setRequests(response.data); // Set the fetched request data
      })
      .catch((error) => {
        console.error("Error fetching payment requests:", error);
        setRequests([]); // Handle error by clearing the requests
      })
      .finally(() => setLoading(false)); // Stop loading
  };

  // Handle approve request
  const handleApprove = async (requestId, userId, amountRequested) => {
    setLoading(true);
    try {
      console.log("Request ID:", requestId);
      console.log("User ID:", userId); // Log to ensure userId is not undefined
      console.log("Amount Requested:", amountRequested);

      if (!userId) {
        throw new Error("Invalid user ID");
      }

      // Approve the request first
      await axios.put(`http://localhost:8080/wallet/approveRequest/${requestId}`);

      // Fetch current wallet data for the user to get the total credit
      const walletResponse = await axios.get(`http://localhost:8080/wallet/credit/${userId}`);
      let currentCredit = walletResponse.data;

      console.log("Current Credit before approval:", currentCredit);

      // Deduct the requested amount from the user's total credit
      let updatedCredit = currentCredit - amountRequested;

      if (updatedCredit < 0) {
        alert("Insufficient credit balance to approve the request!");
        setLoading(false);
        return;
      }

      console.log(`Deducting ${amountRequested} from current credit. New credit: ${updatedCredit}`);

      // Update the user's wallet with the new credit balance
      await axios.put(`http://localhost:8080/wallet/${userId}`, {
        credit: updatedCredit,
      });

      // Trigger wallet recalculation after approving and updating credit
      await axios.put(`http://localhost:8080/wallet/recalculate/${userId}`);

      // Fetch updated requests and refresh UI
      fetchRequests();

      alert("Request approved and wallet updated successfully!");
    } catch (error) {
      console.error("Error approving request or updating wallet:", error);
      alert("Error processing approval: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deny request
  const handleDeny = (requestId) => {
    setLoading(true);
    axios
      .put(`http://localhost:8080/wallet/denyRequest/${requestId}`)
      .then(() => {
        fetchRequests(); // Refresh the list of requests
        alert("Request denied successfully!");
      })
      .catch((error) => {
        console.error("Error denying request:", error);
        alert("Error denying request: " + error.message);
      })
      .finally(() => setLoading(false));
  };

  // Logout handler
  const handleLogout = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="admin-owner-payments-page">
      {/* Topbar */}
      <div className="admin-owner-dashboard-topbar">
        <img className="admin-owner-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-owner-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className="admin-owner-dashboard-wrapper">
        <div className="admin-owner-dashboard-sidebar">
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admin-dashboard")}>
            Dashboard
          </button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminusers")}>
            Users
          </button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admincars")}>
            Cars
          </button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminverify")}>
            Verifications
          </button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminorder")}>
            Transactions
          </button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/adminreport")}>
            Reports
          </button>
          <button className="admin-owner-dashboard-menu-item" onClick={() => navigate("/admin-payments")}>
            Payments
          </button>
        </div>

        {/* Main Content */}
        <div className="admin-owner-dashboard-content">
          <h2 className="admin-owner-content-title">Owner Payments Requests</h2>

          {/* Requests Table */}
          <div className="owner-payments-table-container">
            <table className="owner-payments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Request Type</th>
                  <th>Full Name/Account Name</th>
                  <th>Amount</th>
                  <th>Submitted On</th>
                  <th>Status</th> {/* New Status Column */}
                  <th>Action</th> {/* Action Buttons */}
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.requestId}>
                    <td>{request.requestId}</td>
                    <td>{request.user.username}</td>
                    <td>{request.requestType}</td>
                    <td>{request.fullName || request.bankName}</td>
                    <td>₱{request.amount.toFixed(2)}</td>
                    <td>{new Date(request.createdAt).toLocaleString()}</td>
                    <td>{request.status || "pending"}</td> {/* Default status to pending if missing */}
                    <td>
                      <button
                        className="button-approve"
                        onClick={() => handleApprove(request.requestId, request.user.userId, request.amount)} // Pass userId and amount
                        disabled={loading || (request.status === "approved" || request.status === "denied")} // Only disable for approved/denied
                      >
                        Approve
                      </button>
                      <button
                        className="button-deny"
                        onClick={() => handleDeny(request.requestId)}
                        disabled={loading || (request.status === "approved" || request.status === "denied")} // Only disable for approved/denied
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
