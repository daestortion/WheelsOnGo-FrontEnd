import React from "react";
import "../Css/RentHistory.css";
import Dropdown from "../Components/Dropdown.js";
import sidelogo from "../Images/sidelogo.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";

export const RentHistory = () => {
  return (
    <div className="rent-history">
      <div className="overlap-wrapper">
        <div className="overlap">
          {/* Navigation */}
          <div className="overlap-group">
            <div className="text-wrapper">Cars</div>
            <div className="div">About</div>
            <img className="sideview" alt="Sideview" src={sidelogo} />
            <div className="text-wrapper-2">Home</div>
            <Dropdown>
            <img className="group" alt="Group" src={profile} />
            </Dropdown>
          </div>

          {/* Other Elements */}
          <div className="overlap-2">
            <div className="fgh" />
            <div className="jkl" />
            <div className="rectangle" />
            <img className="vector" alt="Vector" src={vector} />
          </div>

          {/* Ongoing Rent */}
          <div className="overlap-group-wrapper">
            <button className="div-wrapper">
              <div className="text-wrapper-3">Ongoing Rent</div>
            </button>
          </div>

          {/* Order History */}
          <div className="group-2">
            <button className="div-wrapper12">
              <div className="text-wrapper-4">Order History</div>
            </button>
          </div>

          {/* Rent History */}
          <div className="text-wrapper-5">Rent History</div>
          <div className="group-3">
            <button className="div-wrapper32">
              <div className="text-wrapper-4">Rent History</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentHistory;