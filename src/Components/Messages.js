import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Dropdown from "../Components/Dropdown.js";
import "../Css/Messages.css";
import profile from "../Images/profile.png";
import sidelogo from "../Images/sidelogo.png";
import Header from "./Header.js";

// Helper function to format the timestamp for admin messages
const formatMessageTimestamp = (timestamp) => {
  // Convert the timestamp to a valid Date object
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
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
      const response = await axios.get('https://tender-curiosity-production.up.railway.app/report/getAll');
      const userReports = response.data.filter(report => report.user.userId === userId);
      setReports(userReports);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  
  const handleReportClick = async (report) => {
    try {
      const chatResponse = await axios.get(`https://tender-curiosity-production.up.railway.app/chat/check?reportId=${report.reportId}`);
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
      const response = await axios.get(`https://tender-curiosity-production.up.railway.app/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const sendMessage = async () => {
    if (selectedChat && newMessage && currentUser) {
      try {
        await axios.post(`https://tender-curiosity-production.up.railway.app/chat/${selectedChat.chatId}/send`, null, {
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
      <Header/>

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
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.sender ? 'user-message' : 'admin-message'}`}
              >
                <div className="chat-bubble">
                  {/* Display only the message content */}
                  {message.messageContent}
                  {/* Timestamp will be shown on hover */}
                  <div className="timestamp">
                    {formatMessageTimestamp(message.timestamp)}
                  </div>
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
