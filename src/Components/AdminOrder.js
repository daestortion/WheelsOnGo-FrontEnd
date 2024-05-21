import React from "react";
import Dropdown from "../Components/Dropdown.js";
import "../Css/AdminOrder.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";


export const AdminPageOrder = () => {
  return (
    <div className="admin-page-order">
      <div className="div">
        <div className="overlap">
          <img className="rectangle" alt="Rectangle" src={adminbg} />
          <div className="rectangle-2" />

          <button className="group">
              <div className="text-wrapper">Cars</div>
          </button>

          <button className="overlap-wrapper">
              <div className="text-wrapper">Users</div>
          </button>

          <button className="overlap-group-wrapper">
              <div className="text-wrapper-2">Verifications</div>
          </button>

          <button className="group-2">
              <div className="text-wrapper">Orders</div>
          </button>

          <div className="text-wrapper-3">Dashboard</div>
          <img className="vector" alt="Vector" src={vector} />
          <div className="rectangle-3" />
          <div className="text-wrapper-4">Order History</div>
        </div>
      </div>
      <div className="text-wrapper-5">Home</div>
      <div className="text-wrapper-6">Cars</div>
      <div className="text-wrapper-7">About</div>


          <button className="img">
            <img alt="Group" src={profile} />
          </button>
      <img className="sideview" alt="Sideview" src={sidelogo} />
    </div>
  );
};

export default AdminPageOrder;