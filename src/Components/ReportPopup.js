import React from "react";
import "../Css/ReportPopup.css";

export const ReportSuccess = ({ onClose }) => {

  const handleOkClick = () => {
    onClose();
  };

  return (
    <div className="report-success">
      <div className="overlap-wrapperjkl">
        <div className="overlapjkl">
          <div className="text-wrapperjkl">Report submitted successfully.</div>
          <div className="groupjkl">
            <button className="overlap-groupjkl" onClick={handleOkClick}>
              <div className="divjkl">OK</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
