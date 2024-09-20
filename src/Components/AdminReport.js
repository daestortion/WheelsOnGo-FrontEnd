import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/AdminReport.css';
import sidelogo from '../Images/sidelogo.png'; // Updated for consistent design

export const AdminPageReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        axios.get('http://localhost:8080/report')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setReports(response.data);
                } else {
                    setReports([]);
                }
            })
            .catch(() => {
                setReports([]);
            });
    };

    const handleReportClick = (report) => {
        if (report.status === 0) {
            axios.patch(`http://localhost:8080/report/${report.reportId}/status`, { status: 1 })
                .then(() => {
                    const updatedReports = reports.map(r =>
                        r.reportId === report.reportId ? { ...r, status: 1 } : r
                    );
                    setReports(updatedReports);
                    setSelectedReport({ ...report, status: 1 });
                })
                .catch(error => {
                    console.error('Error updating report status:', error);
                });
        } else {
            setSelectedReport(report);
        }
    };

    const handleAdminCars = () => {
        navigate('/admincars');
    };

    const handleAdminVerify = () => {
        navigate('/adminverify');
    };

    const handleAdminUsers = () => {
        navigate('/adminusers');
    };

    const handleOrder = () => {
        navigate('/adminorder');
    };

    const handleAdminDashboard = () => {
        navigate('/admin-dashboard');
    };

    return (
        <div className="admin-report-page">
            {/* Topbar */}
            <div className="admin-dashboard-topbar">
                <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
                <button className="admin-dashboard-logout" onClick={() => navigate('/adminlogin')}>Logout</button>
            </div>

            {/* Sidebar */}
            <div className="admin-dashboard-wrapper">
                <div className="admin-dashboard-sidebar">
                    <button className="admin-dashboard-menu-item" onClick={handleAdminDashboard}>Dashboard</button>
                    <button className="admin-dashboard-menu-item" onClick={handleAdminUsers}>Users</button>
                    <button className="admin-dashboard-menu-item" onClick={handleAdminCars}>Cars</button>
                    <button className="admin-dashboard-menu-item" onClick={handleAdminVerify}>Verifications</button>
                    <button className="admin-dashboard-menu-item" onClick={handleOrder}>Transactions</button>
                    <button className="admin-dashboard-menu-item active">Reports</button>
                </div>

                {/* Main Content */}
                <div className="admin-dashboard-content">
                    <h2 className="content-title">Reports</h2>

                    <div className="reports-content">
                        <div className="reports-list">
                            {reports.map((report) => (
                                <div
                                    key={report.reportId}
                                    className={`report-item ${report.status === 0 ? 'unread' : 'read'} ${selectedReport && selectedReport.reportId === report.reportId ? 'selected' : ''}`}
                                    onClick={() => handleReportClick(report)}
                                >
                                    <div className={`report-title ${report.status === 0 ? 'bold' : ''}`}>{report.title}</div>
                                    <div className="report-user">
                                        {report.user ? (
                                            <>
                                                {report.user.profilePic ? (
                                                    <img
                                                        className="user-profile-pic"
                                                        src={`data:image/jpeg;base64,${report.user.profilePic}`}
                                                        alt={`${report.user.fName} ${report.user.lName}`}
                                                    />
                                                ) : (
                                                    <div className="user-profile-pic-placeholder">
                                                        {report.user.fName.charAt(0)}{report.user.lName.charAt(0)}
                                                    </div>
                                                )}
                                                {report.user.fName} {report.user.lName}
                                                <span>
                                                    on {new Date(report.timeStamp).toLocaleString('en-US', {
                                                        timeZone: 'Asia/Manila',
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: false
                                                    })}
                                                </span>
                                            </>
                                        ) : (
                                            'Unknown User'
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Report Details */}
                        <div className="report-details">
                            {selectedReport ? (
                                <div className="report-details-card">
                                    <h2 className="report-title-black">{selectedReport.title}</h2>
                                    <p className="report-description-black">{selectedReport.description}</p>
                                    <p className="report-submitted-by-black">
                                        Submitted by: {selectedReport.user ? `${selectedReport.user.fName} ${selectedReport.user.lName}` : 'Unknown User'} on{' '}
                                        {new Date(selectedReport.timeStamp).toLocaleString('en-US', {
                                            timeZone: 'Asia/Manila',
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <p className="select-report">Select a report to view details</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageReports;
