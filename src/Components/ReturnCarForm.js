import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Header from "../Components/Header";
import Modal from "react-modal";
import "../Css/ReturnCarForm.css";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary
import OwnerAcknowledgement from "./OwnerAcknowledgement.js";

Modal.setAppElement("#root");

function AcknowledgementForm() {
  const { orderId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const { register, handleSubmit, reset, setValue } = useForm();
  const [renterProofURL, setRenterProofURL] = useState("");
  const [ownerProof, setOwnerProof] = useState(null);
  const [ownerProofPreviewURL, setOwnerProofPreviewURL] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOwnerAcknowledgement, setShowOwnerAcknowledgement] = useState(false);

  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/returnProof/getReturnDetails/${orderId}`
        );
        if (response.status === 200) {
          setValue("carOwner", response.data.carOwner);
          setValue("renter", response.data.renter);
          setValue("rentStartDate", response.data.rentStartDate);
          setValue("rentEndDate", response.data.rentEndDate);
          setValue("carReturnDate", response.data.carReturnDate);
          setValue("comments", response.data.remarks);
  
          if (response.data.proof) {
            setRenterProofURL(`data:image/jpeg;base64,${response.data.proof}`);
          }
  
          // Check if there's a penalty and log it to the console
          if (response.data.penalty > 0) {
            // console.log(`Penalty amount: ${response.data.penalty}`);
          }
        }
      } catch (err) {
        setError("Failed to fetch renter details.");
        console.error("Error fetching renter data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReturnDetails();
  }, [orderId, setValue]);
  

  const handleOwnerProofUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOwnerProof(file);
      setOwnerProofPreviewURL(URL.createObjectURL(file));
    }
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("ownerProof", ownerProof);
    formData.append("ownerRemark", data.ownerRemark);
    formData.append("ownerApproval", data.ownerApproval ? "true" : "false");
    
    // Only append penalty if it's greater than 0
    if (data.penalty > 0) {
        formData.append("penalty", data.penalty);
    }

    try {
        await axios.put(
            `${BASE_URL}/returnProof/updateReturnProof/${orderId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        // console.log("Acknowledgment submitted successfully!");
        setShowOwnerAcknowledgement(true);
        reset();
        navigate("/history"); // Redirect to history page
    } catch (err) {
        console.error("Error submitting acknowledgment:", err);
        alert("Failed to submit acknowledgment.");
    }
};

  return (
    <div>
      <Header />
      <div className="acknowledgement-form-container">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <form className="acknowledgement-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Car Return Acknowledgement</h2>

            <div className="form-row">
              <div>
                <label>Car Owner:</label>
                <input type="text" {...register("carOwner")} disabled />
              </div>
              <div>
                <label>Renter:</label>
                <input type="text" {...register("renter")} disabled />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Rent Start Date:</label>
                <input type="date" {...register("rentStartDate")} disabled />
              </div>
              <div>
                <label>Rent End Date:</label>
                <input type="date" {...register("rentEndDate")} disabled />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Car Return Date:</label>
                <input type="date" {...register("carReturnDate")} disabled />
              </div>
              <div>
                <label>Comments (Renter):</label>
                <textarea {...register("comments")} disabled rows="4" />
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
              <textarea {...register("ownerRemark")} placeholder="Enter your remarks" rows="4" required />
            </div>

            <div className="form-row">
              <label>Owner's Proof:</label>
              <input type="file" onChange={handleOwnerProofUpload} accept="image/*" required />
              {ownerProofPreviewURL && (
                <button type="button" className="show-image-button" onClick={toggleModal}>
                  Show Image
                </button>
              )}
            </div>

            <div className="form-row">
              <div>
                <label>
                  <input
                    type="checkbox"
                    {...register("ownerApproval", { required: true })}
                  />
                  &nbsp; I approve the return.
                </label>
              </div>
            </div>

            <button type="submit" className="submit-buttons">
              Submit
            </button>
          </form>
        )}
      </div>
      {showOwnerAcknowledgement && <OwnerAcknowledgement />}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        contentLabel="Owner Proof"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button className="close-modal-button" onClick={toggleModal}>
          Close
        </button>
        {ownerProofPreviewURL ? (
          <img src={ownerProofPreviewURL} alt="Owner Proof Preview" className="modal-image" />
        ) : (
          <p>No image uploaded yet.</p>
        )}
      </Modal>
    </div>
  );
}

export default AcknowledgementForm;
