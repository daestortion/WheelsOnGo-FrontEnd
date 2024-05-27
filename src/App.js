import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import AdminPrivateRoute from './AdminPrivateRoute.js';
import { AuthProvider } from './AuthContext';
import AboutUs from './Components/AboutUs.js';
import AdminCars from './Components/AdminCars.js';
import { AdminLogin } from './Components/AdminLogin.js';
import AdminOrder from './Components/AdminOrder.js';
import { AdminRegister } from './Components/AdminRegister.js';
import AdminUsers from './Components/AdminUsers.js';
import AdminVerify from './Components/AdminVerify.js';
import CarManagement from './Components/CarManagement.js';
import Cars from './Components/Cars.js';
import CheckoutPopup from './Components/CheckoutPopup.js';
import Dashboard from './Components/Dashboard.js';
import EditProfile from './Components/EditProfile.js';
import ForgotPassword from './Components/Forgetpassword.js';
import Home from './Components/LandingPage.js';
import Login from './Components/Login.js';
import NewPassword from './Components/NewPassword.js';
import OrderHistory from './Components/OrderHistory.js';
import Profile from './Components/Profile.js';
import Register from './Components/Register.js';
import ShowImage from './Components/ShowImage.js';
import UpdateCar from './Components/UpdateCar.js';
import PrivateRoute from './PrivateRoute';

function DebugRoutes() {
    const location = useLocation();
    console.log('Current route:', location.pathname);
    return null;
}

function AuthRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<NewPassword />} />
            <PrivateRoute path="/home" element={<Dashboard />} />

            <PrivateRoute path="/cars" element={<Cars />} />
            <PrivateRoute path="/carmanagement" element={<CarManagement />} />
            <PrivateRoute path="/updatecar" element={<UpdateCar />} />
            
            <AdminPrivateRoute path="/adminusers" element={<AdminUsers />} />
            <AdminPrivateRoute path="/admincars" element={<AdminCars />} />
            <AdminPrivateRoute path="/adminverify" element={<AdminVerify />} />
            <Route path="/adminregister" element={<AdminRegister />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/show-image/:id/:type" element={<ShowImage />} />
            <AdminPrivateRoute path="/adminorder" element={<AdminOrder />} />

            <PrivateRoute path="/userprofile" element={<Profile />} />
            <PrivateRoute path="/editprofile" element={<EditProfile />} />
            
            <AdminPrivateRoute path="/orderhistory" element={<OrderHistory />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/popup1" element={<CheckoutPopup />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <AdminAuthProvider>
                <Router>
                    <div className="App">
                        <DebugRoutes />
                        <AuthRoutes />
                    </div>
                </Router>
            </AdminAuthProvider>
        </AuthProvider>
    );
}

export default App;
