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
                <div className="overlap">
                    <p className="text-wrapper">
                        Please enter your email address or username. You will receive a link to create a new password via email.
                    </p>
                    <input
                        className="div-wrapper"
                        type="email"
                        placeholder="johndoe@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="text-wrapper-5">Your Email:</div>
                    <div className="text-wrapper-6">Forgot Password</div>
                    
                    <div className="group">
                        <button onClick={handleResetPassword} className="overlap-group">
                            Send Email
                        </button>
                    </div>
                    <p className="already-have-an">
                        <span className="span">Already have an Account? </span>
                        <Link to="/login"> <button className="text-wrapper-3">Login</button> </Link>
                    </p>
                    <p className={error ? "error-message" : "success-message"}>{message}</p>
                </div>
                <img className="wheels-on-go" alt="Wheels on go" src={logo} />
            </div>
        </div>
    );
};

export default ForgotPassword;
