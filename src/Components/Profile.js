import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/ProfileVerified.css";
import trash from "../Images/trash.png";
import check from "../Images/verified.png";
import ApplyOwnerPopup from './ApplyOwnerPopup';
import Loading from './Loading';
import VerifyPopup from './VerifyPopup';
import ReverifyPopup from './ReverifyPopup';
import DeleteCarPopup from './DeleteCar';
import { Report } from './Report'; // Import the named export
import Header from "../Components/Header";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary
import moment from 'moment-timezone';

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

    // Get the current date and time
    const currentDate = new Date();

    // Get the time zone offset in minutes from UTC
    const timezoneOffset = currentDate.getTimezoneOffset();

    // Get the current time zone name
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Log the current time and time zone
    console.log('Current Date and Time:', currentDate);
    console.log('Time Zone Offset (in minutes):', timezoneOffset);
    console.log('Time Zone Name:', timeZoneName);

    const [showVerifyPopup, setShowVerifyPopup] = useState(false);
    const [showApplyOwnerPopup, setShowApplyOwnerPopup] = useState(false);
    const [showReverifyPopup, setShowReverifyPopup] = useState(false);
    const [showDeleteCarPopup, setShowDeleteCarPopup] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false); // State for report popup
    const navigate = useNavigate();

    const handleEditProfile = () => {
        navigate('/editprofile');
    };

    const toggleVerifyPopup = () => {
        setShowVerifyPopup(!showVerifyPopup);
    };

    const toggleApplyOwnerPopup = () => {
        setShowApplyOwnerPopup(!showApplyOwnerPopup);
    };

    const toggleReverifyPopup = () => {
        setShowReverifyPopup(!showReverifyPopup);
    };

    const toggleReportPopup = () => {
        setShowReportPopup(!showReportPopup); // Toggle the report popup
    };

    const handleAddCar = () => {
        navigate('/Addcar');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userId = JSON.parse(storedUser).userId;
            const fetchUserData = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get(`${BASE_URL}/user/getUserById/${userId}`);
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
                            cars: userData.cars.filter(car => car.approved && !car.deleted),
                            orders: userData.orders,
                            isOwner: userData.owner
                        });
                        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(storedUser), verificationStatus: userData.verification ? userData.verification.status : null }));
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

    const fetchCars = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/user/getCars/${currentUser.userId}`);
            if (response.status === 200) {
                setCurrentUser(prevState => ({
                    ...prevState,
                    cars: response.data.filter(car => car.approved && !car.deleted)
                }));
            } else {
                console.error('Error fetching cars:', response.status);
            }
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleRentHistory = () => {
        navigate('/history');
    };

    const handleRegisterAsOwner = () => {
        setShowApplyOwnerPopup(true);
    };

    const handleDeleteCar = (carId) => {
        setCarToDelete(carId);
        setShowDeleteCarPopup(true);
    };

    const handleRefundsClick = () => {
        navigate('/refund');
    };

    const confirmDeleteCar = async () => {
        if (carToDelete) {
            try {
                const response = await axios.put(`${BASE_URL}/car/deleteCar/${carToDelete}`);
                if (response.status === 200) {
                    // console.log(response.data);
                    fetchCars();
                } else {
                    console.error('Error deleting car:', response.status);
                }
            } catch (error) {
                console.error('Error deleting car:', error);
            } finally {
                setShowDeleteCarPopup(false);
                setCarToDelete(null);
            }
        }
    };

    const cancelDeleteCar = () => {
        setShowDeleteCarPopup(false);
        setCarToDelete(null);
    };

    const handleConfirmRegisterAsOwner = async () => {
        try {
            const response = await axios.put(`${BASE_URL}/user/updateIsOwner/${currentUser.userId}`, {
                isOwner: true
            });
            if (response.status === 200) {
                const updatedUser = {
                    ...currentUser,
                    isOwner: true
                };
                setCurrentUser(updatedUser);
                setShowApplyOwnerPopup(false);
                navigate('/userprofile');
            } else {
                alert('Failed to update status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating renting status:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleUpdateCar = (carId) => {
        navigate(`/updatecar/${carId}`);
    };

    const handleMessagesClick = () => {
        navigate('/messages');
    };

    return (
        <div className="profile-not-verified">
            {isLoading && <Loading />}
            <Header />

            <div className="overlap-wrapper">
                <div className="overlap213">
                    <div
                        className="rectangles"
                        style={{
                            backgroundImage: `url(${currentUser.profilePic})`,
                            backgroundSize: 'cover',
                        }}
                    />

                    <div className="overlap-2s">
                        <div className="text-wrapper-3">
                            <span>{currentUser.fName} </span>
                            <span>{currentUser.lName} </span>

                            {currentUser.verificationStatus === 1 ? (
                                <img className="vector" alt="Verified" src={check} />
                            ) : currentUser.verificationStatus === 0 ? (
                                <div className="text-wrapper-69">(Pending)</div>
                            ) : currentUser.verificationStatus === 2 ? (
                                <div className="reverify">
                                    ( Verification denied, please&nbsp;
                                    <span
                                        className="reverify-link"
                                        onClick={toggleReverifyPopup}
                                    >
                                        reverify
                                    </span>)
                                </div>
                            ) : (
                                <button className="div-wrapper" onClick={toggleVerifyPopup}>
                                    Verify
                                </button>
                            )}
                        </div>

                        <p className="p">
                            {currentUser.pNum} | {currentUser.email}
                        </p>

                        <button className="overlap-5" onClick={handleEditProfile}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Button Group Section */}
                <div className="button-group">
                    <button onClick={handleMessagesClick} className="button1">
                        Messages
                    </button>

                    <button onClick={toggleReportPopup} className="button1">
                        Submit a Report
                    </button>

                    <button onClick={handleRefundsClick} className="button1">
                        Request Refund
                    </button>

                    {currentUser.verificationStatus === 1 && (
                        <button className="button1" onClick={handleRentHistory}>
                            Transaction History
                        </button>
                    )}

                    {/* Register a Car Button Moved Here */}
                    {currentUser.verificationStatus === 1 && currentUser.isOwner && (
                        <>
                            <button className="button1" onClick={handleAddCar}>
                                Register a Car
                            </button>

                            {/* Conditionally render the Balance Page button */}
                            <button className="button1" onClick={() => navigate('/balance-page')}>
                                Balance
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Register as Owner Section */}
            {!currentUser.isOwner && currentUser.verificationStatus === 1 && (
                <div className="register-owner-container">
                    <div className="group1">
                        <span className="join-our-car-rental">
                            Join our car rental community and start earning extra income <br />
                            by enlisting your vehicles for rent. Share the convenience and benefits of your car while making money effortlessly.
                        </span>
                        <button className="overlap-6" onClick={handleRegisterAsOwner}>
                            Register as Owner
                        </button>
                    </div>
                </div>
            )}
            {/* Car List Section for Owners */}
            {currentUser.verificationStatus === 1 && currentUser.isOwner && (
                <div className="overlap-33">
                    {currentUser.cars && currentUser.cars.length > 0 ? (
                        currentUser.cars.map(car => (
                            <div key={car.carId} className="car-frame">
                                <button
                                    className="carbutton"
                                    onClick={() => handleUpdateCar(car.carId)}
                                >
                                    <img
                                        className="car-imagee"
                                        alt="Car"
                                        src={`data:image/jpeg;base64,${car.carImage}`}
                                    />
                                </button>
                                <img
                                    className="icon-trashhh"
                                    alt="Icon trash"
                                    src={trash}
                                    onClick={() => handleDeleteCar(car.carId)}
                                />
                                {/* Display "pending" if car is not approved */}
                                {!car.approved && <span className="status-pending">Pending</span>}
                            </div>
                        ))
                    ) : (
                        <span className="no-cars-message">NO CARS REGISTERED</span>
                    )}
                </div>
            )}
            {/* Popups */}
            {showVerifyPopup && <VerifyPopup closePopup={toggleVerifyPopup} />}
            {showReverifyPopup && <ReverifyPopup closePopup={toggleReverifyPopup} />}
            {showApplyOwnerPopup && (
                <ApplyOwnerPopup
                    closePopup={toggleApplyOwnerPopup}
                    confirmRegister={handleConfirmRegisterAsOwner}
                />
            )}
            {showDeleteCarPopup && (
                <DeleteCarPopup
                    confirmDelete={confirmDeleteCar}
                    cancelDelete={cancelDeleteCar}
                />
            )}
            {showReportPopup && <Report />}
        </div>
    );
};

export default UserProfile;
