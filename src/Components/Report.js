import React, { useState } from "react";
import "../Css/Report.css";
import close from "../Images/close.png";
import { ReportSuccess } from "../Components/ReportPopup";

export const Report = () => {
  const [showReportPopup, setReportPopup] = useState(false);

  const handleSubmitPopup = () => {
    setReportPopup(true);
  };

  const handleCloseSubmitPopup = () => {
    setReportPopup(false);
  };

  return (
    <div className="report">
      <div className="overlap-wrapper456">
        <div className="overlap456">
          <div className="text-wrapper456">Submit a Report</div>
          <div className="group456">
            <button className="overlap-group456" onClick={handleSubmitPopup}>
              <div className="div456">Submit</div>
            </button>
          </div>
          <button className="close">
            <img className="vector" alt="Vector" src={close} />
          </button>
          <input className="rectangle" placeholder="Title" />
          <div className="text-wrapper-2">Subject:</div>
          <textarea className="div-wrapper" placeholder="Write here"/>
        </div>
      </div>
      {showReportPopup && <ReportSuccess onClose={handleCloseSubmitPopup} />}
    </div>
  );
};
