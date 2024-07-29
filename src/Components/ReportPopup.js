import React from "react";
import "../Css/ReportPopup.css";
import { useNavigate } from 'react-router-dom';

export const ReportSuccess = () => {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/userprofile');
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
