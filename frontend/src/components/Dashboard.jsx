
import React from "react";
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"

import {useSocket} from "./useSocket";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const {user, setUser ,socket, connectSocket,disconnectSocket} =useSocket();


  const handleLogout = () => {
    
    

    if (socket) {
           console.log("socket value before unmount in dashbaor5r",socket.id);
             disconnectSocket();
             console.log("socket value after  unmount dashboard",socket.id);
             console.log("Socket disconnected on unmount.");
    }
    else{
      console.log("socket is:",socket);
    }
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
          <button className="menu-item" onClick={() => navigate("/friends")}> <span className="stacked-text">
       Friend<br />Circle
          </span></button>
          <button className="menu-item" onClick={()=> navigate("/chats")}>Chats</button>
          
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
