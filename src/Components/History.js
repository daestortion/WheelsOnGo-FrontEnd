import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/OngoingRent.css";
import Dropdown from "./Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOngoingFilter, setIsOngoingFilter] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:8080/user/getUserById/${userId}`);
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
            // Update local storage with the latest verification status
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

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleCarsClick = () => {
    navigate('/cars');
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
  };

  useEffect(() => {
    fetchOrders();
  }, [isOngoingFilter]);

  const fetchOrders = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userId = JSON.parse(storedUser).userId;
        let url = `http://localhost:8080/order/getOrdersByUserId/${userId}`;
        if (isOngoingFilter) {
          url += '?active=true'; // Assuming your backend supports filtering by active status
        }
        const response = await fetch(url);
        const data = await response.json();
        if (Array.isArray(data)) {
          const ordersWithAdditionalData = await Promise.all(data.map(async (order) => {
            const carResponse = await axios.get(`http://localhost:8080/car/getCarById/${order.car.carId}`);
            const carOwnerResponse = await axios.get(`http://localhost:8080/user/getUserById/${carResponse.data.owner.userId}`);
            return {
              ...order,
              carAddress: carResponse.data.address,
              carOwnerName: `${carOwnerResponse.data.fName} ${carOwnerResponse.data.lName}`,
              carOwnerPhone: carOwnerResponse.data.pNum
            };
          }));
          setOrders(ordersWithAdditionalData);
        } else {
          console.error('API response is not an array:', data);
          setOrders([]); // Set to an empty array to avoid map errors
        }
      } else {
        console.error('No user found in local storage');
        setOrders([]); // Set to an empty array to avoid map errors
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]); // Set to an empty array to avoid map errors
    }
  };

  const handleOngoingFilterClick = () => {
    setIsOngoingFilter(!isOngoingFilter);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Denied";
      default:
        return "Unknown";
    }
  };

  console.log(currentUser);

  return (
    <div className="order-history-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper" onClick={handleCarsClick}>Cars</div>
            <div className="div" onClick={handleAboutClick}>About</div>

            <img className="sideview" alt="Sideview" onClick={handleHomeClick} src={sidelogo} />

            <div className="text-wrapper-2" onClick={handleHomeClick}>Home</div>
            <Dropdown>
              <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>
          <div className="overlap-2">
            <div className="fgh" />
            <div className="jkl" />
            <div className="rectangle">
              <div className="table-container">
                <button onClick={handleOngoingFilterClick}>
                  {isOngoingFilter ? 'Show All Orders' : 'Show Ongoing Rents'}
                </button>
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Car</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Total Price</th>
                      <th>Reference Number</th>
                      <th>Car Address</th>
                      <th>Car Owner Name</th>
                      <th>Car Owner Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId}>
                        <td>{order.car.carModel}</td>
                        <td>{order.startDate}</td>
                        <td>{order.endDate}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.referenceNumber}</td>
                        <td>{order.carAddress}</td>
                        <td>{order.carOwnerName}</td>
                        <td>{order.carOwnerPhone}</td>
                        <td>{getStatusText(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <img className="vector" alt="Vector" src={vector}/>
          </div>
          <div className="overlap-group-wrapper">
            <div className="div-wrapper">
              <div className="text-wrapper-3">Ongoing Rent</div>
            </div>
          </div>
          {currentUser.verificationStatus === 1 && currentUser.isOwner ? (
            <div className="group-2">
              <div className="div-wrapper">
                <div className="text-wrapper-4">Order History</div>
              </div>
            </div>
          ) : null}

          <div className="group-3">
            <div className="div-wrapper">
              <div className="text-wrapper-4">Rent History</div>
            </div>
          </div>
          <div className="text-wrapper-5">Order History</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
