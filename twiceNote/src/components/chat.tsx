/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat: React.FC = () => {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [_error, setError] = useState<string | null>(null);
  const [_success, setSuccess] = useState<string | null>(null);

  const fetchMessages = async () => {
    const userId1 = localStorage.getItem("userId");
    const userId2 = localStorage.getItem("selectedUser");

    if (!userId1 || !userId2) {
      setError("Sender or Receiver not found in local storage.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages",
        {
          userId1,
          userId2,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setMessages(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch messages. Please try again.");
    }
  };

  const handleSendMessage = async () => {
    const senderId = localStorage.getItem("userId");
    const receiverId = localStorage.getItem("selectedUser");

    if (!senderId || !receiverId) {
      setError("Sender or Receiver not found in local storage.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/messages/create",
        {
          content: messageContent,
          sender: senderId,
          receiver: receiverId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Message sent successfully!");
        setMessageContent("");
        fetchMessages();
      }
    } catch (err) {
      setError("Failed to send the message. Please try again.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const userId1 = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>{username}</h1>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          marginBottom: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((message) => {
          const isSender = String(message.sender) === String(userId1); 
          return (
            <div
              key={message._id}
              style={{
                textAlign: isSender ? "right" : "left",
                margin: "10px 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: isSender ? "#d1f0ff" : "#e0e0e0",
                  maxWidth: "60%",
                  wordWrap: "break-word",
                }}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>

      <textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); 
            handleSendMessage(); 
          }
        }}
        placeholder="Type your message here..."
        style={{
          width: "100%",
          height: "100px",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
        }}
      />

      <button
        onClick={handleSendMessage}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#2980b9";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#3498db";
        }}
      >
        Send Message
      </button>
    </div>
  );
};

export default Chat;
