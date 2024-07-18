import React from "react";
import "../Css/AdminReport.css";
import adminbg from "../Images/adminbackground.png";
import vector from "../Images/adminvector.png";
import sidelogo from "../Images/sidelogo.png";

export const AdminPageReports = () => {
    return (
        <div className="admin-page-reports">
            <div className="div">
                <div className="overlap">
                    <img className="rectangle" alt="Rectangle" src={adminbg} />
                    <div className="rectangle-2" />
                    <div className="group">
                        <button className="overlap-group">
                            <div className="text-wrapper">Cars</div>
                        </button>
                    </div>
                    <div className="overlap-wrapper">
                        <button className="overlap-group">
                            <div className="text-wrapper">Users</div>
                        </button>
                    </div>
                    <div className="overlap-group-wrapper">
                        <button className="overlap-group">
                            <div className="text-wrapper-2">Verifications</div>
                        </button>
                    </div>
                    <div className="group-2">
                        <button className="overlap-group">
                            <div className="text-wrapper">Orders</div>
                        </button>
                    </div>
                    <div className="text-wrapper-3">Dashboard</div>
                    <img className="vector" alt="Vector" src={vector} />
                    <div className="rectangle-3" />
                    <div className="text-wrapper-4">Reports</div>
                    <div className="rectangle-4" />
                    <div className="text-wrapper-5">Reports</div>
                </div>
                <img className="sideview" alt="Sideview" src={sidelogo} />
            </div>
        </div>
    );
};
export default AdminPageReports;