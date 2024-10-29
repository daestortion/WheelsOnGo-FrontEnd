import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../Components/Header"; // Import the Header component
import "../Css/ReturnCarForm.css";

function AcknowledgementForm() {
  const { register, handleSubmit, reset } = useForm();
  const [images, setImages] = useState([]);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    reset(); // Reset form after submission
  };

  // Function to handle file input
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...fileURLs]);
  };

  return (
    <div>
      <Header /> {/* Display Header */}
      <div className="acknowledgement-form-container">
        <form className="acknowledgement-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Acknowledgement Form</h2>
          
          <div className="form-row">
            <div>
              <label>Car Owner:</label>
              <input type="text" {...register("carOwner")} placeholder="Enter Car Owner's Name" required />
            </div>
            <div>
              <label>Renter:</label>
              <input type="text" {...register("renter")} placeholder="Enter Renter's Name" required />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Rent Start Date:</label>
              <input type="date" {...register("rentStartDate")} required />
            </div>
            <div>
              <label>Rent End Date:</label>
              <input type="date" {...register("rentEndDate")} required />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Car Return Date:</label>
              <input type="date" {...register("carReturnDate")} required />
            </div>
            <div>
              <label>Car:</label>
              <input type="text" {...register("car")} placeholder="Enter Car Model or Name" required />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Total Price:</label>
              <input type="number" {...register("totalPrice")} placeholder="Enter Total Price" required />
            </div>
            <div>
              <label>Total Extension Cost:</label>
              <input type="number" {...register("totalExtensionCost")} placeholder="Enter Total Extension Cost" required />
            </div>
          </div>

          <div className="form-row">
            <label>Comments:</label>
            <textarea {...register("comments")} placeholder="Enter comments" rows="4" />
          </div>

          <div className="form-row">
            <label>Car Images:</label>
            <input type="file" {...register("carImages")} multiple onChange={handleImageUpload} accept="image/*" />
          </div>

          {images.length > 0 && (
            <div className="image-carousel">
              {images.map((img, index) => (
                <img key={index} src={img} alt={`Uploaded ${index + 1}`} className="carousel-image" />
              ))}
            </div>
          )}
          
          <button type="submit" className="submit-buttons">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AcknowledgementForm;
