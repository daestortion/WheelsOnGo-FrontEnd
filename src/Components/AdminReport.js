import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/AdminReport.css';
import sidelogo from '../Images/sidelogo.png';

export const AdminPageReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null); // Store the chat ID
    const [messages, setMessages] = useState([]); // Store chat messages
    const [newMessage, setNewMessage] = useState(''); // Store new message input
    const [chatExists, setChatExists] = useState(false); // Track if chat already exists
    const navigate = useNavigate();

    // Log the stored adminId to check
    console.log('Stored adminId:', localStorage.getItem('adminId'));

    // Fetch reports on component mount
    useEffect(() => {
        fetchReports();
    }, []);

    // Function to fetch reports
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

    // Handle report click and check for existing group chat
    const handleReportClick = async (report) => {
        setSelectedReport(report);
        // Check if the chat already exists
        await checkForExistingGroupChat(report.reportId);
    };

    // Check if a group chat already exists for the selected report
    const checkForExistingGroupChat = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/check?reportId=${reportId}`);
            if (response.data && response.data.chatId) {
                // If chat exists, fetch the messages
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

    // Create a new group chat only if no chat exists
    const handleCreateGroupChat = async () => {
        if (selectedReport && !chatExists) {
            try {
                const adminId = localStorage.getItem('adminId');
                if (!adminId) {
                    console.error('Admin ID not found in localStorage.');
                    return;
                }

                const reportUserResponse = await axios.get(`http://localhost:8080/user/getUserById/${selectedReport.user.userId}`);
                const reportUser = reportUserResponse.data;

                const chatEntity = {
                    users: [{ userId: reportUser.userId }],
                    status: "pending"
                };

                // Create the group chat
                const response = await axios.post(`http://localhost:8080/chat/create?adminId=${adminId}&reportId=${selectedReport.reportId}`, chatEntity);
                const chatId = response.data.chatId;
                setSelectedChatId(chatId);
                setChatExists(true);
                await fetchMessages(chatId);
            } catch (error) {
                console.error('Failed to create group chat:', error);
            }
        } else {
            console.log('Chat already exists, no need to create again.');
        }
    };

    // Fetch chat messages for a specific chatId
    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/${chatId}/messages`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    // Send a new message
    const sendMessage = async () => {
        if (selectedChatId && newMessage) {
            try {
                const adminId = localStorage.getItem('adminId'); // Retrieve adminId from localStorage
                if (!adminId) {
                    console.error('Admin ID not found in localStorage.');
                    return;
                }

                console.log("Sending message as Admin:", newMessage); // Log message being sent

                // Send adminId and messageContent as query parameters in the request URL
                await axios.post(`http://localhost:8080/chat/${selectedChatId}/send`, null, {
                    params: {
                        adminId: adminId, // Pass adminId since it's sent from Admin page
                        messageContent: newMessage
                    }
                });

                setNewMessage(''); // Clear the message input
                await fetchMessages(selectedChatId); // Fetch updated messages after sending
            } catch (error) {
                console.error('Error sending message:', error);
            }
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
            <div className="admin-dashboard-topbar">
                <img className="admin-dashboard-logo" alt="Wheels On Go Logo" src={sidelogo} />
                <button className="admin-dashboard-logout" onClick={() => navigate('/adminlogin')}>Logout</button>
            </div>

            <div className="admin-dashboard-wrapper">
                <div className="admin-dashboard-sidebar">
                    <button className="admin-dashboard-menu-item" onClick={handleAdminDashboard}>Dashboard</button>
                    <button className="admin-dashboard-menu-item" onClick={handleAdminUsers}>Users</button>
                    <button className="admin-dashboard-menu-item" onClick={handleAdminCars}>Cars</button>
                    <button className="admin-dashboard-menu-item" onClick={handleAdminVerify}>Verifications</button>
                    <button className="admin-dashboard-menu-item" onClick={handleOrder}>Transactions</button>
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
                                        {report.user ? (
                                            <>
                                                {report.user.profilePic ? (
                                                    <img
                                                        className="user-profile-pic"
                                                        src={`data:image/jpeg;base64,${report.user.profilePic}`}
                                                        alt={`${report.user.fName || ''} ${report.user.lName || ''}`}
                                                    />
                                                ) : (
                                                    <div className="user-profile-pic-placeholder">
                                                        {report.user.fName?.charAt(0) || 'U'}{report.user.lName?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                {report.user.fName || 'Unknown'} {report.user.lName || 'User'}
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

                                    {/* Create Group Chat Button */}
                                    {!chatExists && (
                                        <button className="create-group-chat-btn" onClick={handleCreateGroupChat}>
                                            Create Group Chat
                                        </button>
                                    )}

                                    {/* Chat Section */}
                                    {selectedChatId && (
                                        <div className="chat-section">
                                            <h3>Group Chat</h3>
                                            <div className="chat-messages">
                                                {messages.map((message, index) => (
                                                    <div key={index} className="chat-message">
                                                        {/* Display Admin or User Name Based on Sender */}
                                                        {message.adminSender ? (
                                                            <strong>Admin: {message.adminSender.fName} {message.adminSender.lName}</strong>
                                                        ) : message.sender ? (
                                                            <strong>{message.sender.fName} {message.sender.lName || ''}:</strong>
                                                        ) : (
                                                            <strong>Unknown User:</strong>
                                                        )}

                                                        {/* Display the message content */}
                                                        {message?.messageContent ? message.messageContent : 'No content'}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="chat-input">
                                                <textarea
                                                    placeholder="Type your message here..."
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    value={newMessage}
                                                />
                                                <button onClick={sendMessage}>Send</button>
                                            </div>
                                        </div>
                                    )}
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
