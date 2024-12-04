import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Messages.css";
import Header from "./Header.js";
import Loading from "./Loading"; // Assuming you have a Loading component like in the login

const formatMessageTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const Messages = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [messageIds, setMessageIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      console.log("Current User: ", parsedUser);
    }
    fetchUserChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const intervalId = setInterval(() => {
        fetchNewMessages(selectedChat.chatId);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [selectedChat, lastMessageId]);

  const fetchUserChats = async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      const userId = JSON.parse(storedUser)?.userId;
      console.log("Fetching chats for userId: ", userId);
      const response = await axios.get(
        `https://wheelsongo-backend.onrender.com/chat/user/${userId}/chats`
      );
      setChats(response.data);
      console.log("Chats fetched: ", response.data);
    } catch (error) {
      console.error("Failed to fetch user chats", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = async (chat) => {
    setIsLoading(true);
    try {
      setSelectedChat(chat);
      setMessages([]);
      setMessageIds(new Set());
      await fetchMessages(chat.chatId);
    } catch (error) {
      console.error("Error selecting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNewMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `https://wheelsongo-backend.onrender.com/chat/${chatId}/messages?lastMessageId=${lastMessageId}`
      );
      const newMessages = response.data.filter(
        (msg) => !messageIds.has(msg.messageId)
      );
      if (newMessages.length > 0) {
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        setMessageIds(
          (prevIds) =>
            new Set([...prevIds, ...newMessages.map((msg) => msg.messageId)])
        );
        setLastMessageId(
          newMessages[newMessages.length - 1].messageId
        );
      }
    } catch (error) {
      console.error("Failed to fetch new messages", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `https://wheelsongo-backend.onrender.com/chat/${chatId}/messages?limit=50`
      );
      const initialMessages = response.data;
      setMessages(initialMessages);
      setMessageIds(new Set(initialMessages.map((msg) => msg.messageId)));
      setLastMessageId(initialMessages[initialMessages.length - 1]?.messageId);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const sendMessage = async () => {
    if (selectedChat && newMessage && currentUser) {
      try {
        await axios.post(
          `https://wheelsongo-backend.onrender.com/chat/${selectedChat.chatId}/send`,
          null,
          {
            params: {
              userId: currentUser.userId,
              messageContent: newMessage,
            },
          }
        );
        setNewMessage("");
        fetchNewMessages(selectedChat.chatId);
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  return (
    <div className="messages">
      <Header />

      <div className="title">
          <h1>Messages</h1>
        </div>

      <div className="messages-container">
        


        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="chats-list">
              {chats.map((chat) => (
                <div
                  key={chat.chatId}
                  className="chat-item"
                  onClick={() => handleChatClick(chat)}
                >
                  <h3>{chat.report?.title || "Group Chat"}</h3>
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
                      className={`chat-message ${
                        message.userId === currentUser?.userId
                          ? "user-message"
                          : "admin-message"
                      }`}
                    >
                      <div
                        className={`chat-bubble ${
                          message.userId === currentUser?.userId
                            ? "bubble-right"
                            : "bubble-left"
                        }`}
                      >
                        <div className="sender-name">
                          {message.userId === currentUser?.userId
                            ? "You"
                            : message.senderLabel || "Admin"}
                        </div>
                        {message.messageContent}
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
    </div>
  );
};

export default Messages;
