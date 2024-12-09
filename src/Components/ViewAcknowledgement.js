import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import Loading from './Loading';
import "../Css/ReturnCarForm.css";
import { BASE_URL } from '../ApiConfig';

function ViewAcknowledgement() {
  const { orderId } = useParams();
  const [returnDetails, setReturnDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renterProofURL, setRenterProofURL] = useState("");
  const [ownerProofURL, setOwnerProofURL] = useState("");

  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/returnProof/getReturnDetails/${orderId}`
        );
        if (response.status === 200) {
          setReturnDetails(response.data);
          console.log(response.data);
          if (response.data.proof) {
            setRenterProofURL(`data:image/jpeg;base64,${response.data.proof}`);
          }

          if (response.data.ownerProof) {
            setOwnerProofURL(`data:image/jpeg;base64,${response.data.ownerProof}`);
          }
        }
      } catch (err) {
        setError("Failed to fetch return details.");
        console.error("Error fetching return details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnDetails();
  }, [orderId]);

  return (
    <div>
      <Header />
      <div className="acknowledgement-form-container">
        {loading ? (
          <Loading />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="acknowledgement-form">
            <h2>Car Return Acknowledgement</h2>

            <div className="form-row">
              <div>
                <label>Car Owner:</label>
                <input type="text" value={returnDetails.carOwner} disabled />
              </div>
              <div>
                <label>Renter:</label>
                <input type="text" value={returnDetails.renter} disabled />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Rent Start Date:</label>
                <input type="date" value={returnDetails.rentStartDate} disabled />
              </div>
              <div>
                <label>Rent End Date:</label>
                <input type="date" value={returnDetails.rentEndDate} disabled />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Car Return Date:</label>
                <input type="date" value={returnDetails.carReturnDate} disabled />
              </div>
              <div>
                <label>Comments (Renter):</label>
                <textarea value={returnDetails.remarks} disabled rows="4" />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Penalty:</label>
                <input type="text" value={returnDetails.penalty > 0 ? `Penalty: $${returnDetails.penalty}` : "No Penalty"} disabled />
              </div>
            </div>

            <div className="form-row">
              <label>Proof of Return (Renter):</label>
              {renterProofURL ? (
                <img src={renterProofURL} alt="Renter Proof" className="uploaded-proof" />
              ) : (
                <p>No proof provided by renter.</p>
              )}
            </div>

            <div className="form-row">
              <label>Owner's Remarks:</label>
              <textarea value={returnDetails.remarks} disabled rows="4" />
            </div>

            <div className="form-row">
              <label>Owner's Proof:</label>
              {ownerProofURL ? (
                <img src={ownerProofURL} alt="Owner Proof" className="uploaded-proof" />
              ) : (
                <p>No proof provided by owner.</p>
              )}
            </div>

            <div className="form-row">
              <label>Owner Approval:</label>
              <input type="checkbox" checked={returnDetails.ownerApproval} disabled />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAcknowledgement;
