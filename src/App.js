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
import Profile from './Components/Profile.js';
import Register from './Components/Register.js';
import ShowImage from './Components/ShowImage.js';
import History from './Components/History.js';
import UpdateCar from './Components/UpdateCar.js';
import PrivateRoute from './PrivateRoute';
import AdminReport from './Components/AdminReport.js';
import AdminDashboard from './Components/AdminDashboard.js';
import ChatPage from './Components/ChatPage.js';
import Messages from './Components/Messages.js'


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
            <Route path="/addcar" element={<AddCar />} />
            <Route path="/updatecar/:carId" element={<PrivateRoute><UpdateCar /></PrivateRoute>} />
            
            <Route path="/adminusers" element={<AdminPrivateRoute><AdminUsers /></AdminPrivateRoute>} />
            <Route path="/admincars" element={<AdminPrivateRoute><AdminCars /></AdminPrivateRoute>} />
            <Route path="/adminverify" element={<AdminPrivateRoute><AdminVerify /></AdminPrivateRoute>} />
            <Route path="/AdminRegister" element={<AdminRegister />} />
            <Route path="/AdminLogin" element={<AdminLogin />} />
            <Route path="/show-image/:id/:type" element={<ShowImage />} />
            <Route path="/adminorder" element={<AdminPrivateRoute><AdminOrder /></AdminPrivateRoute>} />
            <Route path="/admin-dashboard" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
            <Route path="/chats/:chatId" element={<AdminPrivateRoute><ChatPage /></AdminPrivateRoute>} />


            <Route path="/userprofile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/editprofile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            
            <Route path="/adminorder" element={<AdminOrder />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/popup1" element={<CheckoutPopup />} />
            <Route path="/history" element={<History />} />
            <Route path="/adminreport" element={<AdminReport />} />

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
