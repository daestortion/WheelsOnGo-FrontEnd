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
      <div className="overlap-wrapperwe">
        <div className="overlapwew">
          <p className="you-cannot-rent-your1q">
            You cannot rent <br />
            your own car.
          </p>
          <div className="groupza">
            <button className="overlap-group212" onClick={handleOkClick}>
              <div className="text-wrapperwqq">OK</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CantrentownPopup;
