import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/History.css";
import Dropdown from "./Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [showOwnedCars, setShowOwnedCars] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    userId: null,
    username: "username",
    fName: "FirstName",
    lName: "LastName",
    email: "youremail@email.org",
    pNum: "+63 123 456 7890",
    profilePic: "path_to_default_image.png",
    verificationStatus: null,
    isRenting: false,
    cars: [],
    orders: [],
    isOwner: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(null); // For showing DatePicker
  const [selectedDate, setSelectedDate] = useState(null); // Selected date for extension
  const [priceSummary, setPriceSummary] = useState({
    days: 0,
    pricePerDay: 0,
    total: 0,
  });
  const [disabledDates, setDisabledDates] = useState([]); // Track disabled dates

  const navigate = useNavigate();

  // Fetch orders for a user
  const fetchOrders = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/user/getAllOrdersFromUser/${userId}`
      );
      if (response.status === 200) {
        setAllOrders(response.data);
        setOrders(response.data); // Initially set all orders
      } else {
        setAllOrders([]);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders for a specific car
  const fetchOrdersByCarId = async (carId) => {
    try {
      const response = await axios.get(`http://localhost:8080/order/getOrdersByCarId/${carId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching car orders");
        return [];
      }
    } catch (error) {
      console.error("Error fetching car orders:", error);
      return [];
    }
  };

  // Fetch car details
  const fetchCarDetails = async (carId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/car/getCarById/${carId}`
      );
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Error fetching car details");
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
    return null;
  };

  // Handle extend rent action
  const handleExtendRent = async (orderId, endDate, carId) => {
    if (!selectedDate || selectedDate <= new Date(endDate)) {
      alert("Please select a valid date after the current end date.");
      return;
    }

    try {
      const newEndDate = selectedDate.toISOString().split("T")[0];
      const response = await axios.put(
        `http://localhost:8080/order/extendOrder/${orderId}`,
        null,
        { params: { newEndDate } }
      );

      if (response.status === 200) {
        alert("Rental extended successfully!");
        setShowDatePicker(null);
        fetchOrders(currentUser.userId);
      } else {
        alert("Error extending rent.");
      }
    } catch (error) {
      console.error("Error extending rent:", error);
    }
  };

  // Handle date change for extension, disable overlapping dates
  const handleDateChange = async (date, endDate, carId) => {
    setSelectedDate(date);

    const car = await fetchCarDetails(carId);
    const orders = await fetchOrdersByCarId(carId);
    
    // Filter out active orders and prepare booked dates
    const bookedDates = orders
      .filter(order => new Date(order.startDate) <= date && new Date(order.endDate) >= date)
      .map(order => {
        let dates = [];
        let currentDate = new Date(order.startDate);
        const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
        while (currentDate <= new Date(order.endDate)) {
          dates.push(new Date(currentDate));
          currentDate = addDays(currentDate, 1);
        }
        return dates;
      }).flat();

    setDisabledDates(bookedDates);

    if (car && date > new Date(endDate)) {
      const days = Math.ceil((date - new Date(endDate)) / (1000 * 60 * 60 * 24));
      const total = days * car.rentPrice;
      setPriceSummary({ days, pricePerDay: car.rentPrice, total });
    } else {
      setPriceSummary({ days: 0, pricePerDay: 0, total: 0 });
    }
  };

  // Fetch car orders (owned cars)
  const fetchCarOrdersByUserId = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/user/${userId}/carOrders`
      );
      if (response.status === 200) {
        setOrders(response.data);
      } else {
        console.error("No orders found for owned cars");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching car orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/user/getUserById/${userId}`
      );
      if (response.status === 200) {
        setCurrentUser(response.data);
        fetchOrders(response.data.userId);
      } else {
        console.error("User not found");
        navigate("/login");
      }
    } catch (error) {
      console.error("Server error when fetching user:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the "Owned Cars" button click
  const handleOwnedCarsClick = () => {
    setShowOwnedCars(true); // Set to true when owned cars are viewed
    fetchCarOrdersByUserId(currentUser.userId);
  };  

  // Handle the "Rent History" button click
  const handleRentHistoryClick = () => {
    setShowOwnedCars(false); // Reset to false when viewing all orders
    setOrders(allOrders);
  };
  
  const handleOngoingRentClick = () => {
    setShowOwnedCars(false); // Reset to false when viewing ongoing rent
    setOrders(allOrders.filter((order) => order.active));
  };
  

  // Navigation Handlers
  const handleCarsClick = () => {
    navigate("/cars");
  };

  const handleAboutClick = () => {
    navigate("/aboutus");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleCarReturned = async (orderId) => {
    try {
      // Send a PUT request to update the order's return status
      const response = await axios.put(`http://localhost:8080/order/markAsReturned/${orderId}`);
      
      if (response.status === 200) {
        console.log('Car return processed successfully.');
        // Optionally, refresh the orders list or give visual feedback to the user
      }
    } catch (error) {
      console.error('Error processing car return:', error.response?.data || error.message);
    }
  };

  const handleApprove = async (orderId) => {
    try {
        // Call backend to approve order
        const response = await fetch(`http://localhost:8080/order/approveOrder/${orderId}`, { method: 'PUT' });
        
        if (response.ok) {
            // After approval, update the 'active' status in the local state to 1 (true)
            setOrders(prevOrders => prevOrders.map(order =>
                order.orderId === orderId ? { ...order, active: 1 } : order
            ));
        }
      } catch (error) {
          console.error('Error approving order:', error);
      }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      fetchUserData(userId);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Denied";
      case 3:
        return "Finished";
      default:
        return "Unknown";
    }
  };

  const getActivity = (activity) => {
    return activity ? "Active" : "Inactive";
  };

  return (
    <div className="order-history-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper" onClick={handleCarsClick}>
              Cars
            </div>
            <div className="div" onClick={handleAboutClick}>
              About
            </div>
            <img
              className="sideview"
              alt="Sideview"
              onClick={handleHomeClick}
              src={sidelogo}
            />
            <div className="text-wrapper-2" onClick={handleHomeClick}>
              Home
            </div>
            <Dropdown>
              <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>
          <div className="overlap-2">
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
                      <th>Owner</th>
                      <th>Owner Phone</th>
                      {showOwnedCars && <th>Payment Option</th>} {/* Conditionally render isReturned */}
                      <th>Status</th>
                      <th>Activity</th>
                      {showOwnedCars && <th>isReturned</th>} {/* Conditionally render isReturned */}
                      {showOwnedCars && <th>Approve</th>} {/* Conditionally render isReturned */}
                      {showOwnedCars && <th>Actions</th>} {/* Conditionally render Actions */}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.car.carModel}</td>
                        <td>{order.startDate}</td>
                        <td>{order.endDate}</td>
                        <td>{order.totalPrice}</td>
                        <td>{order.referenceNumber}</td>
                        <td>{order.car.address}</td>
                        <td>{order.car.owner.username}</td>
                        <td>{order.car.owner.pNum}</td>
                        <td>{order.paymentOption}</td>
                        <td>{getStatusText(order.status)}</td>
                        <td>{getActivity(order.active)}</td>
                        <td>
                          <button className="button" onClick={() => handleCarReturned(order.orderId)}>Returned</button>
                        </td>
                        {order.paymentOption === "Cash" ? (
                        <td>
                          <button className="button-approve" onClick={() => handleApprove(order.orderId)}>Approve</button>
                        </td>
                        ) : (
                          <td></td> // Empty cell when no button
                        )}
                        <td>
                          {/* Extend Rent Action */}
                          {order.active && (
                            <div>
                              <button className="button"
                                onClick={() => setShowDatePicker(order.orderId)}
                              >
                                Extend
                              </button>
                              {showDatePicker === order.orderId && (
                                <div>
                                  <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) =>
                                      handleDateChange(
                                        date,
                                        order.endDate,
                                        order.car.carId
                                      )
                                    }
                                    minDate={new Date(order.endDate)}
                                    excludeDates={disabledDates} // Disable booked dates
                                    placeholderText="Select new end date"
                                  />
                                  <button
                                    onClick={() =>
                                      handleExtendRent(
                                        order.orderId,
                                        order.endDate,
                                        order.car.carId
                                      )
                                    }
                                  >
                                    Submit
                                  </button>
                                  <div className="summary">
                                    <h4>Summary of the Cost for Extension:</h4>
                                    <p>Days: {priceSummary.days}</p>
                                    <p>
                                      Price per day: ₱
                                      {priceSummary.pricePerDay.toFixed(2)}
                                    </p>
                                    <p>
                                      Total Remaining Balance: ₱
                                      {priceSummary.total.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
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
          <div className="text-wrapper-5">Transaction History</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
