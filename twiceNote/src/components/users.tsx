/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import handleLogout from "./logoutButton";

interface User {
  _id: string;
  username: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const loggedInUserId = localStorage.getItem("userId"); 
        const response = await axios.get(
          "http://localhost:3000/api/users/getall",
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const filteredUsers = response.data.data.filter((user: User) => user._id !== loggedInUserId); 
        setUsers(filteredUsers);
      } catch (err) {
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  const handleSelectChat = (userId: string, username: string) => {
    setSelectedChat(userId);
    localStorage.setItem("selectedUser", userId);
    localStorage.setItem("username", username);
    navigate("/chat");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Select a Chat</h1>
      <Link
        to="/"
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#2980b9";
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 12px rgba(52, 152, 219, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#3498db";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 6px rgba(52, 152, 219, 0.2)";
        }}
        onClick={handleLogout}
      >
        Logout
      </Link>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {users.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user._id}
              style={{
                padding: "10px",
                margin: "5px 0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                backgroundColor: selectedChat === user._id ? "#d1e7fd" : "",
                borderColor: selectedChat === user._id ? "#007bff" : "#ccc",
                fontWeight: selectedChat === user._id ? "bold" : "normal",
              }}
              onClick={() => handleSelectChat(user._id, user.username)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
};

export default Users;
