import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../Css/BalancePage.css'; // For styling
import Header from "../Components/Header"; // Import Header component

const BalancePage = () => {
  const [walletData, setWalletData] = useState({
    credit: 0,
    debit: 0,
    refundable: 0,
  });
  const [userId, setUserId] = useState(null); // Store user ID
  const [isLoading, setIsLoading] = useState(true); // Loading state to show loading indicator
  const [isFormOpen, setIsFormOpen] = useState(false); // State to toggle form visibility
  const [requestType, setRequestType] = useState(''); // For the dropdown value
  const [fullName, setFullName] = useState(''); // Full name for GCash
  const [gcashNumber, setGcashNumber] = useState(''); // GCash number
  const [bankName, setBankName] = useState(''); // Bank name for Bank request
  const [accountName, setAccountName] = useState(''); // Account name for Bank request
  const [accountNumber, setAccountNumber] = useState(''); // Account number for Bank request
  const [amount, setAmount] = useState(''); // Amount to request
  const [formError, setFormError] = useState(null); // To display form errors

  // Fetch user data from localStorage when the component loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Fetched user data from localStorage:', parsedUser);
      setUserId(parsedUser.userId); // Set the user ID from local storage
    } else {
      console.log('No user data found in localStorage');
    }
  }, []);

  // Fetch wallet data from the backend API using Axios
  const fetchWalletData = useCallback(async (id) => {
    try {
      setIsLoading(true);  // Show loading state
      const [creditRes, debitRes, refundableRes] = await Promise.all([
        axios.get(`https://tender-curiosity-production.up.railway.app/wallet/credit/${id}`),  // Fetch current balance without recalculation
        axios.get(`https://tender-curiosity-production.up.railway.app/wallet/debit/${id}`),
        axios.get(`https://tender-curiosity-production.up.railway.app/wallet/refundable/${id}`)
      ]);
  
      // Update the state with fetched data
      setWalletData({
        credit: creditRes.data,
        debit: debitRes.data,
        refundable: refundableRes.data,
      });
  
      console.log("Updated walletData state:", {
        credit: creditRes.data,
        debit: debitRes.data,
        refundable: refundableRes.data,
      });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);  // Hide loading state
    }
  }, []);
  

  // Fetch wallet data without recalculating when page loads
  useEffect(() => {
    if (userId) {
      console.log('User ID available, fetching wallet data without recalculation...');
      fetchWalletData(userId);  // Fetch wallet data directly
    }
  }, [userId, fetchWalletData]);

  // Toggle form visibility
  const toggleForm = () => {
    console.log('Toggling request form visibility. Current state:', isFormOpen);
    setIsFormOpen(!isFormOpen);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Reset any previous error
    console.log('Form submitted with requestType:', requestType);

    // Validate the form based on request type
    if (!userId || !requestType || !amount) {
      setFormError("Please fill in all required fields.");
      console.log('Form validation error: missing fields.');
      return;
    }

    // GCash request validation
    if (requestType === 'gcash' && (!fullName || !gcashNumber)) {
      setFormError("Please fill in the required GCash fields.");
      console.log('GCash validation error: missing fields.');
      return;
    }

    // Bank request validation
    if (requestType === 'bank' && (!accountName || !bankName || !accountNumber || accountNumber.length < 10 || accountNumber.length > 12)) {
      setFormError("Please fill in the required Bank fields and ensure the account number is between 10 and 12 digits.");
      console.log('Bank validation error: invalid fields.');
      return;
    }

    // Prepare data for submission
    let requestData = {
      userId,
      requestType,
      amount: parseFloat(amount),
    };

    // Add GCash-specific fields
    if (requestType === 'gcash') {
      requestData.fullName = fullName;
      requestData.gcashNumber = gcashNumber;
    }

    // Add Bank-specific fields
    if (requestType === 'bank') {
      requestData.accountName = accountName;  // Account Name field for Bank requests
      requestData.bankName = bankName;
      requestData.accountNumber = accountNumber;
    }

    console.log('Submitting request data:', requestData);

    // Send the request to the backend
    try {
      await axios.post('https://tender-curiosity-production.up.railway.app/wallet/request-funds', requestData);
      
      // Fetch updated wallet data after submitting a request without recalculation
      await fetchWalletData(userId);

      alert('Request submitted successfully!');
      setIsFormOpen(false); // Close the form after submission
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit the request.');
    }
  };

  // Handle approve request
  const handleApprove = async (requestId) => {
    try {
      await axios.put(`https://tender-curiosity-production.up.railway.app/wallet/approveRequest/${requestId}`);
      
      // Fetch updated wallet data after approval without recalculating
      await fetchWalletData(userId);
      
      alert('Request approved successfully!');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request.');
    }
  };

  return (
    <div className="balance-page">
      <Header />

      {/* Dashboard cards */}
      <div className="dashboard-cards-container">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="card">
              <h2>Total Credit</h2>
              <p>₱{walletData.credit.toFixed(2)}</p>
            </div>
            <div className="card">
              <h2>Total Debit</h2>
              <p>₱{walletData.debit.toFixed(2)}</p>
            </div>
            <div className="card">
              <h2>Total Refundable</h2>
              <p>₱{walletData.refundable.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>

      {/* Request Funds Button & Form */}
      <div className="request-container">
        <button onClick={toggleForm} className="request-funds-btn">
          {isFormOpen ? 'Close Request Form' : 'Request Funds'}
        </button>

        {/* Show form when isFormOpen is true */}
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

            {/* GCash Fields */}
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

            {/* Bank Fields */}
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
              <small>Available Balance: ₱{walletData.credit.toFixed(2)}</small> {/* Show Credit Balance */}
            </div>
            <button type="submit" className="submit-btn">Submit Request</button>
          </form>
        )}
      </div>

      {/* Wallet Balance Table */}
      <div className="balance-container">
        <h1>User Wallet Balance</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="balance-table">
            <thead>
              <tr>
                <th>Credit</th>
                <th>Debit</th>
                <th>Refundable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₱{walletData.credit.toFixed(2)}</td>
                <td>₱{walletData.debit.toFixed(2)}</td>
                <td>₱{walletData.refundable.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BalancePage;
