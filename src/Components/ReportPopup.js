import React from "react";
import "../Css/ReportPopup.css";


export const ReportSuccess = ({ onClose }) => {
    return (
        <div className="report-success">
            <div className="overlap-wrapperjkl">
                <div className="overlapjkl">
                    <div className="text-wrapperjkl">Report submitted successfully.</div>
                    <div className="groupjkl">
                        <div className="overlap-groupjkl" onClick={onClose}>
                            <div className="divjkl">OK</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
