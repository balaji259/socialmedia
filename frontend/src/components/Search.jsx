import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import SearchSuggestions from './SearchSuggestions';

import { fetchUserDetails } from './userPosts.js';

const Search = () => {
  const [user, setUser] = useState({ username: "", profilePic: "" });

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

  return (
    <div style={styles.container}>
      <Navbar username={user.username} profilePic={user.profilePic} />
      <section style={styles.content}>
        <div style={styles.dashboard}>
          <Dashboard />
        </div>
        <div style={styles.details}>
          <SearchSuggestions />
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
    backgroundColor: '#f4f4f4', // Lighter background
  },
  content: {
    display: 'flex',
    flex: 1,
    padding: '20px',
    marginTop: '60px',
    overflow: 'hidden',
    flexDirection: 'row', // Default flex direction for larger screens
  },
  dashboard: {
    flex: '1 1 20%', // Give more space for smaller screens
    maxWidth: '250px',
    minWidth: '150px', // Adjust width for very small screens
    padding: '10px',
  },
  details: {
    flex: '4 1 80%', // Details section should take up more space
    padding: '20px',
    margin: '0 auto',
    overflowY: 'auto',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  '@media (max-width: 1024px)': {
    content: {
      flexDirection: 'column', // Stack vertically for tablets
    },
    dashboard: {
      flex: '1 1 30%', // Adjust dashboard width on medium screens
      maxWidth: '300px',
    },
    details: {
      flex: '4 1 70%',
      padding: '15px',
    },
  },
  '@media (max-width: 768px)': {
    content: {
      flexDirection: 'column',
    },
    dashboard: {
      flex: '1 1 40%', // Reduce the dashboard width further for smaller screens
    },
    details: {
      flex: '4 1 60%',
      padding: '10px',
    },
  },
  '@media (max-width: 480px)': {
    content: {
      flexDirection: 'column', // Stack vertically for small screens
      padding: '10px',
    },
    dashboard: {
      flex: '1 1 auto',
      width: '100%',
      order: -1, // Move dashboard to top on mobile
    },
    details: {
      flex: '1 1 auto',
      width: '100%',
      padding: '20px',
    },
  },
};

styles.details['::-webkit-scrollbar'] = {
  display: 'none',
};

export default Search;
