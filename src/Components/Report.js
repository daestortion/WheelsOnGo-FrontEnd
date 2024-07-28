import React from "react";
import "../Css/Report.css";
import close from "../Images/close.png";

export const Report = () => {
  return (
    <div className="report">
      <div className="overlap-wrapper456">
        <div className="overlap456">
          <div className="text-wrapper456">Submit a Report</div>
          <div className="group456">
            <button className="overlap-group456">
              <div className="div456">Submit</div>
            </button>
          </div>
          <div className="close">
            <img className="vector" alt="Vector" src={close} />
          </div>
          <div className="rectangle" />
          <div className="text-wrapper-2">Subject:</div>
          <div className="div-wrapper">
            <div className="text-wrapper-3">Write here</div>
          </div>
        </div>
      </div>
    </div>
  );
};
