import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import Details from './Details';

import { fetchUserDetails } from './userPosts.js';

const Profile =()=>{

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





    return (
        <div style={styles.container}>
          <Navbar username={user.username} profilePic={user.profilePic} />
          <section style={styles.content}>
            <div style={styles.dashboard}>
              <Dashboard />
            </div>
            <div style={styles.details}>
              <Details />
            </div>
           
          </section>
        </div>
      );


}

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
    //   borderRight: '1px solid #ddd',
    },
    details: {
        width: '80%', // Occupy more space
        padding: '20px',
        // border:'none',
        margin: '0 auto', // Center the details section
        overflowY: 'auto', // Enable vertical scrolling
        scrollbarWidth: 'none', // Hide scrollbar in Firefox
        msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
    },
    
  };

  styles.details['::-webkit-scrollbar'] = {
    display: 'none',
  };
  
  export default Profile;