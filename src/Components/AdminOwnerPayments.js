import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminOwner.css";
import sidelogo from "../Images/sidelogo.png";
import Loading from "./Loading";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const AdminOwnerPayments = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false); // Track if data has been fetched
  const [uploadedFileNames, setUploadedFileNames] = useState({}); // Track uploaded file names for each row
  const navigate = useNavigate();

  // Step 1: Retrieve uploaded file names from localStorage on component mount
  useEffect(() => {
    const savedFileNames = JSON.parse(localStorage.getItem("uploadedFileNames"));
    if (savedFileNames) {
      setUploadedFileNames(savedFileNames);
    }
  }, []);

  // Fetch data for requests
  const fetchRequests = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/request-form/getAllRequests`)
      .then((response) => {
        console.log("Fetched payment requests:", response.data);
        setRequests(response.data);
        setHasFetchedOnce(true); // Mark data as fetched
      })
      .catch((error) => {
        console.error("Error fetching payment requests:", error);
        setRequests([]); // Clear requests on error
      })
      .finally(() => setLoading(false));
  };

  const handleApprove = async (requestId) => {
    setLoading(true);
    try {
      const request = requests.find((r) => r.requestId === requestId);
      if (!request) {
        alert("Request not found.");
        return;
      }

      if (request.userType === "Renter") {
        // Approve Renter's refund request
        const renterResponse = await axios.put(
          `${BASE_URL}/request-form/approve-renter-refund/${requestId}`
        );
        if (renterResponse.status === 200) {
          alert("Renter refund request approved!");
        } else {
          alert("Error approving renter refund: " + renterResponse.data);
        }
      } else if (request.userType === "Car Owner") {
        // Approve Car Owner's request
        await axios.put(`${BASE_URL}/request-form/approveRequest/${requestId}`);

        // Deduct funds from the owner's wallet
        const userId = request.user.userId;
        const ownerResponse = await axios.put(
          `${BASE_URL}/ownerWallet/deductFromOnlineEarnings/${userId}/${requestId}`
        );

        if (ownerResponse.status === 200) {
          alert("Car Owner's request approved and funds successfully deducted!");
        } else {
          alert("Error deducting funds from Car Owner's wallet: " + ownerResponse.data);
        }
      } else {
        alert("Unsupported User Type.");
      }

      fetchRequests(); // Refresh the requests after approval

    } catch (error) {
      console.error("Error approving request:", error);
      alert("Error processing approval: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async (requestId) => {
    setLoading(true);
    try {
      await axios.put(`${BASE_URL}/request-form/denyRequest/${requestId}`);


      fetchRequests(); // Refresh the requests after denial
      alert("Request denied successfully!");
    } catch (error) {
      console.error("Error denying request:", error);
      alert("Error processing denial: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFunds = (requestId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        setUploadedFileNames((prev) => {
          const updated = { ...prev, [requestId]: file.name };
          localStorage.setItem("uploadedFileNames", JSON.stringify(updated)); // Step 1: Store in localStorage
          return updated;
        });

        try {
          setLoading(true);
          const formData = new FormData();
          formData.append("proofImage", file); // Add the selected file
          await axios.put(
            `${BASE_URL}/request-form/update/${requestId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          alert("Proof image uploaded successfully!");
          fetchRequests(); // Refresh the requests after uploading the proof
        } catch (error) {
          console.error("Error uploading proof image:", error);
          alert("Error uploading proof image. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fileInput.click(); // Open the file picker dialog
  };

  const handleLogout = () => {
    navigate("/adminlogin");
  };

  return (
    <div className="admin-owner-payments-page">
      {loading && <Loading />}
      {/* Topbar */}
      <div className="admin-owner-dashboard-topbar">
        <img
          className="admin-owner-dashboard-logo"
          alt="Wheels On Go Logo"
          src={sidelogo}
        />
        <button className="admin-owner-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Sidebar */}
      <div className="admin-owner-dashboard-wrapper">
        <div className="admin-owner-dashboard-sidebar">
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/adminusers")}
          >
            Users
          </button>
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/admincars")}
          >
            Cars
          </button>
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/adminverify")}
          >
            Verifications
          </button>
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/adminorder")}
          >
            Transactions
          </button>
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/adminreport")}
          >
            Reports
          </button>
          <button
            className="admin-owner-dashboard-menu-item"
            onClick={() => navigate("/admin-payments")}
          >
            Payments
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/activitylogs")}
          >
            Activity Logs
          </button>
        </div>

        {/* Main Content */}
        <div className="admin-owner-dashboard-content">
          {/* Fetch Data Button */}
          <div className="fetch-data-container">
            <button className="fetch-data-btn" onClick={fetchRequests}>
              Fetch Data
            </button>
          </div>

          <h2 className="admin-owner-content-title">Withdrawal Requests</h2>

          {/* Payments Table */}
          <div className="owner-payments-table-container">
            <table className="owner-payments-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>User Type</th>
                  <th>Request Type</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Send Funds</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={request.requestId}>
                      <td>{request.requestId}</td>
                      <td>{request.user.username}</td>
                      <td>{request.userType}</td> {/* Display the userType here */}
                      <td>
                        {request.requestType === "gcash" ? (
                          <>
                            <strong>Full Name:</strong> {request.fullName || "N/A"}
                            <br />
                            <strong>GCash Number:</strong>{" "}
                            {request.gcashNumber || "N/A"}
                          </>
                        ) : request.requestType === "bank" ? (
                          <>
                            <strong>Account Name:</strong>{" "}
                            {request.fullName || "N/A"}
                            <br />
                            <strong>Bank Name:</strong>{" "}
                            {request.bankName || "N/A"}
                            <br />
                            <strong>Account Number:</strong>{" "}
                            {request.accountNumber || "N/A"}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        ₱
                        {request.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td>{new Date(request.createdAt).toLocaleString()}</td>
                      <td>{request.status || "pending"}</td>
                      <td>
                        <button
                          className="button-approve"
                          onClick={() => handleApprove(request.requestId)}
                          disabled={loading || request.status !== "pending" || !uploadedFileNames[request.requestId]}
                        >
                          Approve
                        </button>
                        <button
                          className="button-deny"
                          onClick={() => handleDeny(request.requestId)}
                          disabled={loading || request.status !== "pending" || !uploadedFileNames[request.requestId]}
                        >
                          Deny
                        </button>
                      </td>
                      <td>
                        <button
                          className="send-funds"
                          onClick={() => handleSendFunds(request.requestId)}
                        >
                          Send Funds
                        </button>
                        {uploadedFileNames[request.requestId] && (
                          <p>Uploaded File: {uploadedFileNames[request.requestId]}</p>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      {hasFetchedOnce
                        ? "No payment requests found."
                        : "Click 'Fetch Data' to load payment requests."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerPayments;
