// src/components/UserProfile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/Profile.css";
import "../Css/ProfileVerified.css";
import "../Css/OwnerProfile.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profileIcon from "../Images/profile.png";
import check from "../Images/verified.png";
import trash from "../Images/trash.png";
import VerifyPopup from './VerifyPopup';
import Loading from './Loading';

const UserProfile = () => {
    const [currentUser, setCurrentUser] = useState({
        userId: null,
        username: 'username',
        fName: 'FirstName',
        lName: 'LastName',
        email: 'youremail@email.org',
        pNum: '+63 123 456 7890',
        profilePic: 'path_to_default_image.png',
        verificationStatus: null,
        isRenting: false,
        cars: [],
        orders: [],
        isOwner: false
    });

    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/editprofile');
    };

    const toggleVerifyPopup = () => {
        setShowVerifyPopup(!showVerifyPopup);
    };

    const handleAddCar = () => {
        navigate('/carmanagement');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userId = JSON.parse(storedUser).userId;
            const fetchUserData = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get(`https://extraordinary-abundance-production.up.railway.app/user/getUserById/${userId}`);
                    if (response.status === 200) {
                        const userData = response.data;
                        setCurrentUser({
                            userId: userData.userId,
                            username: userData.username,
                            fName: userData.fName,
                            lName: userData.lName,
                            email: userData.email,
                            pNum: userData.pNum,
                            profilePic: userData.profilePic ? `data:image/jpeg;base64,${userData.profilePic}` : 'path_to_default_image.png',
                            verificationStatus: userData.verification ? userData.verification.status : null,
                            isRenting: userData.renting,
                            cars: userData.cars,
                            orders: userData.orders,
                            isOwner: userData.owner
                        });
                    } else {
                        navigate('/login');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    navigate('/login');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchUserData();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleHomeClick = () => {
        navigate('/home');
    };

    const handleCarsClick = () => {
        navigate('/cars');
    };

    const handleAboutClick = () => {
        navigate('/aboutus');
    };

    const handleRegisterAsOwner = async () => {
        const confirmProceed = window.confirm('Do you want to proceed to register as an owner?');
        if (confirmProceed) {
            try {
                const response = await axios.put(`https://extraordinary-abundance-production.up.railway.app/user/updateIsOwner/${currentUser.userId}`, {
                    isOwner: true
                });
                if (response.status === 200) {
                    const updatedUser = {
                        ...currentUser,
                        isOwner: true
                    };
                    setCurrentUser(updatedUser);
                    navigate('/userprofile');
                } else {
                    alert('Failed to update status. Please try again.');
                }
            } catch (error) {
                console.error('Error updating renting status:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    console.log(currentUser);
    return (
        <div className="profile-not-verified">
            {isLoading && <Loading />}
            <div className="overlap-wrapper">
                <div className="overlap">
                    <div className="overlap-group">
                        <div className="text-wrapper" onClick={handleCarsClick}>Cars</div>
                        <div className="div" onClick={handleAboutClick}>About</div>
                        <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />
                        <div className="text-wrapper-2" onClick={handleHomeClick}>Home</div>
                        <Dropdown>
                            <button className="group">
                                <img alt="Group" src={profileIcon} />
                            </button>
                        </Dropdown>
                    </div>
                    <div className="rectangle" style={{ backgroundImage: `url(${currentUser.profilePic})`, backgroundSize: 'cover' }} />
                    <div className="overlap-2">
                        <div className="overlap-3">
                            <div className="text-wrapper-3">{currentUser.fName} {currentUser.lName}</div>
                            <div className="group-wrapper">
                                {currentUser.verificationStatus === 1 ? (
                                    <img className="vector" alt="Vector" src={check} />
                                ) : currentUser.verificationStatus === 0 ? (
                                    <div className="text-wrapper-69">Pending Verification</div>
                                ) : (
                                    <button className="div-wrapper" onClick={toggleVerifyPopup}>
                                        <div className="text-wrapper-4">Verify Account</div>
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="p">{currentUser.pNum} | {currentUser.email}</p>
                    </div>
                    {currentUser.verificationStatus === 1 && currentUser.isOwner ? (
                        <div className="owner-section">
                            <div className="overlap-group-wrapper6">
                                <button className="div-wrappercar" onClick={handleAddCar}>
                                    <div className="text-wrapper-44">Register a Car</div>
                                </button>
                            </div>
                            <div className="text-wrapper-55">Order History</div>
                            <div className="overlap-33">
                                {currentUser.cars.length > 0 ? (
                                    currentUser.cars.map(car => (
                                        <img
                                            key={car.carId}
                                            className="car-image"
                                            alt="Car"
                                            src={`data:image/jpeg;base64,${car.carImage}`}
                                        />
                                    ))
                                ) : (
                                    <p>No cars registered</p>
                                )}
                                <img className="icon-trashhh" alt="Icon trash" src={trash} />
                            </div>
                        </div>
                    ) : (
                        <div className="overlap-4">
                            <p className="join-our-car-rental">
                                Join our car rental community and start earning extra income <br /> by enlisting your vehicles for rent. Share the convenience and benefits of your car while making money effortlessly.
                            </p>
                            <div className="fgh" />
                            {currentUser.verificationStatus !== 1 ? (
                                <button className="overlap-6" onClick={handleRegisterAsOwner} disabled>
                                    <div className="text-wrapper-6">Register as Owner</div>
                                </button>
                            ) : (
                                <button className="overlap-6" onClick={handleRegisterAsOwner}>
                                    <div className="text-wrapper-6">Register as Owner</div>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="group-2">
                    <button className="overlap-5" onClick={handleEditProfile}>
                        <div className="text-wrapper-5">Edit Profile</div>
                    </button>
                </div>
            </div>
            {showVerifyPopup && <VerifyPopup closePopup={toggleVerifyPopup} />}
        </div>
    );
};

export default UserProfile;
