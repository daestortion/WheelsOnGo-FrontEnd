import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "../Css/History.css";
import vector from "../Images/adminvector.png";
import ExtendPaymentPopup from "./ExtendPaymentPopup";
import Header from "./Header.js";
import Loading from "./Loading"; // Import Loading component

// Utility function to format dates
const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "N/A";
};

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [allOrders, setAllOrders] = useState([]);
  const [showOwnedCars, setShowOwnedCars] = useState(false);
  const [showOngoingRents, setShowOngoingRents] = useState(false);
  const [showExtendPaymentPopup, setExtendShowPaymentPopup] = useState(false); // State to control PaymentPopup
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
  const [selectedOrder, setSelectedOrder] = useState(null); // Track the selected order for payment
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
    setIsLoading(true); // Start loading when fetching begins
    try {
      const response = await axios.get(
        `https://tender-curiosity-production.up.railway.app/user/getAllOrdersFromUser/${userId}`
      );
      if (response.status === 200) {
        console.log("Fetched orders:", response.data); // Log orders fetched
        setAllOrders(response.data);
        setOrders(response.data); // Initially set all orders
      } else {
        setAllOrders([]);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false); // Stop loading when fetching is done
    }
  };

  // Fetch car details
  const fetchCarDetails = async (carId) => {
    try {
      const response = await axios.get(
        `https://tender-curiosity-production.up.railway.app/car/getCarById/${carId}`
      );
      if (response.status === 200) {
        console.log("Fetched car details:", response.data);
        return response.data;
      } else {
        console.error("Error fetching car details");
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
    return null;
  };

  // Fetch orders by car ID
  const fetchOrdersByCarId = async (carId) => {
    try {
      const response = await axios.get(
        `https://tender-curiosity-production.up.railway.app/order/getOrdersByCarId/${carId}`
      );
      if (response.status === 200) {
        console.log("Fetched orders for car:", response.data);
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

  // Fetch car orders (owned cars)
  const fetchCarOrdersByUserId = async (userId) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `https://tender-curiosity-production.up.railway.app/user/${userId}/carOrders`
      );
      if (response.status === 200) {
        console.log("Fetched car orders for owned cars:", response.data);
        setOrders(response.data);
      } else {
        console.error("No orders found for owned cars");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching car orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false); // Stop loading after fetching
    }
  };

  // Fetch user data and orders
  const fetchUserData = async (userId) => {
    setIsLoading(true); // Start loading when fetching user data
    try {
      const response = await axios.get(
        `https://tender-curiosity-production.up.railway.app/user/getUserById/${userId}`
      );
      if (response.status === 200) {
        console.log("Fetched user data:", response.data); // Log fetched user data
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
      setIsLoading(false); // Stop loading after user data is fetched
    }
  };

  // Handle the "Owned Cars" button click
  const handleOwnedCarsClick = () => {
    setShowOwnedCars(true);
    setShowOngoingRents(false); // Disable Ongoing Rents view
    setIsLoading(true); // Start loading for owned cars
    fetchCarOrdersByUserId(currentUser.userId).finally(() => {
      setIsLoading(false); // Stop loading after data is fetched
    });
  };

  // Handle the "Rent History" button click
  const handleRentHistoryClick = () => {
    setShowOwnedCars(false);
    setShowOngoingRents(false); // Disable Ongoing Rents view
    setIsLoading(true); // Start loading for rent history
    setOrders(allOrders); // Show all orders (Rent History)
    setTimeout(() => setIsLoading(false), 500); // Simulate slight delay
  };

  // Handle the "Ongoing Rent" button click
  const handleOngoingRentClick = () => {
    setShowOwnedCars(false);
    setShowOngoingRents(true); // Enable Ongoing Rents view
    setIsLoading(true); // Start loading for ongoing rents
    setOrders(allOrders.filter((order) => order.active)); // Filter ongoing rents
    setTimeout(() => setIsLoading(false), 500); // Simulate slight delay
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

  const handleTerminate = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://tender-curiosity-production.up.railway.app/order/terminateOrder/${orderId}`
      );
      if (response.status === 200) {
        console.log(`Order ${orderId} terminated successfully.`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, terminated: true, active: false, terminationDate: new Date().toISOString() }
              : order
          )
        );
      } else {
        console.error("Failed to terminate order.");
      }
    } catch (error) {
      console.error("Error terminating the order:", error.response?.data || error.message);
    } finally {
      setIsLoading(false); // Ensure loading is stopped after the operation
    }
  };
  
  const handleCarReturned = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `https://tender-curiosity-production.up.railway.app/order/markAsReturned/${orderId}`
      );
      if (response.status === 200) {
        console.log("Car return processed successfully, orderId:", orderId);
      }
    } catch (error) {
      console.error(
        "Error processing car return:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false); // Ensure loading is stopped after the operation
    }
  };
  
  const handleApprove = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://tender-curiosity-production.up.railway.app/order/approveOrder/${orderId}`,
        { method: "PUT" }
      );
      if (response.ok) {
        console.log("Order approved, orderId:", orderId);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, active: 1 } : order
          )
        );
      }
    } catch (error) {
      console.error("Error approving order:", error);
    } finally {
      setIsLoading(false); // Ensure loading is stopped after the operation
    }
  };  

  const handleDateChange = async (date, endDate, carId) => {
    setSelectedDate(date);

    const car = await fetchCarDetails(carId);
    const orders = await fetchOrdersByCarId(carId);

    // Filter out active orders and prepare booked dates
    const bookedDates = orders
      .filter(
        (order) =>
          new Date(order.startDate) <= date && new Date(order.endDate) >= date
      )
      .map((order) => {
        let dates = [];
        let currentDate = new Date(order.startDate);
        const addDays = (date, days) =>
          new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
        while (currentDate <= new Date(order.endDate)) {
          dates.push(new Date(currentDate));
          currentDate = addDays(currentDate, 1);
        }
        return dates;
      })
      .flat();

    setDisabledDates(bookedDates);

    if (car && date > new Date(endDate)) {
      const days = Math.ceil(
        (date - new Date(endDate)) / (1000 * 60 * 60 * 24)
      );
      const total = days * car.rentPrice;
      console.log("Price summary:", { days, pricePerDay: car.rentPrice, total });
      setPriceSummary({ days, pricePerDay: car.rentPrice, total });
    } else {
      setPriceSummary({ days: 0, pricePerDay: 0, total: 0 });
    }
  };

  // Handle extend rent action
  const handleExtendRent = (orderId, endDate) => {
    // Check if a date has been selected and it's valid (after the current end date)
    if (showDatePicker === orderId && selectedDate && selectedDate > new Date(endDate)) {
      // Adjust the date if needed
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
      const newEndDate = adjustedDate.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

      // Set the selected order details and show the ExtendPaymentPopup
      setSelectedOrder({
        orderId: orderId,
        endDate: newEndDate,
      });

      setExtendShowPaymentPopup(true); // Open the payment popup
    } else {
      // If "Extend" is clicked the first time or no valid date has been selected yet, show DatePicker
      setShowDatePicker(orderId); 
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser).userId;
      console.log("Stored user ID:", userId);
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
      <Header />
      <div className="overlap-wrapper213">
        {isLoading ? (
          <Loading /> // Show loading spinner while loading
        ) : (
          <div className="overlap213">
            <div className="overlap-group123"></div>
            <div className="overlap-212">
              <div className="rectangle213">
                <div className="table-container213">
                  <table className="order-table213">
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
                        <th>Payment Option</th>
                        {showOwnedCars && <th>Approve</th>}{" "}
                        <th>Status</th>
                        <th>Activity</th>
                        <th>Termination</th>
                        {showOwnedCars && <th>isReturned</th>}{" "}
                        {showOngoingRents && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId}>
                          <td>
                            {order.car.carBrand} {order.car.carModel}
                          </td>
                          <td>{formatDate(order.startDate)}</td>
                          <td>{formatDate(order.endDate)}</td>
                          <td>
                            ₱
                            {order.totalPrice.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td>{order.referenceNumber}</td>
                          <td>{order.car.address}</td>
                          <td>{order.car.owner.username}</td>
                          <td>{order.car.owner.pNum}</td>
                          <td>{order.paymentOption}</td>
                          {showOwnedCars &&
                            (order.paymentOption === "Cash" ? (
                              <td>
                                <button
                                  className="button-approve"
                                  onClick={() => handleApprove(order.orderId)}
                                >
                                  Approve
                                </button>
                              </td>
                            ) : (
                              <td></td>
                            ))}
                          <td>{getStatusText(order.status)}</td>
                          <td>{getActivity(order.active)}</td>
                          <td>
                            {order.terminated
                              ? `Terminated on ${new Date(
                                  order.terminationDate
                                )
                                  .toISOString()
                                  .split("T")[0]}`
                              : ""}
                          </td>
                          {showOwnedCars && (
                            <td>
                              <button
                                className="return"
                                onClick={() => handleCarReturned(order.orderId)}
                              >
                                Returned
                              </button>
                            </td>
                          )}
                          {showOngoingRents && (
                            <td>
                              {order.active && (
                                <div>
                                  <button
                                    className="extend"
                                    onClick={() => handleExtendRent(order.orderId, order.endDate)}
                                  >
                                    {showDatePicker === order.orderId ? "Submit" : "Extend"}
                                  </button>
                                  {showDatePicker === order.orderId && (
                                    <div>
                                      <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) =>
                                          handleDateChange(date, order.endDate, order.car.carId)
                                        }
                                        minDate={
                                          new Date(
                                            new Date(order.endDate).getTime() + 24 * 60 * 60 * 1000
                                          )
                                        }
                                        excludeDates={disabledDates} // Disable already booked dates
                                        placeholderText="Select new end date"
                                      />
                                      <div className="summary">
                                        <h4>Summary of the Cost for Extension:</h4>
                                        <p>Days: {priceSummary.days}</p>
                                        <p>
                                          Price per day: ₱{priceSummary.pricePerDay.toFixed(2)}
                                        </p>
                                        <p>Total Remaining Balance: ₱{priceSummary.total.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {showDatePicker !== order.orderId && (
                                <button className="terminate" onClick={() => handleTerminate(order.orderId)}>
                                  Terminate
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <img className="vector212" alt="Vector" src={vector} />
            </div>
            <div className="overlap-group-wrapper213">
              <button
                className="div-wrapper213"
                onClick={handleOngoingRentClick}
              >
                <div className="text-wrapper-3213">Ongoing Rent</div>
              </button>
            </div>
            {currentUser.owner ? (
              <div className="group-2213">
                <button
                  className="div-wrapper213"
                  onClick={handleOwnedCarsClick}
                >
                  <div className="text-wrapper-4213">Owned Cars</div>
                </button>
              </div>
            ) : null}
            <div className="group-3213">
              <button
                className="div-wrapper213"
                onClick={handleRentHistoryClick}
              >
                <div className="text-wrapper-4213">Rent History</div>
              </button>
            </div>
            <div className="text-wrapper-5213">Transaction History</div>
          </div>
        )}
      </div>
      {showExtendPaymentPopup && selectedOrder && (
        <ExtendPaymentPopup
          orderId={selectedOrder.orderId} // Pass the orderId
          endDate={new Date(selectedOrder.endDate)} // Pass the updated endDate
          onClose={() => setExtendShowPaymentPopup(false)}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
