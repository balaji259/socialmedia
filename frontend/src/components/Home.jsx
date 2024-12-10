import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import SuggestionsSidebar from "./Suggestions";
import PostsComponent from "./Posts";
import { fetchUserDetails } from "./userPosts.js";

const Home = () => {
  const [user, setUser] = useState({ username: "", profilePic: "" });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Default to `false` for smaller screens

  // Determine sidebar visibility based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setIsSidebarVisible(true); // Open by default for larger screens
      } else {
        setIsSidebarVisible(false); // Closed by default for medium and smaller screens
      }
    };

    // Initialize the sidebar state on load
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (window.innerWidth < 900) return "15%";
    return "17%";
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
            zIndex: isSidebarVisible && window.innerWidth < 900 ? 1000 : "auto", // For smaller screens, overlay suggestions
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
    columnGap:"10px",
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
    // border:"2px solid red",
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
    position: "fixed", // Fixed position for visibility
    top: "80px", // Place it below the navbar
    right: "-10px", // Aligned to the right
    padding: "10px 30px 10px 15px",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 1100,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  openButton: {
    position: "fixed",
    top: "80px", // Below Navbar
    right: "-10px",
    padding: "10px 30px 10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    zIndex: 1000,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
};

export default Home;
