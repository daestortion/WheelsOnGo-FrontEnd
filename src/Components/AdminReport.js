import axios from 'axios';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import '../Css/AdminReport.css';
import sidelogo from '../Images/sidelogo.png';

const adminFormatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const AdminPageReports = () => {
    const [adminReports, setAdminReports] = useState([]);
    const [adminSelectedReport, setAdminSelectedReport] = useState(null);
    const [adminSelectedChatId, setAdminSelectedChatId] = useState(null);
    const [adminMessages, setAdminMessages] = useState([]);
    const [adminNewMessage, setAdminNewMessage] = useState('');
    const [adminChatExists, setAdminChatExists] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const messagePollInterval = useRef(null);  // Ref to store the interval ID

    useEffect(() => {
        fetchAdminReports();
    }, []);

    // Polling mechanism to fetch messages periodically
    useEffect(() => {
        if (adminSelectedChatId) {
            // Start polling when a chat is selected
            messagePollInterval.current = setInterval(() => {
                fetchAdminMessages(adminSelectedChatId);
            }, 1000); // Poll every second

            // Cleanup interval when component unmounts or chat changes
            return () => {
                clearInterval(messagePollInterval.current);
            };
        }
    }, [adminSelectedChatId]);

    const fetchAdminReports = () => {
        axios.get('http://localhost:8080/report/getAll')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setAdminReports(response.data);
                } else {
                    setAdminReports([]);
                }
            })
            .catch(() => {
                setAdminReports([]);
            });
    };

    const handleAdminReportClick = async (report) => {
        setAdminSelectedReport(report);
        await checkAdminForExistingGroupChat(report.reportId);
    };

    const checkAdminForExistingGroupChat = async (reportId) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/check?reportId=${reportId}`);
            if (response.data && response.data.chatId) {
                setAdminSelectedChatId(response.data.chatId);
                setAdminChatExists(true);
                await fetchAdminMessages(response.data.chatId);
            } else {
                setAdminChatExists(false);
                clearInterval(messagePollInterval.current); // Stop polling if no chat exists
            }
        } catch (error) {
            console.error('Failed to check for existing admin group chat:', error);
        }
    };

    const handleAdminCreateGroupChat = async () => {
        if (adminSelectedReport && !adminChatExists) {
            try {
                const adminId = localStorage.getItem('adminId');
                const reportUserResponse = await axios.get(`http://localhost:8080/user/getUserById/${adminSelectedReport.user.userId}`);
                const reportUser = reportUserResponse.data;

                const chatEntity = {
                    users: [{ userId: reportUser.userId }],
                    status: "pending"
                };

                const response = await axios.post(`http://localhost:8080/chat/create?adminId=${adminId}&reportId=${adminSelectedReport.reportId}`, chatEntity);
                const chatId = response.data.chatId;
                setAdminSelectedChatId(chatId);
                setAdminChatExists(true);
                await fetchAdminMessages(chatId);
            } catch (error) {
                console.error('Failed to create admin group chat:', error);
            }
        }
    };

    const fetchAdminMessages = async (chatId) => {
        try {
            const response = await axios.get(`http://localhost:8080/chat/${chatId}/messages`);
            setAdminMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching admin chat messages:', error);
        }
    };

    const sendAdminMessage = async () => {
        if (adminSelectedChatId && adminNewMessage) {
            try {
                const adminId = localStorage.getItem('adminId');
                await axios.post(`http://localhost:8080/chat/${adminSelectedChatId}/send`, null, {
                    params: {
                        adminId: adminId,
                        messageContent: adminNewMessage
                    }
                });
                setAdminNewMessage('');
                await fetchAdminMessages(adminSelectedChatId);
            } catch (error) {
                console.error('Error sending admin message:', error);
            }
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [adminMessages]);

    const openAddMemberModal = () => {
        setIsAddMemberModalOpen(true);
    };

    const closeAddMemberModal = () => {
        setIsAddMemberModalOpen(false);
        setSearchResults([]);
        setSearchQuery('');
    };

    // Handle search for users based on the query
    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim() !== '') {
            try {
                const response = await axios.get(`http://localhost:8080/user/getAllUsers`);
                const filteredUsers = response.data.filter(user =>
                    `${user.fName} ${user.lName}`.toLowerCase().includes(e.target.value.toLowerCase())
                );
                setSearchResults(filteredUsers);  // Update search results with filtered users
            } catch (error) {
                console.error('Error searching for users:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleUserSelect = (userId) => {
        setSelectedUserId(userId);
    };

    const handleAddUserToChat = async () => {
        if (selectedUserId && adminSelectedChatId) {
            try {
                await axios.post(`http://localhost:8080/chat/${adminSelectedChatId}/addUser`, null, {
                    params: { userId: selectedUserId }
                });
                closeAddMemberModal();
                alert("User added successfully!");
            } catch (error) {
                console.error('Error adding user to chat:', error);
            }
        }
    };

    return (
        <div className="admin-report-page">
            {isAddMemberModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Add a Member</h3>
                        <input
                            type="text"
                            placeholder="Search by name"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <ul className="search-results">
                            {searchResults.map((user) => (
                                <li
                                    key={user.userId}
                                    onClick={() => handleUserSelect(user.userId)}
                                    className={`search-item ${selectedUserId === user.userId ? 'selected' : ''}`}
                                >
                                    {user.fName} {user.lName}
                                </li>
                            ))}
                        </ul>
                        <div className="modal-actions">
                            <button className="btn-add" onClick={handleAddUserToChat}>Add User</button>
                            <button className="btn-cancel" onClick={closeAddMemberModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

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
                    <button className="admin-dashboard-menu-item" onClick={() => navigate('/activitylogs')}>Activity Logs</button>
                </div>

                <div className="admin-dashboard-content">
                    <h2 className="admin-content-title">Reports</h2>

                    <div className="admin-reports-content">
                        <div className="admin-reports-list">
                            {adminReports.map((report) => (
                                <div
                                    key={report.reportId}
                                    className={`admin-report-item ${report.status === 0 ? 'admin-unread' : 'admin-read'} ${adminSelectedReport && adminSelectedReport.reportId === report.reportId ? 'admin-selected' : ''}`}
                                    onClick={() => handleAdminReportClick(report)}
                                >
                                    <div className={`admin-report-title ${report.status === 0 ? 'admin-bold' : ''}`}>{report.title}</div>
                                    <div className="admin-report-user">
                                        {report.user ? `${report.user.fName} ${report.user.lName}` : 'Unknown User'}
                                    </div>
                                </div>
                            ))}

                        </div>

                        <div className="admin-report-details">
                            {adminSelectedReport ? (
                                <div className="admin-report-details-card">
                                    <h2 className="admin-report-title-black">{adminSelectedReport.title}</h2>
                                    <p className="admin-report-description-black">{adminSelectedReport.description}</p>
                                    <p className="admin-report-submitted-by-black">
                                        Submitted by: {adminSelectedReport.user ? `${adminSelectedReport.user.fName} ${adminSelectedReport.user.lName}` : 'Unknown User'}
                                    </p>

                                    {!adminChatExists && (
                                        <button className="admin-create-group-chat-btn" onClick={handleAdminCreateGroupChat}>
                                            Create Group Chat
                                        </button>
                                    )}

                                    {adminSelectedChatId && (
                                        <div className="admin-chat-section">
                                            <h3>Group Chat</h3>
                                            <button onClick={openAddMemberModal} className="add-member-btn">Add Member</button>
                                            <div className="admin-chat-messages">
                                                {adminMessages.map((message, index) => (
                                                    <div key={index} className={`admin-chat-message ${message.adminSender ? 'admin-message' : 'user-message'}`}>
                                                        <div className="admin-chat-bubble">
                                                            {message.messageContent}
                                                            <span className="admin-timestamp">{adminFormatTimestamp(message.sentAt)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div ref={messagesEndRef} />
                                            </div>

                                            <div className="admin-chat-input">
                                                <textarea
                                                    placeholder="Type your message here..."
                                                    value={adminNewMessage}
                                                    onChange={(e) => setAdminNewMessage(e.target.value)}
                                                />
                                                <button onClick={sendAdminMessage}>Send</button>
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
