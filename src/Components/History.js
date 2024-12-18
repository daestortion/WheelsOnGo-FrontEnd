import axios from "axios";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "../Css/History.css";
import ExtendPaymentPopup from "./ExtendPaymentPopup";
import Header from "./Header.js";
import Loading from "./Loading"; // Import Loading component
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary
import TerminatedPopup from "./TermindatedPopup.js";
import ViewPaymentPopup from './ViewPaymentPopup';
import moment from 'moment-timezone';

// Utility function to format dates
const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "N/A";
};

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showTerminatedPopup, setShowTerminatedPopup] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false); // Loading state for calendar
  const [showOwnedCars, setShowOwnedCars] = useState(false);
  const [showOngoingRents, setShowOngoingRents] = useState(false);
  const [showExtendPaymentPopup, setExtendShowPaymentPopup] = useState(false); // State to control PaymentPopup
  const [filter, setFilter] = useState("all");
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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  // Fetch all orders to disable booked dates
  const fetchBookedDates = async () => {
    setIsCalendarLoading(true); // Start loading calendar
    try {
      const response = await axios.get(
        `${BASE_URL}/order/getAllOrders`
      );
      const orders = response.data;

      // Filter orders that are not returned and extract booked dates
      const bookedDates = orders
        .filter(order => !order.returned) // Exclude returned orders
        .map(order => {
          let dates = [];
          let currentDate = new Date(order.startDate);
          const endDate = new Date(order.endDate);

          // Push all dates between startDate and endDate
          while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1); // Move to next day
          }
          return dates;
        })
        .flat(); // Flatten array to get a list of all booked dates

      setDisabledDates(bookedDates); // Store in state to disable these dates in the calendar
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    } finally {
      setIsCalendarLoading(false); // Stop loading calendar
    }
  };

  const fetchOrders = async (userId) => {
    setIsLoading(true); // Start loading when fetching begins
    try {
      const response = await axios.get(
        `${BASE_URL}/user/getAllOrdersFromUser/${userId}`
      );
      if (response.status === 200) {
        console.log(response.data);
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
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${BASE_URL}/car/getCarById/${carId}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
    return null;
  };

  // Fetch orders by car ID
  const fetchOrdersByCarId = async (carId) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${BASE_URL}/order/getOrdersByCarId/${carId}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching car orders:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
    return [];
  };

  // Fetch car orders (owned cars)
  const fetchCarOrdersByUserId = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/user/${userId}/carOrders`
      );
      if (response.status === 200) {
        const ordersWithProofAndAcknowledgment = await Promise.all(
          response.data.map(async (order) => ({
            ...order,
            returnProofExists: await checkReturnProofExists(order.orderId),
            ownerAcknowledged: await checkOwnerAcknowledgment(order.orderId),
          }))
        );
        setOrders(ordersWithProofAndAcknowledgment);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching car orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };



  // Fetch user data and orders
  const fetchUserData = async (userId) => {
    setIsLoading(true); // Start loading when fetching user data
    try {
      const response = await axios.get(
        `${BASE_URL}/user/getUserById/${userId}`
      );
      if (response.status === 200) {
        setCurrentUser(response.data);
        await fetchOrders(response.data.userId);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    } finally {
      setIsLoading(false); // Stop loading
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

  const handleTerminate = async (orderId) => {
    setIsLoading(true); // Start loading
    try {
      // Check the current status of the order
      const statusResponse = await axios.get(`${BASE_URL}/order/getOrderStatus/${orderId}`);
      const currentStatus = statusResponse.data;

      // Proceed to terminate the order regardless of its status
      const response = await axios.put(`${BASE_URL}/order/terminateOrder/${orderId}`);

      if (response.status === 200 && response.data) {
        const { updatedOrder } = response.data;

        if (updatedOrder) {
          // If the order is not approved (status !== 1), skip wallet operations
          if (currentStatus !== 1) {
            console.log("Order not approved, skipping wallet operations.");
            setOrders((prevOrders) =>
              prevOrders.map((order) =>
                order.orderId === orderId
                  ? { ...order, terminated: true, active: false }
                  : order
              )
            );
            setShowTerminatedPopup(true);
            return; // Exit early to skip wallet-related logic
          }

          // Wallet operations for approved orders (status === 1)
          const latestPaymentAmount = updatedOrder.payments && updatedOrder.payments.length > 0
            ? updatedOrder.payments[updatedOrder.payments.length - 1].amount
            : 0;

          // Determine if the first payment method is cash
          const isCashPayment = updatedOrder.payments && updatedOrder.payments[0].paymentMethod === "Cash";

          // Apply refund percentage logic
          let refundPercentage = 0.0;
          if (isCashPayment) {
            refundPercentage = 0.15;
          } else {
            const startDate = new Date(updatedOrder.startDate);
            const terminationDate = new Date(updatedOrder.terminationDate);
            const dateDifference = Math.ceil((startDate - terminationDate) / (1000 * 3600 * 24));

            if (dateDifference >= 3) {
              refundPercentage = 0.85;
            } else if (dateDifference >= 1 && dateDifference <= 2) {
              refundPercentage = 0.50;
            } else {
              refundPercentage = 0.0;
            }
          }

          const refundAmount = latestPaymentAmount * refundPercentage;

          const userId = updatedOrder.user ? updatedOrder.user.userId : null;

          // Only add funds to the user's wallet if the payment is not cash
          if (userId && !isCashPayment) {
            await axios.put(`${BASE_URL}/wallet/addFunds`, {
              userId: userId,
              amount: refundAmount,
            });
          }

          const ownerId = updatedOrder.car && updatedOrder.car.owner ? updatedOrder.car.owner.userId : null;
          if (ownerId) {
            // Deduct refund from the owner's wallet
            await axios.put(
              `${BASE_URL}/ownerWallet/deductRefund/${ownerId}`,
              null,
              {
                params: {
                  refundAmount: refundAmount,
                  isCashPayment: isCashPayment,
                },
              }
            );
          }

          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId
                ? { ...order, terminated: true, active: false }
                : order
            )
          );

          setShowTerminatedPopup(true);
        } else {
          alert("Failed to process refund. Please try again.");
        }
      } else {
        alert("Failed to terminate the order. Please try again.");
      }
    } catch (error) {
      console.error("Error terminating order:", error);
      alert("Error terminating the order. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };


  const handleReturnCar = (orderId) => {
    navigate(`/returncar/${orderId}`);
  };

  // Handle car returned action
  const handleCarReturned = (orderId) => {
    navigate(`/return-car-form/${orderId}`);
  };

  // Handle approve order action
  const handleApprove = async (orderId) => {
    setIsLoading(true);
    try {
      // Approve the order
      const response = await fetch(
        `${BASE_URL}/order/approveOrder/${orderId}`,
        { method: "PUT" }
      );

      if (response.ok) {
        const updatedOrder = await response.json(); // Fetch the updated order details

        // Get ownerId from the updatedOrder
        const ownerId = updatedOrder.car && updatedOrder.car.owner ? updatedOrder.car.owner.userId : null;

        if (!ownerId) {
          console.error("Owner ID not found in the order details.");
          setIsLoading(false);
          return;
        }

        // Calculate 15% of the order's total price
        const amount = updatedOrder.totalPrice;

        // Update the order's active status in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, active: 1 } : order
          )
        );

        // Update cash earnings for the owner
        try {
          await axios.put(
            `${BASE_URL}/ownerWallet/addToCashEarnings/${ownerId}`,
            null,
            { params: { amount } }
          );
          console.log(`Cash earnings updated for ownerId ${ownerId}: ₱${amount.toFixed(2)}`);
        } catch (error) {
          console.error("Error updating cash earnings:", error);
        }
      } else {
        console.error("Failed to approve order:", response.statusText);
      }
    } catch (error) {
      console.error("Error approving order:", error);
    } finally {
      setIsLoading(false); // Ensure loading is stopped after the operation
    }
  };

  const handleDateChange = async (date, endDate, carId) => {
    setSelectedDate(date);
    setIsCalendarLoading(true); // Start loading for calendar

    // Fetch the car details and associated orders
    const car = await fetchCarDetails(carId);
    const orders = await fetchOrdersByCarId(carId);

    // Prepare booked dates by filtering only active or non-returned orders
    const bookedDates = orders
      .filter((order) => !order.returned && new Date(order.startDate) <= date && new Date(order.endDate) >= date)
      .map((order) => {
        let dates = [];
        let currentDate = new Date(order.startDate);
        const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
        while (currentDate <= new Date(order.endDate)) {
          dates.push(new Date(currentDate)); // Add each date in the range between startDate and endDate
          currentDate = addDays(currentDate, 1);
        }
        return dates;
      })
      .flat(); // Flatten to a single array of dates

    setDisabledDates(bookedDates); // Set disabled dates in state

    if (car && date > new Date(endDate)) {
      const days = Math.ceil((date - new Date(endDate)) / (1000 * 60 * 60 * 24));
      const total = days * car.rentPrice;
      setPriceSummary({ days, pricePerDay: car.rentPrice, total });
    } else {
      setPriceSummary({ days: 0, pricePerDay: 0, total: 0 });
    }

    setIsCalendarLoading(false); // Stop loading for calendar
  };

  // Handle extend rent action
  const handleExtendRent = (orderId, endDate) => {
    // Check if a date has been selected and it's valid (after the current end date)
    if (showDatePicker === orderId && selectedDate && selectedDate > new Date(endDate)) {
      // Convert the selected date to Manila time
      const adjustedDate = moment(selectedDate).tz('Asia/Manila').set({ hour: 12, minute: 0, second: 0, millisecond: 0 });

      const newEndDate = adjustedDate.format('YYYY-MM-DD'); // Format the date as YYYY-MM-DD

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
      // console.log("Stored user ID:", userId);
      fetchUserData(userId);
      fetchBookedDates(); // Fetch booked dates for disabling calendar
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
        return "Terminated";
      case 3:
        return "Finished";
      default:
        return "Unknown";
    }
  };

  const getActivity = (activity) => {
    return activity ? "Active" : "Inactive";
  };

  const fetchPayments = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/order/${orderId}/payments`);
      console.log(response.data);
      setPayments(response.data);
      setShowPopup(true); // Show the popup after payments are fetched
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (orderId) => {
    fetchPayments(orderId);
    console.log(`View payment for order ID: ${orderId}`);
  };

  const checkReturnProofExists = async (orderId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/returnProof/exists/${orderId}`

      );
      return response.data; // Return true if proof exists
    } catch (error) {
      console.error("Error checking return proof:", error);
      return false; // Assume no proof if an error occurs
    }
  };

  const checkOwnerAcknowledgment = async (orderId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/returnProof/getAcknowledgmentStatus/${orderId}`
      );
      return response.data; // Return true if acknowledgment exists
    } catch (error) {
      console.error("Error checking acknowledgment status:", error);
      return false; // Assume no acknowledgment if an error occurs
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    switch (filter) {
      case "active":
        return order.active === true; // Filter by active orders
      case "Terminated":
        return order.terminated === true; // Filter by terminated orders
      case "Returned":
        return order.returned === true; // Filter by returned orders
      default:
        return true; // No filter applied, show all orders
    }
  });

  const handleViewAcknowledgement = (orderId) => {
    navigate(`/view-acknowledgement/${orderId}`);
  };

  return (
    <div className="order-history-page">
      <Header />

      <div className="overlap-wrapper213">

        <div className="grouping2">
          <div className="text-wrapper-5213">Transaction History</div>

          <div className="grouping1">
            <button
              className="div-wrapper213"
              onClick={handleOngoingRentClick}
            >
              Ongoing Rent
            </button>

            {currentUser.owner ? (
              <button
                className="div-wrapper213"
                onClick={handleOwnedCarsClick}
              >
                Owned Cars
              </button>
            ) : null}


            <button
              className="div-wrapper213"
              onClick={handleRentHistoryClick}
            >
              Rent History
            </button>
          </div>
        </div>

        {isLoading ? (
          <Loading /> // Show loading spinner while loading
        ) : (
          <div className="overlap213">
            <div className="rectangle213">
              <div className="table-container213">
                {showOwnedCars && (
                  <div className="filter-container">
                    <select onChange={handleFilterChange} value={filter} className="user-filter">
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="Terminated">Terminated</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </div>
                )}
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
                      {showOwnedCars && <th>Approve</th>}
                      <th>Status</th>
                      <th>Activity</th>
                      <th>Termination</th>
                      {!showOwnedCars && !showOngoingRents && <th>Return</th>}
                      {showOwnedCars && <th>Return Status</th>}
                      {showOngoingRents && <th>Actions</th>}
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      return (
                        <tr key={order.orderId}>
                          <td>{order.car.carBrand} {order.car.carModel}</td>
                          <td>{formatDate(order.startDate)}</td>
                          <td>{formatDate(order.endDate)}</td>
                          <td>₱{order.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td>{order.referenceNumber}</td>
                          <td>{order.car.address}</td>
                          <td>{order.car.owner.username}</td>
                          <td>{order.car.owner.pNum}</td>
                          <td>{order.paymentOption}</td>
                          {showOwnedCars && (
                            <td>
                              <button
                                className="return"
                                onClick={() => handleApprove(order.orderId)}
                                disabled={order.terminated || order.returned || order.paymentOption !== 'Cash' || order.status == 1}
                              >
                                Approve
                              </button>
                            </td>
                          )}
                          <td>{getStatusText(order.status)}</td>
                          <td>{getActivity(order.active)}</td>
                          <td>
                            {order.terminated
                              ? `Terminated on ${new Date(order.terminationDate).toISOString().split("T")[0]}`
                              : ""}
                          </td>
                          {!showOwnedCars && !showOngoingRents && (
                            <td>
                              <button
                                className="terminate"
                                onClick={() => handleTerminate(order.orderId)}
                                disabled={order.terminated || order.active || order.returned || order.returnProof != null}
                              >
                                Terminate
                              </button>
                              {order.returnProof != null ? (
                                <>
                                  {order.returnProof.ownerApproval ? (
                                    <>
                                      <button
                                        className="return-cars"
                                        onClick={() => handleViewAcknowledgement(order.orderId)} // Redirect to view acknowledgment
                                      >
                                        View Acknowledgement
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="return-cars"
                                        onClick={() => handleViewAcknowledgement(order.orderId)} // Redirect to view acknowledgment
                                      >
                                        View Submission
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : (
                                <button
                                  className="return-cars"
                                  onClick={() => handleReturnCar(order.orderId)}
                                  disabled={!order.active || order.terminated || order.returnProof != null}
                                >
                                  Return Car
                                </button>
                              )}
                            </td>
                          )}
                          {showOwnedCars && (
                            <td>
                              {order.returnProofExists ? (
                                order.ownerAcknowledged ? (
                                  <>
                                    <button
                                      className="return-cars"
                                      onClick={() => handleViewAcknowledgement(order.orderId)}
                                      style={{ marginLeft: "10px" }}
                                    >
                                      View Acknowledgement
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="return"
                                    onClick={() => handleCarReturned(order.orderId)}
                                    disabled={order.terminated || order.returned}
                                  >
                                    View Proof
                                  </button>
                                )
                              ) : (
                                "Not Yet Returned"
                              )}
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
                                    <div className="datepicker-wrapper">
                                      <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) =>
                                          handleDateChange(date, order.endDate, order.car.carId)
                                        }
                                        minDate={new Date(new Date(order.endDate).getTime() + 24 * 60 * 60 * 1000)} // Ensure the new end date is after the current end date
                                        excludeDates={disabledDates} // Disable already booked dates
                                        placeholderText="Select new end date"
                                        className="custom-datepicker"
                                        calendarClassName="custom-calendar"
                                      />
                                      <div className="summary">
                                        <h4>Summary of the Cost for Extension:</h4>
                                        <p>Days: {priceSummary.days}</p>
                                        <p>Price per day: ₱{priceSummary.pricePerDay.toFixed(2)}</p>
                                        <p>Total Remaining Balance: ₱{priceSummary.total.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                              {showDatePicker !== order.orderId && (
                                <button
                                  className="return-cars"
                                  onClick={() => handleReturnCar(order.orderId)}
                                  disabled={!order.active || order.terminated || order.returnProof != null}
                                >
                                  Return Car
                                </button>
                              )}
                            </td>
                          )}
                          {/* Add Payment column with "View Payment" button */}
                          <td>
                            <button
                              className="view-payment-button"
                              onClick={() => handleViewPayment(order.orderId)}
                            >
                              View Payment
                            </button>

                            {/* Show loading indicator while fetching */}
                            {loading && <div>Loading...</div>}

                            {/* Conditionally render the popup if showPopup is true */}
                            {showPopup && (
                              <ViewPaymentPopup
                                payments={payments}
                                onClose={() => setShowPopup(false)}
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>

              </div>
            </div>
          </div>
        )}
      </div>
      {showTerminatedPopup && <TerminatedPopup />}
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
