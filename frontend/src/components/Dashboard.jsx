
import React,{useState} from "react";
import { toast } from 'react-hot-toast';
import {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
// import { faArrowLeftFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
{/* <FontAwesomeIcon icon={faArrowRightFromBracket} /> */}




import {useSocket} from "./useSocket";

const Dashboard = () => {
  const navigate = useNavigate();
  const websitelink="https://friendsbook-cy0f.onrender.com";
  const renderurl="https://socialmedia-backend-2njs.onrender.com";
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

 

  function inviteFriends(){
    navigator.clipboard.writeText(`https://www.friendsbook.online`)
    .then(() => toast.success("website link copied! Share it to your friends."))
    .catch(err => console.error('Failed to copy:', err));
  }

 

  return (
    <div className="dashboard">
      {/* Sidebar */}
      
      <div className="sidebar">
        {/* Top Section */}
        <div className="menu">
          <button className="menu-item tooltip" onClick={() => navigate("/home")}>
         <FontAwesomeIcon icon={faHouse} id="home" />
         <span className="tooltip-text">Home</span>
          {/* Home */}
          </button>
          <button className="menu-item tooltip" onClick={() => navigate("/search")}>
          <FontAwesomeIcon icon={faMagnifyingGlass} id="search"/> 
          <span className="tooltip-text">Search</span>
          {/* Search */}
          </button>
          <button className="menu-item tooltip" onClick={() => navigate("/friends")}> <span className="stacked-text">
          <FontAwesomeIcon icon={faUserGroup} id="friendcircle" />
          <span className="tooltip-text">Friend Circle</span>
          {/* Friend<br />Circle */}
          </span></button>
          <button className="menu-item tooltip" onClick={()=> navigate("/chats")}>
          <FontAwesomeIcon icon={faMessage} id="chats"/>
          <span className="tooltip-text">Chats</span>
           {/* Chats */}
            </button>
          
          <button className="menu-item tooltip" onClick={() => navigate("/profile")}>
           <FontAwesomeIcon icon={faUser}  id="profile"  />
           <span className="tooltip-text">Profile</span>
           {/* Profile */}
          </button>

          <button className="menu-item tooltip" onClick={inviteFriends}>
           <FontAwesomeIcon icon={faUserPlus} id="invite-friends" />
           <span className="tooltip-text">Invite</span>
           {/* Invite Friends */}
          </button>

          <button className="menu-item tooltip" onClick={() => window.location.reload()}>
           <FontAwesomeIcon icon={faRotate} id="refresh" />
           <span className="tooltip-text">Refresh</span>
           {/* Refresh */}
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
