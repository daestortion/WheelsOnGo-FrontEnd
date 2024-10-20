import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/Messages.css";
import Header from "./Header.js";
import Loading from './Loading';

// Helper function to format the timestamp for messages
const formatMessageTimestamp = (timestamp) => {
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
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null); // WebSocket state
  const [isLoading, setIsLoading] = useState(true);

  // Set up current user and fetch chats when the component is mounted
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      console.log("Current User: ", parsedUser);
    }
    fetchUserChats();
  }, []);

  // Set up WebSocket connection when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      const ws = new WebSocket(`ws://localhost:8080/ws/chat/${selectedChat.chatId}`);
      setSocket(ws);

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      return () => {
        ws.close(); // Close the WebSocket when the component is unmounted or chat is changed
      };
    }
  }, [selectedChat]);

  const fetchUserChats = async () => {
    setIsLoading(true); // Start loading
    try {
      const storedUser = localStorage.getItem('user');
      const userId = JSON.parse(storedUser).userId;
      console.log("Fetching chats for userId: ", userId);
      
      const response = await axios.get(`https://tender-curiosity-production.up.railway.app/chat/user/${userId}/chats`);
      setChats(response.data);
      console.log("Chats fetched: ", response.data);
    } catch (error) {
      console.error("Failed to fetch user chats", error);
    } finally {
      setIsLoading(false); // Stop loading once chats are fetched
    }
  };
  

  const handleChatClick = async (chat) => {
    setIsLoading(true); // Start loading when switching chats
    try {
      console.log("Chat clicked: ", chat);
      setSelectedChat(chat);
      setMessages([]); // Reset messages when switching chats
      await fetchMessages(chat.chatId);
    } catch (error) {
      console.error('Error selecting chat:', error);
    } finally {
      setIsLoading(false); // Stop loading when messages are fetched
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      console.log(`Fetching messages for chatId: ${chatId}`);
      const response = await axios.get(`https://tender-curiosity-production.up.railway.app/chat/${chatId}/messages?limit=50`);
      const initialMessages = response.data;
      setMessages(initialMessages);
      console.log("Initial messages fetched: ", initialMessages);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const sendMessage = () => {
    if (socket && newMessage && currentUser) {
      const messagePayload = {
        userId: currentUser.userId,
        messageContent: newMessage,
        chatId: selectedChat.chatId,
      };
      socket.send(JSON.stringify(messagePayload)); // Send the message through WebSocket
      setNewMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="messages-container">
      <Header />
      <div className="title">
        <h1>Messages</h1>
      </div>

      {/* Display the Loading component if loading */}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="chats-list">
            {chats.map(chat => (
              <div key={chat.chatId} className="chat-item" onClick={() => handleChatClick(chat)}>
                <h3>{chat.report ? chat.report.title : "Group Chat"}</h3>
                <p>{chat.status}</p>
              </div>
            ))}
          </div>

          {selectedChat && (
            <div className="chat-section">
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message ${message.sender && message.sender.userId === currentUser.userId ? 'user-message' : 'admin-message'}`}
                  >
                    <div className="chat-bubble">
                      {/* Display the message sender's name */}
                      <div className="sender-name">
                        {message.sender ? message.sender.username : message.adminSender ? "Admin" : "Unknown"}
                      </div>
                      {message.messageContent}
                      {/* Timestamp will be shown on hover */}
                      <div className="timestamp">
                        {formatMessageTimestamp(message.sentAt)}
                      </div>
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
        </>
      )}
    </div>
  );
};

export default Messages;
