import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/ReturnSuccessPopup.css";

const ReturnSuccessPopup = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/history'); 
  };

  return (
    <div className="return-successpopup">
      <div className="overlapreturn">
        <div className="returnoverlap">
            <p className="returnyey">
                Car returned successfully. Thank you.
            </p>
          <div className="groupyi" >
            <div className="bpoverlapgroupi" onClick={handleOkClick}>
              <div className="textwrapperi">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnSuccessPopup;
