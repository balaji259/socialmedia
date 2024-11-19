import React from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Top Section */}
        <div className="menu">
          <button className="menu-item" onClick={() => navigate("/home")}>
            Home
          </button>
          <button className="menu-item" onClick={() => navigate("/search")}>
            Search
          </button>
          <button className="menu-item">Friends</button>
          <button className="menu-item">Chats</button>
          <button className="menu-item">Notifications</button>
          <button className="menu-item" onClick={() => navigate("/profile")}>
            Profile
          </button>
        </div>

        {/* Bottom Section */}
        <div className="logout">
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
