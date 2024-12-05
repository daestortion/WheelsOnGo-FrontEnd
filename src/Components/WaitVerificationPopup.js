import React from 'react';
import "../Css/WaitVerificationPopup.css";
import Loading from "./Loading";
import React, { useState } from 'react';

export const WaitVerificationPopup = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleOkClick = () => {
        setIsLoading(true);  // Start loading
    
        if (onClose) onClose();
    
        // Delay the page reload to allow the state update to occur
        setTimeout(() => {
            window.location.reload(); // Refresh the page after state has been set
        }, 100); // Small delay to ensure setIsLoading has time to update
    };
    

    return (
        <div className="for-verification">
            {isLoading && <Loading />}
                <div className="overlap1q">
                    <p className="wait-text-wrapper">Images have been uploaded. Please wait for verification.</p>
                    <div className="wait-group">
                        <div className="overlap-group" onClick={handleOkClick}>
                            <div className="wait-div">OK</div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default WaitVerificationPopup;
