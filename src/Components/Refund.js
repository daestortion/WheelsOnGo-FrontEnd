import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../Css/Refund.css";
import Header from "../Components/Header";
import { BASE_URL } from "../ApiConfig";
import RefundPopup from "./RefundPopup";
import Loading from "./Loading";

const RefundPage = () => {
  const [walletData, setWalletData] = useState({
    refundAmount: 0,
    terminationFee: 0,
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [fullName, setFullName] = useState("");
  const [gcashNumber, setGcashNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedProofImage, setSelectedProofImage] = useState(null);
  const [showRefundPopup, setShowRefundPopup] = useState(false);

  // Fetch wallet data (including refund amount)
  const fetchWalletData = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_URL}/wallet/getRefundDetails/${userId}`
      );
      setWalletData({
        refundAmount: response.data.refundAmount || 0,
        terminationFee: response.data.terminationFee || 0,
      });
    } catch (error) {
      console.error("Error fetching refund details:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user's previous refund requests
  const fetchUserRequests = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/request-form/getUserRequests/${userId}`
      );
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    }
  }, []);

  // Initialize user data on component load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
      fetchWalletData(parsedUser.userId);
      fetchUserRequests(parsedUser.userId);
      localStorage.setItem("userType", "Renter"); // Set the user type to Renter
    } else {
      console.error("User not found in local storage.");
      setIsLoading(false);
    }
  }, [fetchWalletData, fetchUserRequests]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  // Fetch proof image
  const handleShowProof = async (requestId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/request-form/getProofImage/${requestId}`,
        { responseType: "arraybuffer" } // To handle binary data
      );
  
      // Convert the ArrayBuffer to a Base64 string
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
  
      setSelectedProofImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error("Error fetching proof image:", error);
      alert("Failed to load proof image.");
    }
  };  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!userId || !requestType || !amount) {
      setFormError("Please fill in all required fields.");
      return;
    }

    if (parseFloat(amount) > walletData.refundAmount) {
      setFormError("Amount exceeds available refund balance.");
      return;
    }

    if (requestType === "gcash" && (!fullName || !gcashNumber)) {
      setFormError("Please fill in the required GCash fields.");
      return;
    }

    if (
      requestType === "bank" &&
      (!accountName ||
        !bankName ||
        !accountNumber ||
        accountNumber.length < 10 ||
        accountNumber.length > 12)
    ) {
      setFormError("Please fill in the required Bank fields.");
      return;
    }

    const requestData = {
      requestType,
      amount: parseFloat(amount),
      userType: localStorage.getItem("userType"),
      ...(requestType === "gcash" && { fullName, gcashNumber }),
      ...(requestType === "bank" && { accountName, bankName, accountNumber }),
    };

    setIsLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/request-form/request-refund/${userId}`,
        requestData
      );
      await fetchWalletData(userId);
      await fetchUserRequests(userId);
      setShowRefundPopup(true);
      setIsFormOpen(false);
    } catch (error) {
      alert("Failed to submit the refund request.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="refund-page">
      <Header />
      <div className="dashboard-cards-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="cards">
            <h2>Total Refundable Amount</h2>
            <p>
              ₱
              {walletData.refundAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
        )}
      </div>

      <div className="refund-note">
        <p>
          <strong>Refund Terms:</strong>
          <br />
          - If canceled 3+ days before booking, 85% refundable.
          <br />
          - 1-2 days before booking, 50% refundable.
          <br />
          - On the day of booking, no refund.
        </p>
      </div>

      <div className="request-container">
        <button onClick={toggleForm} className="request-funds-btn">
          {isFormOpen ? "Close Refund Request Form" : "Request Refund"}
        </button>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="request-funds-form">
            {formError && <p className="form-error">{formError}</p>}
            <div className="form-group">
              <label htmlFor="requestType">Request Type:</label>
              <select
                id="requestType"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="gcash">GCash</option>
                <option value="bank">Bank</option>
              </select>
            </div>
            {/* Dynamic Form Fields */}
            {requestType === "gcash" && (
              <>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name:</label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gcashNumber">GCash Phone Number:</label>
                  <input
                    id="gcashNumber"
                    type="text"
                    value={gcashNumber}
                    onChange={(e) => setGcashNumber(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            {requestType === "bank" && (
              <>
                <div className="form-group">
                  <label htmlFor="accountName">Account Name:</label>
                  <input
                    id="accountName"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bankName">Choose Bank:</label>
                  <select
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="BPI">BPI</option>
                    <option value="Unionbank">Unionbank</option>
                    <option value="BDO">BDO</option>
                    <option value="Metrobank">Metrobank</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="accountNumber">Account Number:</label>
                  <input
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    maxLength={12}
                    minLength={10}
                  />
                </div>
              </>
            )}
              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <small>
                  Available Refundable Amount: ₱
                  {walletData.refundAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "0.00"}
                </small>
              </div>
            <button type="submit" className="submit-btn">
              Submit Refund Request
            </button>
          </form>
        )}
      </div>

      <div className="request-log">
        <h3>Your Refund Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Request Type</th>
              <th>Details</th>
              <th>Amount</th>
              <th>Submitted On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.requestId}>
                  <td>{request.requestType}</td>
                  <td>
                    {request.requestType === "gcash"
                      ? `GCash - ${request.gcashNumber} (${request.fullName})`
                      : `Bank - ${request.bankName} (${request.accountName}) - ${request.accountNumber}`}
                  </td>
                  <td>₱{request.amount.toLocaleString("en-US")}</td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>{request.status}</td>
                  <td>
                    {request.proofImage ? (
                      <button
                      className="return-cars"
                        onClick={() => handleShowProof(request.requestId)}
                      >
                        Show Proof
                      </button>
                    ) : (
                      "No Proof Available"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Proof Image Modal */}
      {selectedProofImage && (
        <div className="proof-modal">
          <div className="proof-modal-content">
            <img src={selectedProofImage} alt="Proof" />
            <button onClick={() => setSelectedProofImage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefundPage;
