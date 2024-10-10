import React, { useEffect, useState, useCallback } from "react";
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
  Filler  
} from "chart.js";
import "../Css/AdminDashboard.css";
import sidelogo from "../Images/sidelogo.png";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler  
);

const AdminDashboard = () => {
  const [userData, setUserData] = useState({ total: 0, owners: 0, regular: 0 });
  const [carData, setCarData] = useState({ total: 0, rented: 0, available: 0, pendingApproval: 0 });
  const [orderData, setOrderData] = useState({ total: 0, pending: 0, completed: 0 });
  const [incomeData, setIncomeData] = useState(0);
  const [rentsPerCar, setRentsPerCar] = useState({ labels: [], datasets: [] });
  const [rentOverTime, setRentOverTime] = useState({ labels: [], datasets: [] });

  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Clear the user session or token here, e.g.:
    localStorage.removeItem('authToken');  // Example if you're storing the token in localStorage

    // Redirect to the login page
    navigate('/adminlogin');
  };

  // Fetch all data in one function for polling
  const fetchData = useCallback(async () => {
    try {
      await fetchUserData();
      await fetchCarData();
      await fetchOrderData();
      await fetchRentsPerCar();
      await fetchRentOverTime();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, []); 

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
      let pendingApproval = 0;

      cars.forEach(car => {
        if (car.isRented) {
          rentedCars++;
        } else if (car.isApproved) {
          availableCars++;
        } else {
          pendingApproval++;
        }
      });

      setCarData({
        total: cars.length,
        rented: rentedCars,
        available: availableCars,
        pendingApproval,
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
      let totalIncome = 0;

      orders.forEach(order => {
        if (order.status === 0) {
          pendingOrders++;
        } else if (order.status === 1) {
          completedOrders++;
          totalIncome += order.totalPrice;
        }
      });

      setOrderData({
        total: orders.length,
        pending: pendingOrders,
        completed: completedOrders,
      });
      setIncomeData(totalIncome);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch rents per car data
  const fetchRentsPerCar = async () => {
    try {
      const response = await axios.get("http://localhost:8080/car/allCarsWithOrders");
      const cars = response.data;
      const labels = cars.map(car => car.carModel);
      const rentCounts = cars.map(car => car.orders.length);

      setRentsPerCar({
        labels,
        datasets: [
          {
            label: "Rents per Car",
            data: rentCounts,
            backgroundColor: "rgba(153, 102, 255, 0.6)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching rents per car:", error);
    }
  };

  // Fetch rent over time data
  const fetchRentOverTime = async () => {
    try {
      const response = await axios.get("http://localhost:8080/order/getAllOrders");
      const orders = response.data;

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRentCounts = Array(12).fill(0);

      orders.forEach(order => {
        const orderMonth = new Date(order.startDate).getMonth();
        monthlyRentCounts[orderMonth]++;
      });

      setRentOverTime({
        labels: months,
        datasets: [
          {
            label: "Rents",
            data: monthlyRentCounts,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            fill: true,  
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching rent over time:", error);
    }
  };

  // Poll the API every 5 seconds
  useEffect(() => {
    fetchData(); 
    const intervalId = setInterval(fetchData, 5000); 

    return () => clearInterval(intervalId); 
  }, [fetchData]); 

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-topbar">
        <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
        <button className="admin-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="admin-dashboard-wrapper">
        {/* Sidebar */}
        <div className="admin-dashboard-sidebar">
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/admin-dashboard')}>Dashboard</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminusers')}>Users</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/admincars')}>Cars</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminverify')}>Verifications</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminorder')}>Transactions</button>
          <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminreport')}>Reports</button>
        </div>

        {/* Main Analytics Section */}
        <div className="admin-dashboard-content">
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
            <div className="card">
              <h3>Pending Rents</h3>
              <p>{orderData.pending}</p>
            </div>
            <div className="card">
              <h3>Pending Car Approvals</h3>
              <p>{carData.pendingApproval}</p>
            </div>
            <div className="card">
              <h3>Total Income</h3>
              <p>{incomeData.toFixed(2)} PHP</p>
            </div>
          </div>

          {/* Charts */}
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
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,  
                    responsive: true,
                  }}
                />
              </div>
            </div>
            <div className="chart-section">
              <h3>Cars Breakdown</h3>
              <Bar
                data={{
                  labels: ["Rented Cars", "Available Cars", "Pending Approval"],
                  datasets: [
                    {
                      label: "Cars",
                      data: [carData.rented, carData.available, carData.pendingApproval],
                      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="grid-container">
            <div className="chart-section">
              <h3>Rents Per Car</h3>
              {rentsPerCar.labels.length > 0 ? (
                <Bar data={rentsPerCar} />
              ) : (
                <p>Loading rents per car...</p>
              )}
            </div>
            <div className="chart-section">
              <h3>Rents Over Time</h3>
              {rentOverTime.labels.length > 0 ? (
                <Line
                  data={{
                    labels: rentOverTime.labels,
                    datasets: rentOverTime.datasets,
                  }}
                />
              ) : (
                <p>Loading rents over time...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
