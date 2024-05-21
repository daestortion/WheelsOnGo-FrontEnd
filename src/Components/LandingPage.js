import React from "react";
import "../Css/LandingPage.css";
import sidelogo from "../Images/sidelogo.png";
import homecheck from "../Images/homecheck.png";
import car1 from "../Images/car1.png";
import car2 from "../Images/car2.png";
import car3 from "../Images/car3.png";
import line1 from "../Images/linevector.png";
import { Link } from "react-router-dom";

export const LandingPage = () => {
    return (
        <div className="landing-page">
            <div className="div">
                <div className="overlap">
                    <p className="find-book-and-rent-a">
                        <span className="text-wrapper">Find, Book, and Rent a Car in </span>
                        <span className="span">Easy</span>
                        <span className="text-wrapper"> Steps.</span>
                    </p>
                    <img className="vector" alt="Vector" src={homecheck} />
                </div>
                <p className="p">Conquer the open road with Wheels On Go</p>
                <div className="overlap-group">
                    <img className="rectangle" alt="Rectangle" src={car1} />
                    <img className="img" alt="Rectangle" src={car2} />
                    <img className="rectangle-2" alt="Rectangle" src={car3} />
                    <div className="text-wrapper-2">FAMILY CARS</div>
                    <div className="text-wrapper-3">SPORTS CARS</div>
                </div>
                <div className="overlap-2">
                <Link to="/login"><button className="group">
                        <div className="overlap-group-2">
                            <div className="text-wrapper-4">LOGIN</div>
                            <div className="rectangle-3" />
                        </div>
                    </button></Link>
                    <img className="sideview" alt="Sideview" src={sidelogo}/>
                    <div className="overlap-wrapper">
                    <Link to="/register" ><button className="div-wrapper">
                            <div className="text-wrapper-8">SIGN UP</div>
                        </button></Link> 
                    </div>
                </div>
                <img className="vector-2" alt="Vector" src={line1} />
                <div className="overlap-group-wrapper">
                <Link to="/login" ><button className="overlap-3">
                        <div className="text-wrapper-9">BOOK NOW</div>
                    </button></Link> 
                </div>
            </div>
        </div>
    );
};

export default LandingPage;