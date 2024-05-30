import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/CarUpdated.css";

export const UpdateCarPopup = () => {

  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/userprofile');
  };
  
    return (
      <div className="update-car-popup">
        <div className="overlap-wrapper12">
          <div className="overlap1">
            <div className="text-wrapper2">Car updated successfully.</div>
            <div className="group3">
              <button className="overlap-group4" onClick={handleOkClick}>
                <div className="div5">OK</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default UpdateCarPopup;
