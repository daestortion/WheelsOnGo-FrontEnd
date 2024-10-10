import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "../Components/Dropdown.js";
import "../Css/Messages.css";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";

// Helper function to format the timestamp (not needed anymore)
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const Messages = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const userId = JSON.parse(storedUser).userId;
      const response = await axios.get('http://localhost:8080/report/getAll');
      const userReports = response.data.filter(report => report.user.userId === userId);
      setReports(userReports);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  const handleReportClick = async (report) => {
    try {
      const chatResponse = await axios.get(`http://localhost:8080/chat/check?reportId=${report.reportId}`);
      if (chatResponse.data && chatResponse.data.chatId) {
        setSelectedChat(chatResponse.data);
        fetchMessages(chatResponse.data.chatId);
      } else {
        console.log('No group chat exists for this report.');
      }
    } catch (error) {
      console.error('Error checking or fetching chat:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:8080/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const sendMessage = async () => {
    if (selectedChat && newMessage && currentUser) {
      try {
        await axios.post(`http://localhost:8080/chat/${selectedChat.chatId}/send`, null, {
          params: {
            userId: currentUser.userId,
            messageContent: newMessage
          }
        });
        setNewMessage('');
        fetchMessages(selectedChat.chatId);
      } catch (error) {
        console.error('Failed to send message', error);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (selectedChat) {
        fetchMessages(selectedChat.chatId);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [selectedChat]);

  return (
    <div className="messages-container">
      <div className="header">
        <img className="sidelogo" alt="Side Logo" src={sidelogo} />
        <div className="nav-links">
          <div className="messages-link">Messages</div>
          <div className="home-link" onClick={() => navigate('/home')}>Home</div>
          <div className="cars-link" onClick={() => navigate('/cars')}>Cars</div>
          <div className="about-link" onClick={() => navigate('/aboutus')}>About</div>
        </div>
        <Dropdown>
          <button className="profile-button">
            <img alt="Profile" src={profile} />
          </button>
        </Dropdown>
      </div>

      <div className="title">
        <h1>Messages</h1>
      </div>

      <div className="reports-list">
        {reports.map(report => (
          <div key={report.reportId} className="report-item" onClick={() => handleReportClick(report)}>
            <h3>{report.title}</h3>
            <p>{report.description}</p>
          </div>
        ))}
      </div>

      {selectedChat && (
        <div className="chat-section">
          <h3>Group Chat: {selectedChat.report.title}</h3>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender ? 'user-message' : 'admin-message'}`}
              >
                <div className="chat-bubble">
                  {/* Display only the message content */}
                  {message.messageContent}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input fixed at the bottom */}
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
  );
};

export default Messages;
