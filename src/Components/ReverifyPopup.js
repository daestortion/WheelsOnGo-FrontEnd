import React, { useRef, useState, useEffect } from 'react';
import "../Css/ReverifyPopup.css";
import close from "../Images/close.svg";
import WaitVerificationPopup from "./WaitVerificationPopup";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

export const ReverifyPopup = ({ closePopup }) => {
    const fileInputRefGovId = useRef(null);
    const fileInputRefDriverLicense = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.userId : null;
    // console.log(userId);

    const [govIdFileName, setGovIdFileName] = useState("Upload Valid Government ID");
    const [driverLicenseFileName, setDriverLicenseFileName] = useState("Upload Driver’s License");
    const [showWaitVerificationPopup, setShowWaitVerificationPopup] = useState(false);

    const handleUploadClick = (fileInputRef) => () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event, setFileName) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "Upload");
        // console.log(file);
    };

    useEffect(() => {
        // console.log('showWaitVerificationPopup updated:', showWaitVerificationPopup);
    }, [showWaitVerificationPopup]);

    const handleVerify = async () => {
        // console.log('Verify button clicked');

        if (fileInputRefGovId.current.files.length === 0 || fileInputRefDriverLicense.current.files.length === 0) {
            window.alert("Please upload both files.");
            return;
        }

        // console.log('Before displaying WaitVerificationPopup');
        setShowWaitVerificationPopup(true);

        try {
            const formData = new FormData();
            formData.append('status', 0);
            formData.append('govId', fileInputRefGovId.current.files[0]);
            formData.append('driversLicense', fileInputRefDriverLicense.current.files[0]);

            // console.log('Form Data:', formData);

            const response = await fetch(`${BASE_URL}/verification/updateVerification/${userId}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // console.log('Response data:', data);

            // Optionally, handle response data or close the popup
        } catch (error) {
            console.error('Error during verification:', error);
            setShowWaitVerificationPopup(false); // Hide popup if there's an error
        }
    };

    const handleCloseWaitVerificationPopup = () => {
        setShowWaitVerificationPopup(false);
        closePopup();
    };

    return (
        <div className="vap-popup">
            <div className="vap-wrapper">
                <div className="vap-overlap">

                    <div className="close" onClick={closePopup}>
                        <img className="vector1" alt="Close" src={close} />
                    </div>

                    <h1 className="vap-text-wrapper">Reverify Account</h1>

                    <div className="vap-group-wrapper">

                        <div className="vap-text-2">{driverLicenseFileName}</div>
                            <button className="vap-div-wrapper1" onClick={handleUploadClick(fileInputRefDriverLicense)}>
                                Upload
                            </button>

                            <input
                                ref={fileInputRefDriverLicense}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => handleFileChange(event, setDriverLicenseFileName)}
                                accept="image/*"
                            />
                        
                    </div>

                    <div className="vap-overlap-2">
                    <div className="vap-text-3">{govIdFileName}</div>

                            <button className="vap-div-wrapper2" onClick={handleUploadClick(fileInputRefGovId)}>
                                Upload
                            </button>

                            <input
                                ref={fileInputRefGovId}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(event) => handleFileChange(event, setGovIdFileName)}
                                accept="image/*"
                            />

                        
                    </div>

                    <div className="vap-text-info211ver">
                        Your verification has been denied. Please upload valid identification documents, ensuring that they are clear and legible.
                    </div>


                        <button className="vap-overlap-3" onClick={handleVerify}>
                            Verify
                        </button>


                </div>
            </div>
            {showWaitVerificationPopup && (
                <WaitVerificationPopup onClose={handleCloseWaitVerificationPopup} />
            )}
        </div>
    );
};

export default ReverifyPopup;
