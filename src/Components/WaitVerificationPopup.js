import React from 'react';
import "../Css/WaitVerificationPopup.css";

export const WaitVerificationPopup = ({ onClose }) => {
    return (
        <div className="for-verification">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <p className="wait-text-wrapper">Images have been uploaded. Please wait for verification.</p>
                    <div className="wait-group">
                        <div className="overlap-group" onClick={onClose}>
                            <div className="wait-div">OK</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitVerificationPopup;
