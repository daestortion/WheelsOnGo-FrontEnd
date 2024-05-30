import React from "react";
import "../Css/OrderHistoryPage.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";

export const OrderHistoryPage = () => {
  return (
    <div className="order-history-page">
      <div className="overlap-wrapper">
        <div className="overlap">
          <div className="overlap-group">
            <div className="text-wrapper">Cars</div>
            <div className="div">About</div>

            <img className="sideview" alt="Sideview" src={sidelogo} />

            <div className="text-wrapper-2">Home</div>
            <Dropdown>
            <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>
          <div className="overlap-2">
            <div className="fgh" />
            <div className="jkl" />
            <div className="rectangle" />
            <img className="vector" alt="Vector" src={vector}/>
          </div>
          <div className="overlap-group-wrapper">
            <div className="div-wrapper">
              <div className="text-wrapper-3">Rent History</div>
            </div>
          </div>
          <div className="group-2">
            <div className="div-wrapper">
              <div className="text-wrapper-4">Order History</div>
            </div>
          </div>
          <div className="group-3">
            <div className="div-wrapper">
              <div className="text-wrapper-4">Ongoing Rent</div>
            </div>
          </div>
          <div className="text-wrapper-5">Order History</div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;