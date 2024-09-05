import React from 'react';
import '../Css/CarDetailsPopup.css'; // Make sure you have the correct path for the CSS file

const CarDetailsPopup = ({ car, closePopup }) => {
  if (!car) return null; // Return null if no car is selected

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={closePopup}>Close</button>
        {/* Display car brand, model, and year as the heading */}
        <h2>{car.carBrand} {car.carModel} ({car.carYear})</h2>
        <p><strong>Description:</strong> {car.carDescription}</p>
        <p><strong>Plate Number:</strong> {car.plateNumber}</p>
        <p><strong>Seat Capacity:</strong> {car.maxSeatingCapacity}</p>
        <p><strong>Color:</strong> {car.color}</p>
      </div>
    </div>
  );
};

export default CarDetailsPopup;
