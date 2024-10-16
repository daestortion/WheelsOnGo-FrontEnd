import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/AddCarPopup.css";

export const AddCarPopup = () => {
    const navigate = useNavigate();

    const handleOkClick = () => {
      // Close the popup (this could be a state change in the parent component)
      // Navigate to login page
      navigate('/cars');
    };
  return (
    <div className="add-car-success">
      <div className="overlap-wrapper11">

        <div className="overlapw1">
          <div className="ac-text-wrapper">Car successfully registered.</div>
 
            <div className="overlap-group" onClick={handleOkClick}>
              OK
            </div>
        </div>

      </div>
    </div>
  );
};

export default AddCarPopup;
