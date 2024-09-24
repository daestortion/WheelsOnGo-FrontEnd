import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../Css/AdminDashboard.css"; 
import sidelogo from "../Images/sidelogo.png";  
import { useNavigate } from "react-router-dom";


// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [userData, setUserData] = useState({ total: 0, owners: 0, regular: 0 });
  const [carData, setCarData] = useState({ total: 0, rented: 0, available: 0 });
  const [orderData, setOrderData] = useState({ total: 0, pending: 0, completed: 0 });

  const navigate = useNavigate();

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/getAllUsers");
      const users = response.data;

      let carOwners = 0;
      let regularUsers = 0;

      users.forEach(user => {
        if (user.cars.length > 0) {
          carOwners++;
        } else {
          regularUsers++;
        }
      });

      setUserData({
        total: users.length,
        owners: carOwners,
        regular: regularUsers,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch car data
  const fetchCarData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/car/getAllCars");
      const cars = response.data;

      let rentedCars = 0;
      let availableCars = 0;

      cars.forEach(car => {
        if (car.isRented) {
          rentedCars++;
        } else {
          availableCars++;
        }
      });

      setCarData({
        total: cars.length,
        rented: rentedCars,
        available: availableCars,
      });
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  // Fetch order data
  const fetchOrderData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/order/getAllOrders");
      const orders = response.data;

      let pendingOrders = 0;
      let completedOrders = 0;

      orders.forEach(order => {
        if (order.status === 0) {
          pendingOrders++;
        } else if (order.status === 1) {
          completedOrders++;
        }
      });

      setOrderData({
        total: orders.length,
        pending: pendingOrders,
        completed: completedOrders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCarData();
    fetchOrderData();
  }, []);

  const handleAdminCars = () => {
    navigate('/admincars');
  };

  const handleAdminUsers = () => {
    navigate('/adminusers');
  };

  const handleAdminVerify = () => {
    navigate('/adminverify');
  };

  const handleAdminOrder = () => {
    navigate('/adminorder'); 
  };

  const handleAdminReport = () => {
    navigate('/adminreport'); 
  };

  const handleAdminDashboard = () => {
    navigate('/admin-dashboard'); 
  };

  return (
    <div className="admin-dashboard-page">
      {/* Top navigation bar */}
      <div className="admin-dashboard-topbar">
        <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-dashboard-logout" onClick={() => console.log('Logout clicked')}>
          Logout
        </button>
      </div>

      <div className="admin-dashboard-wrapper">
        {/* Sidebar */}
        <div className="admin-dashboard-sidebar">
          <button className="admin-dashboard-menu-item" onClick={handleAdminDashboard}>Dashboard</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminUsers}>Users</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminCars}>Cars</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminVerify}>Verifications</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminOrder}>Transactions</button>
          <button className="admin-dashboard-menu-item" onClick={handleAdminReport}>Reports</button>
        </div>

        {/* Main Analytics Section */}
        <div className="admin-dashboard-content">
          {/* Summary Cards */}
          <div className="grid-container">
            <div className="card">
              <h3>Total Users</h3>
              <p>{userData.total}</p>
            </div>
            <div className="card">
              <h3>Total Cars</h3>
              <p>{carData.total}</p>
            </div>
            <div className="card">
              <h3>Total Rents</h3>
              <p>{orderData.total}</p>
            </div>
          </div>

          {/* Pie Chart for User Breakdown */}
          <div className="grid-container">
            <div className="chart-section">
              <h3>User Breakdown</h3>
              <div className="chart-container">
                <Pie
                  data={{
                    labels: ["Car Owners", "Regular Users"],
                    datasets: [
                      {
                        data: [userData.owners, userData.regular],
                        backgroundColor: ["#FF6384", "#36A2EB"],
                        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                      },
                    ],
                  }}
                />
              </div>
            </div>

            {/* Bar Chart for Car Breakdown */}
            <div className="chart-section">
              <h3>Cars Breakdown</h3>
              <div className="chart-container">
                <Bar
                  data={{
                    labels: ["Rented Cars", "Available Cars"],
                    datasets: [
                      {
                        label: "Cars",
                        data: [carData.rented, carData.available],
                        backgroundColor: ["#FF6384", "#36A2EB"],
                        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          {/* Line Chart for Orders Over Time */}
          <div className="grid-container">
            <div className="chart-section">
              <h3>Rents Over Time</h3>
              <div className="chart-container">
                <Line
                  data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],  // Static labels for months
                    datasets: [
                      {
                        label: "Completed Orders",
                        data: [12, 19, 3, 5, 2, 3],  // Sample data; replace with API data
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderColor: "rgba(75,192,192,1)",
                        borderWidth: 1,
                        fill: true,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
