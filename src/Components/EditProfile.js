import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../Components/Header";
import Loading from "../Components/Loading.js"; // Import Loading component
import ProfileUpdatePopup from '../Components/ProfileUpdatePopup';
import "../Css/EditProfile.css";

export const EditProfile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [phoneNumber, setPhoneNumber] = useState(user.pNum || '');
    const [email, setEmail] = useState(user.email || '');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(user.profilePic || 'path_to_default_image.png');
    const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility
    const [isLoading, setIsLoading] = useState(false); // State to control loading

    const navigate = useNavigate(); // Setup useNavigate

    useEffect(() => {
        // This effect updates the local state if the local storage changes
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setPhoneNumber(storedUser.pNum || ''); // Ensure these are set to empty string if undefined
            setEmail(storedUser.email || ''); // Ensure these are set to empty string if undefined
            setProfilePicUrl(storedUser.profilePic || 'path_to_default_image.png'); // Set initial profile pic URL
        }
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(file); // Store the file directly
            const newProfilePicUrl = URL.createObjectURL(file); // Create object URL
            setProfilePicUrl(newProfilePicUrl); // Update state with new object URL
        }
    };

    const handleClickUpload = () => {
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleUpdateProfile = async () => {
        setIsLoading(true); // Start loading when the update starts

        const formData = new FormData();
        formData.append('userId', user.userId); // Assuming `userId` is stored in your user object
        formData.append('pNum', phoneNumber);
        formData.append('email', email);
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }
    
        try {
            const response = await fetch('https://tender-curiosity-production.up.railway.app/user/updateUser', {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            console.log('Update successful:', data);
    
            // Update user data in local storage
            localStorage.setItem('user', JSON.stringify({ ...user, pNum: phoneNumber, email, profilePic: profilePicUrl }));
            
            setIsLoading(false); // Stop loading once the update is complete
            setShowPopup(true); // Show the popup to confirm the update
        } catch (error) {
            console.error('Failed to update profile:', error);
            setIsLoading(false); // Stop loading if there's an error
        }
    };

    return (
        <div className="edit-profile">
            <Header />  {/* Ensure Header is included */}
            <div className="overlap-wrapper">
                <div className="wew1">
                    <div className="text-wrapper-6wq">Update Profile</div>

                    <div className="rectangle11" style={{ backgroundImage: `url(${profilePicUrl})`, backgroundSize: 'cover', position: 'relative' }}>
                        {!profilePic && (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Upload Profile Image</div>
                        )}
                    </div>

                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    <button className="overlap-group-211" onClick={handleClickUpload}>
                        Upload
                    </button>
                </div>

                <div className="overlap-2">
                    <h1 className="new-profile-details">New Profile Details</h1>
                    <span className="p">
                        Please enter your new user details. Upon confirming, your user details will be updated.
                    </span>

                    <input className="div-wrapper" type="number" placeholder="New Phone Number"
                        value={phoneNumber} onChange={e => setPhoneNumber(e.target.value || '')} />

                    <input className="overlap-3" type="text" placeholder="New Email"
                        value={email} onChange={e => setEmail(e.target.value || '')} />

                    <button className="overlap-4" onClick={handleUpdateProfile}>
                        Update Profile
                    </button>
                </div>
            </div>

            {isLoading && <Loading />} {/* Conditionally render the loading indicator */}
            {showPopup && <ProfileUpdatePopup />} {/* Conditionally render the popup */}
        </div>
    );
};

export default EditProfile;
