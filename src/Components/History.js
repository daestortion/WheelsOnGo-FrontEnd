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
  const [currentUser, setCurrentUser] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [priceSummary, setPriceSummary] = useState({
    days: 0,
    pricePerDay: 0,
    total: 0,
  });

  const navigate = useNavigate();

  const fetchOrders = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/user/getAllOrdersFromUser/${userId}`);
      if (response.status === 200) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/user/getUserById/${userId}`);
      if (response.status === 200) {
        setCurrentUser(response.data);
        fetchOrders(response.data.userId);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Server error when fetching user:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarDetails = async (carId) => {
    try {
      const response = await axios.get(`http://localhost:8080/car/getCarById/${carId}`);
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

  const handleExtendRent = async (orderId, endDate, carId) => {
    if (!selectedDate || selectedDate <= new Date(endDate)) {
      alert("Please select a valid date after the current end date.");
      return;
    }

    try {
      const newEndDate = selectedDate.toISOString().split("T")[0]; // Format date to 'YYYY-MM-DD'
      const response = await axios.put(`http://localhost:8080/order/extendOrder/${orderId}`, null, {
        params: {
          newEndDate: newEndDate, // Add newEndDate as a query parameter
        },
      });

      if (response.status === 200) {
        alert("Rental extended successfully!");
        setShowDatePicker(null);
        fetchOrders(currentUser.userId); // Refresh orders after extension
      } else {
        alert("Error extending rent.");
      }
    } catch (error) {
      console.error("Error extending rent:", error);
    }
  };

  const handleDateChange = async (date, endDate, carId) => {
    setSelectedDate(date);
    const car = await fetchCarDetails(carId);
    if (car && date > new Date(endDate)) {
      const days = Math.ceil((date - new Date(endDate)) / (1000 * 60 * 60 * 24)); // Calculate days
      const total = days * car.rentPrice;
      setPriceSummary({
        days,
        pricePerDay: car.rentPrice,
        total,
      });
    } else {
      setPriceSummary({ days: 0, pricePerDay: 0, total: 0 });
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

  return (
    <div className="order-history-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper" onClick={() => navigate("/cars")}>Cars</div>
            <div className="div" onClick={() => navigate("/aboutus")}>About</div>
            <img className="sideview" alt="Sideview" onClick={() => navigate("/home")} src={sidelogo} />
            <div className="text-wrapper-2" onClick={() => navigate("/home")}>Home</div>
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
                      <th>Car Owner</th>
                      <th>Status</th>
                      <th>Actions</th>
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
                        <td>{order.car.owner.username}</td>
                        <td>{order.status === 1 ? "Approved" : "Pending"}</td>
                        <td>
                          <button onClick={() => setShowDatePicker(order.orderId)}>Extend Rent</button>
                          {showDatePicker === order.orderId && (
                            <div>
                              <DatePicker
                                selected={selectedDate}
                                onChange={(date) => handleDateChange(date, order.endDate, order.car.carId)}
                                minDate={new Date(order.endDate)}
                                placeholderText="Select new end date"
                              />
                              <button onClick={() => handleExtendRent(order.orderId, order.endDate, order.car.carId)}>Submit</button>
                              <div className="summary">
                              <h4>Summary of the Cost for Extension:</h4>
                                <p>Days: {priceSummary.days}</p>
                                <p>Price per day: ₱{priceSummary.pricePerDay.toFixed(2)}</p> {/* Format price per day as float */}
                                <p>Total Remaining Balance: ₱{priceSummary.total.toFixed(2)}</p> {/* Format total as float */}
                              </div>
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
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
