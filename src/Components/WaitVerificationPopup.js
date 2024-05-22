import React from 'react';
import "../Css/WaitVerificationPopup.css";

export const WaitVerificationPopup = ({ onClose }) => {
    const handleOkClick = () => {
        if (onClose) onClose();
        window.location.reload(); // Refresh the page
    };

    return (
        <div className="for-verification">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <p className="wait-text-wrapper">Images have been uploaded. Please wait for verification.</p>
                    <div className="wait-group">
                        <div className="overlap-group" onClick={handleOkClick}>
                            <div className="wait-div">OK</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitVerificationPopup;
