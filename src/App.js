import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from './AdminAuthContext';
import AdminPrivateRoute from './AdminPrivateRoute.js';
import { AuthProvider, useAuth } from './AuthContext';
import AboutUs from './Components/AboutUs.js';
import AddCar from './Components/AddCar.js';
import AdminCars from './Components/AdminCars.js';
import { AdminLogin } from './Components/AdminLogin.js';
import AdminOrder from './Components/AdminOrder.js';
import { AdminRegister } from './Components/AdminRegister.js';
import AdminUsers from './Components/AdminUsers.js';
import AdminVerify from './Components/AdminVerify.js';
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
import UpdateCar from './Components/updatecar.js';
import PrivateRoute from './PrivateRoute';


function DebugRoutes() {
    const location = useLocation();
    console.log('Current route:', location.pathname);
    return null;
}

function AuthRoutes() {
    const { isAuthenticated } = useAuth();
    console.log("isAuthenticated:", isAuthenticated);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword" element={<NewPassword />} />
            <Route path="/home" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

            <Route path="/cars" element={<PrivateRoute><Cars /></PrivateRoute>} />
            <Route path="/addcar" element={<PrivateRoute><AddCar /></PrivateRoute>} />
            <Route path="/updatecar" element={<PrivateRoute><UpdateCar /></PrivateRoute>} />
            
            <Route path="/adminusers" element={<AdminPrivateRoute><AdminUsers /></AdminPrivateRoute>} />
            <Route path="/admincars" element={<AdminPrivateRoute><AdminCars /></AdminPrivateRoute>} />
            <Route path="/adminverify" element={<AdminPrivateRoute><AdminVerify /></AdminPrivateRoute>} />
            <Route path="/AdminRegister" element={<AdminRegister />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/show-image/:id/:type" element={<ShowImage />} />
            <Route path="/adminorder" element={<AdminPrivateRoute><AdminOrder /></AdminPrivateRoute>} />

            <Route path="/userprofile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/editprofile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            
            <Route path="/adminorder" element={<AdminOrder />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
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
