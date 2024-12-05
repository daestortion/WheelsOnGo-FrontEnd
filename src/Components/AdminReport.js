import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminReport.css";
import sidelogo from "../Images/sidelogo.png";
import Loading from "./Loading";
import { BASE_URL } from '../ApiConfig';  // Adjust the path if necessary

const adminFormatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const AdminPageReports = () => {
  const [adminReports, setAdminReports] = useState([]);
  const [adminSelectedReport, setAdminSelectedReport] = useState(null);
  const [adminSelectedChatId, setAdminSelectedChatId] = useState(null);
  const [adminMessages, setAdminMessages] = useState([]);
  const [adminNewMessage, setAdminNewMessage] = useState("");
  const [adminChatExists, setAdminChatExists] = useState(false);
  const [isAddMemberVisible, setIsAddMemberVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const messagePollInterval = useRef(null);

  useEffect(() => {
    fetchAdminReports();
  }, []);

  useEffect(() => {
    if (adminSelectedChatId) {
      messagePollInterval.current = setInterval(() => {
        fetchAdminMessages(adminSelectedChatId);
      }, 1000);

      return () => {
        clearInterval(messagePollInterval.current);
      };
    }
  }, [adminSelectedChatId]);

  const fetchAdminReports = () => {
    setIsLoading(true);
    axios
      .get(`${BASE_URL}/report/getAll`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setAdminReports(response.data);
        } else {
          setAdminReports([]);
        }
      })
      .catch(() => {
        setAdminReports([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdminReportClick = async (report) => {
    setAdminSelectedReport(report);
    await checkAdminForExistingGroupChat(report.reportId);
  };

  const checkAdminForExistingGroupChat = async (reportId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/chat/check?reportId=${reportId}`
      );
      if (response.data && response.data.chatId) {
        setAdminSelectedChatId(response.data.chatId);
        setAdminChatExists(true);
        await fetchAdminMessages(response.data.chatId);
      } else {
        setAdminChatExists(false);
        clearInterval(messagePollInterval.current);
      }
    } catch (error) {
      console.error("Failed to check for existing admin group chat:", error);
    }
  };

  const handleAdminCreateGroupChat = async () => {
    if (adminSelectedReport && !adminChatExists) {
      try {
        const adminId = localStorage.getItem("adminId");
        const reportUserResponse = await axios.get(
          `${BASE_URL}/user/getUserById/${adminSelectedReport.user.userId}`
        );
        const reportUser = reportUserResponse.data;

        const chatEntity = {
          users: [{ userId: reportUser.userId }],
          status: "pending",
        };

        const response = await axios.post(
          `${BASE_URL}/chat/create?adminId=${adminId}&reportId=${adminSelectedReport.reportId}`,
          chatEntity
        );
        const chatId = response.data.chatId;
        setAdminSelectedChatId(chatId);
        setAdminChatExists(true);
        await fetchAdminMessages(chatId);
      } catch (error) {
        console.error("Failed to create admin group chat:", error);
      }
    }
  };

  const fetchAdminMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/chat/${chatId}/messages`
      );
      setAdminMessages(response.data);
    } catch (error) {
      console.error("Error fetching admin chat messages:", error);
    }
  };

  const sendAdminMessage = async () => {
    if (adminSelectedChatId && adminNewMessage) {
      try {
        const adminId = localStorage.getItem("adminId");
        await axios.post(
          `${BASE_URL}/chat/${adminSelectedChatId}/send`,
          null,
          {
            params: {
              adminId: adminId,
              messageContent: adminNewMessage,
            },
          }
        );
        setAdminNewMessage("");
        await fetchAdminMessages(adminSelectedChatId);
      } catch (error) {
        console.error("Error sending admin message:", error);
      }
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/chat/${adminSelectedChatId}/available-users`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  };

  const handleAddUser = async (userId, username) => {
    try {
      await axios.post(
        `${BASE_URL}/chat/${adminSelectedChatId}/addUser`,
        null,
        { params: { userId } }
      );
      
      // Send a message to the chat indicating that the user was added
      const adminId = localStorage.getItem("adminId");
      const messageContent = `Admin added ${username} to the chat`;
  
      // Send this message in the chat
      await axios.post(
        `${BASE_URL}/chat/${adminSelectedChatId}/send`,
        null,
        {
          params: {
            adminId: adminId,
            messageContent: messageContent,
          },
        }
      );
  
      // Refresh the chat messages and available users
      fetchAdminMessages(adminSelectedChatId); // Refresh the chat messages
      fetchAvailableUsers(); // Refresh the available users
    } catch (error) {
      console.error("Error adding user to chat:", error);
    }
  };

  const toggleAddMemberField = () => {
    setIsAddMemberVisible(!isAddMemberVisible);
    if (!isAddMemberVisible) fetchAvailableUsers(); // Fetch users when opening
  };

  const renderAdminMessages = () => {
    const adminId = parseInt(localStorage.getItem("adminId"));
    return adminMessages.map((message, index) => {
      const isSystemMessage =
        message.messageContent && message.messageContent.includes("Admin added");

      return (
        <div
          key={index}
          className={`admin-chat-message ${
            message.adminId === adminId || message.sender?.userId === adminId
              ? "sender-message"
              : "receiver-message"
          }`}
        >
          {isSystemMessage ? (
            // This is the system notification message
            <div className="admin-chat-system-message">
              {message.messageContent}
            </div>
          ) : (
            // Regular chat messages
            <div
              className={`admin-chat-bubble ${
                message.adminId === adminId || message.sender?.userId === adminId
                  ? "bubble-right"
                  : "bubble-left"
              }`}
            >
              <div className="sender-name">{message.senderLabel || "Unknown"}</div>
              {message.messageContent}
              <span className="admin-timestamp">
                {adminFormatTimestamp(message.sentAt)}
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="admin-report-page">
      {isLoading && <Loading />}
      <div className="admin-dashboard-topbar">
        <img
          className="admin-dashboard-logo"
          alt="Wheels On Go Logo"
          src={sidelogo}
        />
        <button
          className="admin-dashboard-logout"
          onClick={() => navigate("/adminlogin")}
        >
          Logout
        </button>
      </div>

      <div className="admin-dashboard-wrapper">
        <div className="admin-dashboard-sidebar">
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminusers")}
          >
            Users
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/admincars")}
          >
            Cars
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminverify")}
          >
            Verifications
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/adminorder")}
          >
            Transactions
          </button>
          <button className="admin-dashboard-menu-item active">Reports</button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/admin-payments")}
          >
            Payments
          </button>
          <button
            className="admin-dashboard-menu-item"
            onClick={() => navigate("/activitylogs")}
          >
            Activity Logs
          </button>
        </div>

        <div className="admin-dashboard-content">
          <h2 className="admin-content-title">Reports</h2>

          <div className="admin-reports-content">
            <div className="admin-reports-list">
              {adminReports.map((report) => (
                <div
                  key={report.reportId}
                  className={`admin-report-item ${
                    report.status === 0 ? "admin-unread" : "admin-read"
                  } ${
                    adminSelectedReport &&
                    adminSelectedReport.reportId === report.reportId
                      ? "admin-selected"
                      : ""
                  }`}
                  onClick={() => handleAdminReportClick(report)}
                >
                  <div
                    className={`admin-report-title ${
                      report.status === 0 ? "admin-bold" : ""
                    }`}
                  >
                    {report.title}
                  </div>
                  <div className="admin-report-user">
                    {report.user
                      ? `${report.user.fName} ${report.user.lName}`
                      : "Unknown User"}
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-report-details">
              {adminSelectedReport ? (
                <div className="admin-report-details-card">
                  <h2 className="admin-report-title-black">
                    {adminSelectedReport.title}
                  </h2>
                  <p className="admin-report-description-black">
                    {adminSelectedReport.description}
                  </p>
                  <p className="admin-report-submitted-by-black">
                    Submitted by:{" "}
                    {adminSelectedReport.user
                      ? `${adminSelectedReport.user.fName} ${adminSelectedReport.user.lName}`
                      : "Unknown User"}
                  </p>

                  {!adminChatExists && (
                    <button
                      className="admin-create-group-chat-btn"
                      onClick={handleAdminCreateGroupChat}
                    >
                      Create Group Chat
                    </button>
                  )}

                  {adminSelectedChatId && (
                    <div className="admin-chat-section">
                      <button
                        className="add-member-toggle"
                        onClick={toggleAddMemberField}
                      >
                        {isAddMemberVisible ? "Close Field" : "Add Member"}
                      </button>
                      {isAddMemberVisible && (
                        <div className="add-member-section">
                          <div className="add-member-dropdown">
                            <input
                              type="text"
                              placeholder="Search for users..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <ul>
                              {searchResults
                                .filter((user) =>
                                  user.username
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase())
                                )
                                .map((user) => (
                                  <li key={user.userId}>
                                    {user.username}{" "}
                                    <button
                                      onClick={() => handleAddUser(user.userId, user.username)}
                                    >
                                      Add
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      <h3>Group Chat</h3>
                      <div className="admin-chat-messages">
                        {renderAdminMessages()}
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
