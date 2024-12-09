import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import Modal from "react-modal";
import Loading from "./Loading"; // Import Loading component
import "../Css/ReturnCarForm.css";
import { BASE_URL } from '../ApiConfig'; 
import OwnerAcknowledgement from "./OwnerAcknowledgement.js";

Modal.setAppElement("#root");

function AcknowledgementForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm();
  const [renterProofURL, setRenterProofURL] = useState("");
  const [ownerProof, setOwnerProof] = useState(null);
  const [ownerProofPreviewURL, setOwnerProofPreviewURL] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [error, setError] = useState(null);
  const [showOwnerAcknowledgement, setShowOwnerAcknowledgement] = useState(false);
  const [penalty, setPenalty] = useState("No Penalty");

  useEffect(() => {
    const fetchReturnDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/returnProof/getReturnDetails/${orderId}`
        );
        if (response.status === 200) {
          console.log(response.data);
          setValue("carOwner", response.data.carOwner);
          setValue("renter", response.data.renter);
          setValue("rentStartDate", response.data.rentStartDate);
          setValue("rentEndDate", response.data.rentEndDate);
          setValue("carReturnDate", response.data.carReturnDate);
          setValue("comments", response.data.remarks);

          setPenalty(response.data.penalty > 0 ? `${response.data.penalty}` : "No Penalty");

          if (response.data.proof) {
            setRenterProofURL(`data:image/jpeg;base64,${response.data.proof}`);
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
    setSubmitting(true); // Start submitting
    const formData = new FormData();
    formData.append("ownerProof", ownerProof);
    formData.append("ownerRemark", data.ownerRemark);
    formData.append("ownerApproval", data.ownerApproval ? "true" : "false");

    if (data.penalty > 0) {
      formData.append("penalty", data.penalty);
    }

    try {
      await axios.put(
        `${BASE_URL}/returnProof/updateReturnProof/${orderId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setShowOwnerAcknowledgement(true);
      reset();
      navigate("/history");
    } catch (err) {
      console.error("Error submitting acknowledgment:", err);
      alert("Failed to submit acknowledgment.");
    } finally {
      setSubmitting(false); // End submitting
    }
  };

  return (
    <div>
      <Header />
      <div className="ack-container">
        {loading ? (
          <Loading />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <form className="ack-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Car Return Acknowledgement</h2>
  
            <div className="ack-form-row">
              <div>
                <label>Car Owner:</label>
                <input type="text" {...register("carOwner")} disabled />
              </div>
              <div>
                <label>Renter:</label>
                <input type="text" {...register("renter")} disabled />
              </div>
            </div>
  
            <div className="ack-form-row">
              <div>
                <label>Rent Start Date:</label>
                <input type="date" {...register("rentStartDate")} disabled />
              </div>
              <div>
                <label>Rent End Date:</label>
                <input type="date" {...register("rentEndDate")} disabled />
              </div>
            </div>
  
            <div className="ack-form-row">
              <div>
                <label>Car Return Date:</label>
                <input type="date" {...register("carReturnDate")} disabled />
              </div>
              <div>
                <label>Comments (Renter):</label>
                <textarea {...register("comments")} disabled rows="4" />
              </div>
            </div>
  
            <div className="ack-form-row">
              <div>
                <label>Penalty:</label>
                <input type="text" value={penalty} disabled />
              </div>
            </div>
  
            <div className="ack-form-row">
              <label>Proof of Return (Renter):</label>
              {renterProofURL ? (
                <img src={renterProofURL} alt="Renter Proof" className="ack-uploaded-proof" />
              ) : (
                <p>No proof provided by renter.</p>
              )}
            </div>
  
            <div className="ack-form-row">
              <label>Owner's Remarks:</label>
              <textarea {...register("ownerRemark")} placeholder="Enter your remarks" rows="4" required />
            </div>
  
            <div className="ack-form-row">
              <label>Owner's Proof:</label>
              <input type="file" onChange={handleOwnerProofUpload} accept="image/*" required />
              {ownerProofPreviewURL && (
                <button type="button" className="ack-show-image-button" onClick={toggleModal}>
                  Show Image
                </button>
              )}
            </div>
  
            <div className="ack-form-row">
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
  
            <button type="submit" className="ack-submit-button" disabled={submitting}>
              {submitting ? <Loading /> : "Submit"}
            </button>
          </form>
        )}
      </div>
      {showOwnerAcknowledgement && <OwnerAcknowledgement />}
  
      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        contentLabel="Owner Proof"
        className="ack-modal"
        overlayClassName="ack-modal-overlay"
      >
        <button className="ack-close-modal-button" onClick={toggleModal}>
          Close
        </button>
        {ownerProofPreviewURL ? (
          <img src={ownerProofPreviewURL} alt="Owner Proof Preview" className="ack-modal-image" />
        ) : (
          <p>No image uploaded yet.</p>
        )}
      </Modal>
    </div>
  );  
}

export default AcknowledgementForm;
