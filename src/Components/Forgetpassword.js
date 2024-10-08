import React, { useState } from "react";
import "../Css/Forgetpassword.css";
import logo from "../Images/wheelsongo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/Loading.js";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        setIsLoading(true);
        setMessage(''); // Clear previous message
        try {
            const response = await axios.get(`http://localhost:8080/user/forgot-password`, {
                params: { identifier: email }
            });
            if (response.status === 200) {
                setMessage('An email with a password reset link has been sent to your email address.');
                setError(false);
            }
        } catch (err) {
            setError(true);
            setMessage('There was an error processing your request.');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="forgot-password">
            {isLoading && <Loading />}
            <div className="div11">
                <img className="wheels-on-go" alt="Wheels on go" src={logo} />
                <div className="overlap12">
                    <h1 className="text-wrapper-6">Forgot Password</h1>
                    <span className="text-wrapper">
                        Please enter your email address or username. You will receive a link to create a new password via email.
                    </span>
    
                    <span className="text-wrapper-5">Your Email:</span>
    
                    <input
                        className="div-wrapper"
                        type="email"
                        placeholder="johndoe@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
    
                    {message && (
                        <p className={error ? "error-message" : "success-message"}>
                            {message}
                        </p>
                    )}
    
                    <button onClick={handleResetPassword} className="overlap-group">
                        Send Email
                    </button>
    
                    <div className="already-have-an">
                        <span className="span">Already have an Account? </span>
                        <Link to="/login">
                            <button className="text-wrapper-3">Login</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 

export default ForgotPassword;
    
