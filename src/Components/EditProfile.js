import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "../Components/Dropdown.js";
import ProfileUpdatePopup from '../Components/ProfileUpdatePopup';
import "../Css/EditProfile.css";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";

export const EditProfile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [phoneNumber, setPhoneNumber] = useState(user.pNum || '');
    const [email, setEmail] = useState(user.email || '');
    const [profilePic, setProfilePic] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const navigate = useNavigate(); // Setup useNavigate

    // Define onClick handlers
    const handleHomeClick = () => {
        navigate('/home'); // Navigate to dashboard page which is at '/home'
    };

    const handleCarsClick = () => {
        navigate('/cars'); // Navigate to cars page
    };

    const handleAboutClick = () => {
        navigate('/about-us'); // Navigate to about-us page
    };

    useEffect(() => {
        // This effect updates the local state if the local storage changes
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setPhoneNumber(storedUser.pNum || ''); // Ensure these are set to empty string if undefined
            setEmail(storedUser.email || ''); // Ensure these are set to empty string if undefined
        }
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(file); // Store the file directly
        }
    };

    const handleClickUpload = () => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleUpdateProfile = async () => {
        if (!phoneNumber && !email) {
            setErrorMessage('Please enter new details.'); // Set error message if no details are entered
            return;
        }
    
        if (!phoneNumber || !email || !profilePic) {
            setErrorMessage('All fields are required.'); // Set error message if any field is empty
            return;
        }
    
        const formData = new FormData();
        formData.append('userId', user.userId); // Assuming `userId` is stored in your user object
        formData.append('pNum', phoneNumber);
        formData.append('email', email);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }
    
        try {
            const response = await fetch('http://localhost:8080/user/updateUser', {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            console.log('Update successful:', data);
    
            // Update user data in local storage
            localStorage.setItem('user', JSON.stringify({ ...user, pNum: phoneNumber, email, profilePic: URL.createObjectURL(profilePic) }));
            
            setShowPopup(true); // Show the popup
            setErrorMessage(''); // Clear error message after successful update
        } catch (error) {
            console.error('Failed to update profile:', error);
            setErrorMessage('Failed to update profile. Please try again.'); // Set error message for failed update
        }
    };
    

    return (
        <div className="edit-profile">
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="text-wrapper" onClick={handleHomeClick}>Home</div>
                        <div className="div" onClick={handleCarsClick}>Cars</div>
                        <div className="text-wrapper-2" onClick={handleAboutClick}>About</div>
                        <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo}/>
                        <Dropdown>
                            <button className="group">
                                <img alt="Group" src={profile} />
                            </button>
                        </Dropdown>
                    </div>
                    <div className="overlap-2">
                        <input className="div-wrapper" type="number" placeholder="New Phone Number"
                              value={phoneNumber} onChange={e => setPhoneNumber(e.target.value || '')} />
                        <input className="overlap-3" type="text" placeholder="New Email"
                              value={email} onChange={e => setEmail(e.target.value || '')} />
                        <div className="overlap-group-wrapper">
                            <button className="overlap-4" onClick={handleUpdateProfile}>
                                <div className="text-wrapper-5">Update Profile</div>
                            </button>
                        </div>
                        <div className="new-profile-details">New Profile Details</div>
                        <p className="p">
                            Please enter your new user details. Upon confirming, your user
                            details will be updated.
                        </p>
                    </div>
                    <div className="text-wrapper-6">Update Profile</div>
                    <div className="rectangle" style={{ backgroundImage: `url(${profilePic ? URL.createObjectURL(profilePic) : user.profilePic || 'path_to_default_image.png'})`, backgroundSize: 'cover', position: 'relative' }}>
                        {!profilePic && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload Profile Image</div>}
                    </div>
                    <div className="group-2">
                        <button className="overlap-group-2" onClick={handleClickUpload}>
                            <div className="text-wrapper-7">Upload</div>
                        </button>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {showPopup && <ProfileUpdatePopup />} {/* Conditionally render the popup */}
        </div>
    );
};

export default EditProfile;