import React from 'react';
import "../Css/ViewPaymentPopup.css";

const ViewPaymentPopup = ({ onClose, payments }) => {
    const handleOkClick = () => {
      onClose();
    };

  return (
    <div className="view-payment-popup1q">
      <div className="overlap1q">
        <h1 className="ok-text-wrapper1q">Payments for Order</h1>
        {payments && payments.length > 0 ? (
          <ul className="payments-list">
            {payments.map((payment) => (
              <li className="payment-item" key={payment.paymentId}>
                <p>Amount: ₱{payment.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>Date: {new Date(payment.paymentDate).toLocaleDateString()}</p>
                <p>Status: {payment.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No payments found for this order.</p>
        )}
        <button className="overlap-group231q" onClick={handleOkClick}>
          <span className="ok-div1q">OK</span>
        </button>
      </div>
    </div>
  );
};

export default ViewPaymentPopup;
