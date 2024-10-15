import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../Css/ExtendSuccessPopup.css";

const BookedPopup = ({ order, onClose }) => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    onClose(); // Close the BookedPopup and the PaymentPopup
    navigate('/cars'); // Redirect to the Cars page
  };

  return (
    <div className="extend-successpopup">
      <div className="overlapwrapper">
        <div className="bpoverlap">
            <p className="bpcarbooked">
                Car booking extended successfully. Thank you
            </p>
          <div className="groupy" >
            <div className="bpoverlapgroup" onClick={handleOkClick}>
              <div className="textwrapper">OK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedPopup;
