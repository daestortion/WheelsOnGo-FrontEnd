import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/AdminReport.css';
import sidelogo from '../Images/sidelogo.png';

// Helper function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const AdminPageReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatExists, setChatExists] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        axios.get('http://localhost:8080/report/getAll')
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

    const handleReportClick = async (report) => {
        setSelectedReport(report);
        await checkForExistingGroupChat(report.reportId);
    };

    const checkForExistingGroupChat = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/check?reportId=${reportId}`);
            if (response.data && response.data.chatId) {
                setSelectedChatId(response.data.chatId);
                setChatExists(true);
                await fetchMessages(response.data.chatId);
            } else {
                setChatExists(false);
                console.log('No chat found. You can create a new one.');
            }
        } catch (error) {
            console.error('Failed to check for existing group chat:', error);
        }
    };

    const handleCreateGroupChat = async () => {
        if (selectedReport && !chatExists) {
            try {
                const adminId = localStorage.getItem('adminId');
                const reportUserResponse = await axios.get(`http://localhost:8080/user/getUserById/${selectedReport.user.userId}`);
                const reportUser = reportUserResponse.data;

                const chatEntity = {
                    users: [{ userId: reportUser.userId }],
                    status: "pending"
                };

                const response = await axios.post(`http://localhost:8080/chat/create?adminId=${adminId}&reportId=${selectedReport.reportId}`, chatEntity);
                const chatId = response.data.chatId;
                setSelectedChatId(chatId);
                setChatExists(true);
                await fetchMessages(chatId);
            } catch (error) {
                console.error('Failed to create group chat:', error);
            }
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/${chatId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessage = async () => {
        if (selectedChatId && newMessage) {
            try {
                const adminId = localStorage.getItem('adminId');
                await axios.post(`http://localhost:8080/chat/${selectedChatId}/send`, null, {
                    params: {
                        adminId: adminId,
                        messageContent: newMessage
                    }
                });
                setNewMessage('');
                await fetchMessages(selectedChatId);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (selectedChatId) {
                fetchMessages(selectedChatId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [selectedChatId]);

    return (
        <div className="admin-report-page">
            <div className="admin-dashboard-topbar">
                <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
                <button className="admin-dashboard-logout" onClick={() => navigate('/adminlogin')}>Logout</button>
            </div>

            <div className="admin-dashboard-wrapper">
                <div className="admin-dashboard-sidebar">
                    <button className="admin-dashboard-menu-item" onClick={() => navigate('/admin-dashboard')}>Dashboard</button>
                    <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminusers')}>Users</button>
                    <button className="admin-dashboard-menu-item" onClick={() => navigate('/admincars')}>Cars</button>
                    <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminverify')}>Verifications</button>
                    <button className="admin-dashboard-menu-item" onClick={() => navigate('/adminorder')}>Transactions</button>
                    <button className="admin-dashboard-menu-item active">Reports</button>
                </div>

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
                                        {report.user ? `${report.user.fName} ${report.user.lName}` : 'Unknown User'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="report-details">
                            {selectedReport ? (
                                <div className="report-details-card">
                                    <h2 className="report-title-black">{selectedReport.title}</h2>
                                    <p className="report-description-black">{selectedReport.description}</p>
                                    <p className="report-submitted-by-black">
                                        Submitted by: {selectedReport.user ? `${selectedReport.user.fName} ${selectedReport.user.lName}` : 'Unknown User'}
                                    </p>

                                    {!chatExists && (
                                        <button className="create-group-chat-btn" onClick={handleCreateGroupChat}>
                                            Create Group Chat
                                        </button>
                                    )}

                                    {selectedChatId && (
                                        <div className="chat-section">
                                            <h3>Group Chat</h3>
                                            <div className="chat-messages">
                                                {messages.map((message, index) => (
                                                    <div key={index} className={`chat-message ${message.adminSender ? 'admin-message' : 'user-message'}`}>
                                                        <div className="chat-bubble">
                                                            {message.messageContent}
                                                            <span className="timestamp">{formatTimestamp(message.sentAt)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="chat-input">
                                                <textarea
                                                    placeholder="Type your message here..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                />
                                                <button onClick={sendMessage}>Send</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p>Select a report to view details</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPageReports;
