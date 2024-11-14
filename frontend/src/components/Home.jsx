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

// // Function to check and reset streak if needed
// const checkAndResetStreakOnLogin = async (userId) => {
//   try {
//     // Fetch user details using the userId
//     const user = await fetchUserDetails(userId);  // Assuming fetchUserDetails can fetch user by ID
//     if (!user) {
//       throw new Error('User not found');
//     }

//     const currentDate = getISTDate();
//     const lastPostDate = user.streak.lastPostTime;

//     // If the last post time is older than yesterday, reset the streak
//     if (lastPostDate) {
//       const lastPostDateIST = new Date(lastPostDate);
//       const diffInDays = Math.floor((currentDate - lastPostDateIST) / (24 * 60 * 60 * 1000)); // Difference in days

//       if (diffInDays > 1) {
//         // Reset streak if the user hasn't posted in 2 or more days
//         await fetchUserDetails(userId, { 'streak.count': 0 });  // Assuming this will update the streak
//       }
//     }
//   } catch (error) {
//     console.error('Error resetting streak on login:', error);
//   }
// };



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






  return (
    <div style={styles.container}>
      <Navbar  username={user.username} profilePic={user.profilePic} />
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
    // backgroundColor:'#blue'
  },
  content: {
    display: 'flex',
    flex: 1,
    backgroundColor:'#d5d5d5',
    // padding: '20px',
    marginTop: '60px', // Adjust this to match the navbar height
    overflow: 'hidden', // Remove scrolling
  },
  dashboard: {
    width: '13%',
    padding: '10px',
    // borderRight: '1px solid #ddd',
  },
  posts: {
    width: '85%',
    padding: '10px',
    // border:'2px solid black',
    margin: '0 10px',
    // marginLeft:'20px'
  },
  suggestionsSidebar: {
    width: '20%',
    padding: '15px 5px',
    marginRight:'0px',
    // backgroundColor:'blue'
    // border: '1px solid red',
  },
};

export default Home;
