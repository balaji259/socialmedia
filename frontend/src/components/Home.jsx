import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import SuggestionsSidebar from './Suggestions';
import PostsComponent from './Posts';
import { fetchUserDetails } from './userPosts.js';

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
    };

    getUserDetails();
  }, []);

  return (
    <div style={styles.container}>
      <Navbar username={user.username} profilePic={user.profilePic} />
      <section style={styles.content}>
        <div style={styles.dashboard}>
          <Dashboard />
        </div>
        <div style={styles.posts}>
          <PostsComponent />
        </div>
        <div style={styles.suggestionsSidebar}>
          <SuggestionsSidebar />
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    display: 'flex',
    flex: 1,
    padding: '20px',
    marginTop: '60px', // Adjust this to match the navbar height
    overflow: 'hidden', // Remove scrolling
  },
  dashboard: {
    width: '20%',
    padding: '10px',
    borderRight: '1px solid #ddd',
  },
  posts: {
    width: '80%',
    padding: '10px',
    margin: '0 20px',
  },
  suggestionsSidebar: {
    width: '30%',
    padding: '15px',
    borderLeft: '1px solid #ddd',
  },
};

export default Home;
