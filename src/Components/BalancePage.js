import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../Css/BalancePage.css';
import Header from '../Components/Header';

const BalancePage = () => {
  const [walletData, setWalletData] = useState({
    credit: 0,
    debit: 0,
    refundable: 0,
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [fullName, setFullName] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [formError, setFormError] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
    }
  }, []);

  const fetchWalletData = useCallback(async (id) => {
    try {
      setIsLoading(true);
  
      const response = await axios.get(
        `http://localhost:8080/ownerWallet/getWalletDetails/${id}`
      );
  
      const { onlineEarning, cashEarning, cashRefundable } = response.data;
  
      setWalletData({
        credit: cashEarning, // Outstanding balance (15%)
        debit: onlineEarning, // Withdrawable balance (85%)
        refundable: cashRefundable, // Cancelled orders or refunds
      });
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  const fetchUserRequests = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/request-form/getUserRequests/${id}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching user requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  useEffect(() => {
    if (userId) {
      fetchWalletData(userId);
      fetchUserRequests(userId);
    }
  }, [userId, fetchWalletData, fetchUserRequests]);  

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!userId || !requestType || !amount) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (requestType === 'gcash' && (!fullName || !gcashNumber)) {
      setFormError('Please fill in the required GCash fields.');
      return;
    }
    if (
      requestType === 'bank' &&
      (!accountName ||
        !bankName ||
        !accountNumber ||
        accountNumber.length < 10 ||
        accountNumber.length > 12)
    ) {
      setFormError('Please fill in the required Bank fields.');
      return;
    }

    let requestData = {
      requestType,
      amount: parseFloat(amount),
    };
    if (requestType === 'gcash') {
      requestData.fullName = fullName;
      requestData.gcashNumber = gcashNumber;
    }
    if (requestType === 'bank') {
      requestData.accountName = accountName;
      requestData.bankName = bankName;
      requestData.accountNumber = accountNumber;
    }

    try {
      await axios.post(
        `http://localhost:8080/request-form/request-funds?userId=${userId}`,
        requestData
      );
      await fetchWalletData(userId);
      await fetchUserRequests(userId);
      alert('Request submitted successfully!');
      setIsFormOpen(false);
    } catch (error) {
      alert('Failed to submit the request.');
      console.error(error);
    }
  };

  const refreshWalletData = async () => {
    if (userId) {
      await fetchWalletData(userId);
      await fetchUserRequests(userId);
    }
  };

  return (
    <div className="balance-page">
      <Header />
      <div className="dashboard-cards-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="card">
              <h2>Total Outstanding Balance</h2>
              <p>
                ₱
                {walletData.credit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </p>
            </div>
            <div className="card">
              <h2>Total Online Earnings (Withdrawable)</h2>
              <p>
                ₱
                {walletData.debit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </p>
            </div>
            <div className="card">
              <h2>Cancelled/Terminated Orders</h2>
              <p>
                ₱
                {walletData.refundable.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || '0.00'}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="request-container">
        <button onClick={toggleForm} className="request-funds-btn">
          {isFormOpen ? 'Close Request Form' : 'Request Funds'}
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
            {requestType === 'gcash' && (
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
            {requestType === 'bank' && (
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
                Available Balance: ₱{walletData.credit?.toFixed(2) || '0.00'}
              </small>
            </div>
            <button type="submit" className="submit-btn">
              Submit Request
            </button>
          </form>
        )}
      </div>
      <div className="request-log">
        <h3>Your Requests</h3>
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
                <tr key={request.requestId}>
                  <td>{request.requestType}</td>
                  <td>
                    {request.requestType === 'gcash' ? (
                      <>
                        <strong>Full Name:</strong> {request.fullName}
                        <br />
                        <strong>GCash Number:</strong> {request.gcashNumber}
                      </>
                    ) : request.requestType === 'bank' ? (
                      <>
                        <strong>Account Name:</strong> {request.accountName}
                        <br />
                        <strong>Bank Name:</strong> {request.bankName}
                        <br />
                        <strong>Account Number:</strong>{' '}
                        {request.accountNumber}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>₱{request.amount.toFixed(2)}</td>
                  <td>
                    {new Date(request.createdAt).toLocaleString('en-US')}
                  </td>
                  <td>
                    <span
                      className={
                        request.status === 'approved'
                          ? 'status-approved'
                          : request.status === 'denied'
                          ? 'status-denied'
                          : 'status-pending'
                      }
                    >
                      {request.status || 'pending'}
                    </span>
                  </td>
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
      <div className="refresh-container">
        <button onClick={refreshWalletData} className="refresh-btn">
          Refresh Balance
        </button>
      </div>
    </div>
  );
};

export default BalancePage;
