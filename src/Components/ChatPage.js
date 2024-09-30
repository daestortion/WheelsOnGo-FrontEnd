import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { chatId } = useParams(); // Get chatId from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useRef();

  useEffect(() => {
    // Fetch initial chat messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chats/${chatId}/messages`); // Ensure correct URL with backticks
        console.log("Fetched messages:", response.data); // Log the fetched messages
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Set up socket connection
    socket.current = io('http://localhost:3000'); // Adjust to your server's WebSocket URL

    // Listen for incoming messages via socket
    socket.current.on('message', (message) => {
      console.log("New message received:", message); // Log incoming messages
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up socket connection when component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, [chatId]);

  // Function to send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Don't send empty messages

    try {
      const response = await axios.post(`/api/chats/${chatId}/messages`, {
        userId: 1, // Hardcoded userId, replace with dynamic user from context
        messageContent: newMessage,
      });
      console.log('Message sent:', response.data); // Log the sent message
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <h2>Chat Support</h2>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user.username}:</strong> {msg.content}
            </div>
          ))
        )}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
