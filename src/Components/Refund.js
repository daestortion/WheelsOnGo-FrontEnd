import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../Css/Refund.css";
import Header from "../Components/Header";

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

  const fetchWalletData = useCallback(async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://wheelsongo-backend.onrender.com/wallet/getRefundDetails/${userId}`
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

  const fetchUserRequests = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `https://wheelsongo-backend.onrender.com/request-form/getUserRequests/${userId}`
      );
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    }
  }, []); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);

      fetchWalletData(parsedUser.userId);
      fetchUserRequests(parsedUser.userId);
    } else {
      console.error("User not found in local storage.");
      setIsLoading(false);
    }
  }, [fetchWalletData, fetchUserRequests]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

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
      ...(requestType === "gcash" && { fullName, gcashNumber }),
      ...(requestType === "bank" && { accountName, bankName, accountNumber }),
    };

    try {
      await axios.post(
        `https://wheelsongo-backend.onrender.com/request-form/request-funds?userId=${userId}`,
        requestData
      );
      await fetchWalletData(userId);
      await fetchUserRequests(userId);
      alert("Refund request submitted successfully!");
      setIsFormOpen(false);
    } catch (error) {
      alert("Failed to submit the refund request.");
      console.error(error);
    }
  };

  return (
    <div className="refund-page">
      <Header />
      <div className="dashboard-cards-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="cards">
              <h2>Total Refund Amount</h2>
              <p>
                ₱
                {walletData.refundAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "0.00"}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="refund-note">
        <p>
          <strong>Refund Terms:</strong>
          <br />
          - If the order is terminated/canceled 3 or more days before the booking date, only 85% of the total amount paid is refundable.
          <br />
          - If canceled 1 to 2 days before the booking date, only 50% of the total amount paid is refundable.
          <br />
          - If canceled on the day of the booking, there is no refund.
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
                    placeholder="10-12 digit account number"
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
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.requestType}</td>
                  <td>
                    {request.requestType === "gcash" ? (
                      <>
                        GCash - {request.gcashNumber} ({request.fullName})
                      </>
                    ) : (
                      <>
                        Bank - {request.bankName} ({request.accountName}) - {request.accountNumber}
                      </>
                    )}
                  </td>
                  <td>₱{request.amount.toLocaleString("en-US")}</td>
                  <td>{new Date(request.createdAt).toLocaleString()}</td>
                  <td>{request.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundPage;
