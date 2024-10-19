import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../Css/Messages.css";
import Header from "./Header.js";
import Loading from './Loading'; // Assuming you have a Loading component like in the login

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
  const [lastMessageId, setLastMessageId] = useState(null); // Track the last message ID
  const [messageIds, setMessageIds] = useState(new Set()); // Track unique message IDs
  const [isLoading, setIsLoading] = useState(true); // Add loading state

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

  // Poll for new messages every 5 seconds if a chat is selected
  useEffect(() => {
    if (selectedChat) {
      console.log(`Started polling for chatId: ${selectedChat.chatId}`);
      const intervalId = setInterval(() => {
        fetchNewMessages(selectedChat.chatId);
      }, 5000); // Set interval to 5 seconds
      return () => {
        clearInterval(intervalId);
        console.log(`Stopped polling for chatId: ${selectedChat.chatId}`);
      };
    }
  }, [selectedChat, lastMessageId]);

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
      setMessageIds(new Set()); // Reset message tracking when switching chats
      await fetchMessages(chat.chatId);
    } catch (error) {
      console.error('Error selecting chat:', error);
    } finally {
      setIsLoading(false); // Stop loading when messages are fetched
    }
  };

  // Fetches only new messages since the last message ID
  const fetchNewMessages = async (chatId) => {
    try {
      console.log(`Fetching new messages for chatId: ${chatId}, after messageId: ${lastMessageId}`);
      const response = await axios.get(`https://tender-curiosity-production.up.railway.app/chat/${chatId}/messages?lastMessageId=${lastMessageId}`);
      const newMessages = response.data;
      const uniqueMessages = newMessages.filter(msg => !messageIds.has(msg.messageId)); // Avoid duplicates

      if (uniqueMessages.length > 0) {
        console.log("New messages fetched: ", uniqueMessages);
        setMessages((prevMessages) => [...prevMessages, ...uniqueMessages]);
        setMessageIds((prevIds) => new Set([...prevIds, ...uniqueMessages.map(msg => msg.messageId)])); // Update unique IDs
        setLastMessageId(uniqueMessages[uniqueMessages.length - 1].messageId); // Update last message ID
      } else {
        console.log("No new messages.");
      }
    } catch (error) {
      console.error('Failed to fetch new messages', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      console.log(`Fetching messages for chatId: ${chatId}`);
      const response = await axios.get(`https://tender-curiosity-production.up.railway.app/chat/${chatId}/messages?limit=50`); // Limit the number of messages
      const initialMessages = response.data;
      setMessages(initialMessages);
      setMessageIds(new Set(initialMessages.map(msg => msg.messageId))); // Track unique message IDs
      setLastMessageId(initialMessages[initialMessages.length - 1]?.messageId); // Track the last message ID
      console.log("Initial messages fetched: ", initialMessages);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  };

  const sendMessage = async () => {
    if (selectedChat && newMessage && currentUser) {
      try {
        console.log("Sending message: ", newMessage);
        await axios.post(`https://tender-curiosity-production.up.railway.app/chat/${selectedChat.chatId}/send`, null, {
          params: {
            userId: currentUser.userId,
            messageContent: newMessage
          }
        });
        setNewMessage('');
        fetchNewMessages(selectedChat.chatId); // Fetch new messages after sending
      } catch (error) {
        console.error('Failed to send message', error);
      }
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
