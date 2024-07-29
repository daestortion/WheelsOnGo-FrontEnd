import React, { useState } from "react";
import axios from "axios";
import "../Css/Report.css";
import close from "../Images/close.png";
import { ReportSuccess } from './ReportPopup';

export const Report = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showReportPopup, setShowReportPopup] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const report = { title, description, user: { userId: 1 } }; // Adjust the user object according to your backend requirements
    try {
      await axios.post("http://localhost:8080/report", report); // Adjust the URL according to your backend setup
      setShowReportPopup(true);
      setIsVisible(true);
    } catch (error) {
      console.error("There was an error submitting the report!", error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="report">
      <div className="overlap-wrapper456">
        <div className="overlap456">
          <div className="text-wrapper456">Submit a Report</div>
          <form onSubmit={handleSubmit}>
            <div className="group456">
              <button type="submit" className="overlap-group456">
                <div className="div456">Submit</div>
              </button>
            </div>
            <button className="close" type="button" onClick={handleClose}>
              <img className="vector" alt="Vector" src={close} />
            </button>
            <input
              className="rectangle"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="text-wrapper-2">Subject:</div>
            <textarea
              className="div-wrapper"
              placeholder="Write here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </form>
        </div>
      </div>
      {showReportPopup && <ReportSuccess />}
    </div>
  );
};