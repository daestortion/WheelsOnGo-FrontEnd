import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/History.css";
import Dropdown from "./Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);

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

  const fetchOrders = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/user/getAllOrdersFromUser/${userId}`);
      if (response.status === 200) {
        setAllOrders(response.data);
        setOrders(response.data); // Initially set all orders
      } else {
        setAllOrders([]);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setAllOrders([]);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(currentUser);

  const fetchCarOrdersByUserId = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/user/${userId}/carOrders`);
      if (response.status === 200) {
        setOrders(response.data);
      } else {
        console.error('No orders found for owned cars');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching car orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOwnedCarsClick = () => {
    fetchCarOrdersByUserId(currentUser.userId); // Fetch orders for owned cars
  };

  const handleRentHistoryClick = () => {
    setOrders(allOrders); // Reset to show all orders
  };

  const handleOngoingRentClick = () => {
    console.log("Ongoing clicked");
    setOrders(allOrders.filter(order => order.active)); // Filter orders by active status
  };

  const fetchUserData = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/user/getUserById/${userId}`);
      if (response.status === 200) {
        setCurrentUser(response.data);
        fetchOrders(response.data.userId);  // Fetch orders when the component mounts
      } else {
        // Handle user not found or other non-success cases
        console.error('User not found or error fetching user data');
        navigate('/login'); // Redirect or handle as needed
      }
    } catch (error) {
      console.error('Server error when fetching user:', error);
      navigate('/login'); // Redirect or handle as needed
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      fetchUserData(userId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  console.log(orders);

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

  const getActivity = (activity) => {
    switch (activity) {
      case true:
        return "Active";
      case false:
        return "Inactive";
      default:
        return "Unknown";
    }
  };


  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleCarsClick = () => {
    navigate('/cars');
  };

  const handleAboutClick = () => {
    navigate('/aboutus');
  };

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
                      <th>Activity</th>
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
                        <td>{getActivity(order.active)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <img className="vector" alt="Vector" src={vector} />
          </div>
          <div className="overlap-group-wrapper">
            <button className="div-wrapper" onClick={handleOngoingRentClick}>
              <div className="text-wrapper-3">Ongoing Rent</div>
            </button>
          </div>
          {currentUser.owner ? (
            <div className="group-2">
              <button className="div-wrapper" onClick={handleOwnedCarsClick}>
                <div className="text-wrapper-4">Owned Cars</div>
              </button>
            </div>
          ) : null}


          <div className="group-3">
            <button className="div-wrapper" onClick={handleRentHistoryClick}>
              <div className="text-wrapper-4">Rent History</div>
            </button>
          </div>
          <div className="text-wrapper-5">Order History</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;