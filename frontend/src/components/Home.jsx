import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import SuggestionsSidebar from './Suggestions';
import PostsComponent from './Posts';
import { fetchUserDetails } from './userPosts.js';

const Home = () => {
  const [user, setUser] = useState({ username: "", profilePic: "" });
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getUserDetails = async () => {
      const userDetails = await fetchUserDetails(token);
      if (userDetails) {
        setUser({ username: userDetails.username, profilePic: userDetails.profilePic });
      }
    };

    getUserDetails();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const getSidebarWidth = () => {
    if (window.innerWidth < 600) return "20%";
    if (window.innerWidth < 900) return "25%";
    return "20%";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <Navbar username={user.username} profilePic={user.profilePic} />
      </div>

      {/* Main content */}
      <section style={styles.content}>
        {/* Dashboard Sidebar */}
        <div style={{ ...styles.dashboard, width: getSidebarWidth() }}>
          <Dashboard />
        </div>

        {/* Posts Section */}
        <div
          style={{
            ...styles.posts,
            marginRight: isSidebarVisible ? "0" : "5%", // Adjust space when sidebar is hidden
          }}
        >
          <PostsComponent />
        </div>

        {/* Suggestions Sidebar */}
        <div
          style={{
            ...styles.suggestionsSidebar,
            width: isSidebarVisible ? getSidebarWidth() : "0", // Smoothly hide sidebar
            transition: "width 0.3s ease-in-out",
            overflow: isSidebarVisible ? "auto" : "hidden", // Prevent overflow when hidden
          }}
        >
          {isSidebarVisible && (
            <>
              <button style={styles.closeButton} onClick={toggleSidebar}>
                ✕
              </button>
              <SuggestionsSidebar />
            </>
          )}
        </div>

        {/* Toggle Button to Open Sidebar */}
        {!isSidebarVisible && (
          <button style={styles.openButton} onClick={toggleSidebar}>
            ☰ 
          </button>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden",
    backgroundColor: "#d5d5d5",
  },
  navbar: {
    flexShrink: 0,
    zIndex: 1000,
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  content: {
    display: "flex",
    flex: 1,
    marginTop: "60px",
    overflow: "hidden",
    backgroundColor: "#d5d5d5",
  },
  dashboard: {
    backgroundColor: "#f9f9f9",
    overflowY: "auto",
    height: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
  },
  posts: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    backgroundColor: "#d5d5d5",
  },
  suggestionsSidebar: {
    
    backgroundColor: "#d5d5d5",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
    height: "calc(100vh - 60px)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease-in-out", // Smooth transition for opening/closing
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "-5px", // Place it outside the sidebar
    padding: "10px 30px 10px 15px",
    marginTop:"10px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 10,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transform: "translateX(10px)", // Pull slightly into the screen
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  openButton: {
    position: "fixed",
    top: "80px", // Below Navbar
    right: "-5px", // Flush with the screen edge
    padding: "10px 30px 10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 1000,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transform: "translateX(10px)", // Slightly into the screen
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
};

// Add hover effects for buttons (in a CSS file or a <style> block in your React file):
/*
.openButton:hover,
.closeButton:hover {
  transform: translateX(0); // Pop out fully into view
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3); // Enhanced shadow
}
*/
export default Home;