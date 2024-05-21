import React from "react";
import "../Css/OrderHistory.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import profileIcon from "../Images/profile.png";
import check from "../Images/verified.png";

export const OrderHistory = () => {
  return (
    <div className="order-history">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper">Cars</div>
            <div className="div">About</div>
            <img className="sideview" alt="Sideview" src={sidelogo} />
            <div className="text-wrapper-2">Home</div>
            <Dropdown>
              <button className="group">
                <img  alt="Group" src={profileIcon} />
              </button>
              </Dropdown>
          </div>
          <div className="rectangle" />
          <div className="overlap-2">
            <div className="text-wrapper-3">FirstName LastName</div>
            <img className="vector" alt="Vector" src={check} />
          </div>
          <p className="p">+63 123 456 7890 | youremail@email.org</p>
          <div className="overlap-3">
            <div className="fgh" />
            <div className="rectangle-2" />
          </div>
          <div className="jkl" />
          <div className="overlap-group-wrapper">
            <button className="div-wrapper">
              <div className="text-wrapper-4">Edit Profile</div>
            </button>
          </div>
          <div className="text-wrapper-5">Order History</div>
        </div>
      </div>
    </div>
  );
};
export default OrderHistory;