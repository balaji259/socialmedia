import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import SuggestionsSidebar from './Suggestions';
import PostsComponent from './Posts';
import { fetchUserDetails } from './userPosts.js';


const getISTDate = () => {
  const options = { timeZone: 'Asia/Kolkata' };
  return new Date(new Date().toLocaleString('en-US', options));
};




const Home = () => {
  const [user, setUser] = useState({ username: "", profilePic: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const getUserDetails = async () => {
      const userDetails = await fetchUserDetails(token);
      console.log("userDetails");
      console.log(userDetails);
      if (userDetails) {
        setUser({ username: userDetails.username, profilePic: userDetails.profilePic });
      }
      console.log(user);
      //added fior checkong streaks
      // await checkAndResetStreakOnLogin(userDetails.userId);
    };

    getUserDetails();
  }, []);


  const getSidebarWidth = () => {
    if (window.innerWidth < 600) return "20%"; // Small screens
    if (window.innerWidth < 900) return "25%"; // Medium screens
    return "20%"; // Larger screens
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
        <div style={styles.posts}>
          <PostsComponent />
        </div>
  
        {/* Suggestions Sidebar */}
        <div style={{ ...styles.suggestionsSidebar, width: getSidebarWidth() }}>
          <SuggestionsSidebar />
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh", // Full viewport height
    fontFamily: "'Arial', sans-serif",
    overflow: "hidden", // Prevent overflow
    backgroundColor: "#d5d5d5",
  },
  navbar: {
    flexShrink: 0,
    zIndex: 1000, // Ensure Navbar stays on top
    position: "sticky",
    top: 0,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  content: {
    display: "flex",
    flex: 1,
    marginTop: "60px", // Adjust this to match the navbar height
    overflow: "hidden", // Remove scrolling
    backgroundColor: "#d5d5d5",
  },
  dashboard: {
    backgroundColor: "#f9f9f9",
    // boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    height: "calc(100vh - 60px)", // Fit within the viewport height
    // padding: "10px",
    display: "flex",
    flexDirection: "column",
  },
  posts: {
    flex: 1, // Take up the remaining space
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    overflowY: "auto",
    backgroundColor: "#d5d5d5",
    // width:'150%',
    // height: "calc(100vh - 60px)", 
    // padding: "10px",
    // margin: "0 10px",
  },
  suggestionsSidebar: {
    // backgroundColor: "#f9f9f9",
    backgroundColor:"#d5d5d5",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    height: "calc(100vh - 60px)", 
    // padding: "15px 5px",
    display: "flex",
    flexDirection: "column",
  },
};
export default Home;
