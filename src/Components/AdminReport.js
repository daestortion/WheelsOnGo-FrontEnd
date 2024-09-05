import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/AdminReport.css';
import adminbg from '../Images/adminbackground.png';
import vector from '../Images/adminvector.png';
import sidelogo from '../Images/sidelogo.png';

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
                console.log('API response:', response.data); // Log the response to check its structure
                if (Array.isArray(response.data)) {
                    setReports(response.data);
                } else {
                    console.error('API response is not an array:', response.data);
                    setReports([]); // Set to an empty array to avoid errors
                }
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
                setReports([]); // Set to an empty array to avoid errors
            });
    };

    const handleReportClick = (report) => {
        if (report.status === 0) {
            axios.patch(`http://localhost:8080/report/${report.reportId}/status`, { status: 1 })
                .then(response => {
                    // Update the report status locally to avoid another fetch
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

    return (
        <div className="admin-page-reports">
            <div className="div">
                <div className="overlap">
                    <img className="rectangle" alt="Rectangle" src={adminbg} />
                    <div className="rectangle-2" />
                    <div className="group">
                        <button className="overlap-group" onClick={handleAdminCars}>
                            <div className="text-wrapper">Cars</div>
                        </button>
                    </div>
                    <div className="overlap-wrapper">
                        <button className="overlap-group" onClick={handleAdminUsers}>
                            <div className="text-wrapper">Users</div>
                        </button>
                    </div>
                    <div className="overlap-group-wrapper">
                        <button className="overlap-group" onClick={handleAdminVerify}>
                            <div className="text-wrapper-2">Verifications</div>
                        </button>
                    </div>
                    <div className="group-2">
                        <button className="overlap-group" onClick={handleOrder}>
                            <div className="text-wrapper">Transactions</div>
                        </button>
                    </div>
                    <div className="text-wrapper-3">Dashboard</div>
                    <img className="vector" alt="Vector" src={vector} />
                    <div className="rectangle-3">
                        <div className="content">
                            <div className="reports-list-header">
                                <h2>Reports</h2>
                            </div>
                            <div className="reports-list">
                                {reports.map((report) => (
                                    <div
                                        key={report.reportId}
                                        className={`report-item ${report.status === 0 ? 'unread' : 'read'} ${selectedReport && selectedReport.reportId === report.reportId ? 'selected' : ''}`}
                                        onClick={() => handleReportClick(report)}
                                    >
                                        <div className={`report-title ${report.status === 0 ? 'bold' : ''}`}>{report.title}</div>
                                        <div className={`report-user ${report.status === 0 ? 'bold' : ''}`}>
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
                                                </>
                                            ) : (
                                                'Unknown User'
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="report-details">
                                {selectedReport ? (
                                    <div className="report-details-card">
                                        <h2 className="report-title-black">{selectedReport.title}</h2>
                                        <p className="report-description-black">{selectedReport.description}</p>
                                        <p className="report-submitted-by-black">Submitted by: {selectedReport.user ? `${selectedReport.user.fName} ${selectedReport.user.lName}` : 'Unknown User'}</p>
                                    </div>
                                ) : (
                                    <p className="select-report">Select a report to view details</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="rectangle-4" />
                    <div className="text-wrapper-5">Reports</div>
                </div>
                <img className="sideview" alt="Sideview" src={sidelogo} />
            </div>
        </div>
    );
};
export default AdminPageReports;
