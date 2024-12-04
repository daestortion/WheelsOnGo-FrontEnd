import React from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/RentOwnPopup.css";

export const CantrentownPopup = () => {

  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/userprofile');
  };

  return (
    <div className="cantrentown-popup">
     
        <div className="overlapwew">
          <p className="you-cannot-rent-your1q">
            You cannot rent <br />
            your own car.
          </p>

            <button className="overlap-group212" onClick={handleOkClick}>
             OK
            </button>

        </div>
    
    </div>
  );
};
export default CantrentownPopup;
