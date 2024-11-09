import React, { useEffect, useState } from 'react';


const SuggestionsSidebar = () => {

  // const [userData,setUserData]=useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [streakCount,setStreakCount]=useState(0);
  


const fetchUserData = async () => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          alert('You are not logged in. Please log in to view your profile.');
          // window.location.href = 'index.html';
          return;
      }

      const response = await fetch(`http://localhost:7000/profile/me`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("data");
      console.log(data.streak.count);
      // streakCount=data.streak.count;
      setStreakCount(data.streak.count);
      // setUserData(data);
      // console.log();
      // console.log(userData.streak.count);
     
      
  } catch (error) {
      console.error('Failed to fetch user data:', error);
      // setError('Error fetching user data. Please try again later.');
  }
};


async function fetchUserSuggestions(setSuggestions) {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:7000/user/suggestions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Unauthorized access');
        }

        const data = await response.json();
        console.log("Suggestion data:", data);

        if (data.users && Array.isArray(data.users)) {
            setSuggestions(data.users);
        } else {
            console.error("Unexpected data format:", data);
        }
    } catch (error) {
        console.error('Failed to fetch user suggestions:', error);
    }
}


  useEffect(() => {
    fetchUserSuggestions(setSuggestions);
  }, []);

  useEffect(()=>{
    fetchUserData();
    console.log("useeffetcs");
    // console.log(userData);
  },[]);

  return (
    <div
      id="sec-right"
      style={{
        position: 'fixed',
        right: 0,
        top: '60px',
        height: 'calc(100vh - 60px)',
        maxWidth: '350px',
        backgroundColor: '#f1f3f5',
        padding: '15px',
        marginTop: '20px',
        paddingTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #e1e1e1',
        overflowY: 'auto',
      }}
    >
      <div
        id="streak-div"
        style={{
          backgroundColor: '#cce5ff',
          color: '#004085',
          padding: '6px',
          borderRadius: '5px',
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '10px',
          fontSize: '0.85em',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Streak- { streakCount} */}
        <img src={streakCount===0?`images/fireoff.svg`:`images/fireon.svg`} style={{height:'20px',width:'20px'}} />  &nbsp;  {streakCount}
      </div>

      <div
        id="heading-suggestions"
        style={{
          marginTop: '14px',
          marginBottom: '4px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        User Suggestions
      </div>

      <div id="suggestions-container" style={suggestionsContainerStyle}>
        {suggestions.map((user) => (
          <div key={user.username} style={suggestionStyle}>
            <div style={suggestionTopStyle}>
              <img
                // src={user.profilePic || 'https://via.placeholder.com/35'}
                src={user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `http://localhost:7000${user.profilePic}`}

                alt={user.username}
                style={profilePicStyle}
              />
              <p style={usernameStyle}>@{user.username}</p>
              <p style={bioStyle}>{user.bio || 'No Bio'}</p>
            </div>
            <button style={buttonStyle}>Follow</button>
          </div>
        ))}
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{scrollbarHideStyles}</style>
    </div>
  );
};

// Inline Styles
const suggestionsContainerStyle = {
  overflowY: 'auto',
  color: '#333',
  fontSize: '1.1em',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px', // Adjust gap between cards
  flex: 1,
  alignItems: 'center',
  scrollbarWidth: 'none', // Hide scrollbar for Firefox
};

// CSS for hiding scrollbar in WebKit browsers (Chrome/Safari)
const scrollbarHideStyles = `
  #suggestions-container::-webkit-scrollbar {
    display: none;
  }
`;

const suggestionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '12px', // Increase padding for better spacing
  width: '90%', // Reduce width for more compact look
  maxWidth: '300px', // Limit max width for uniformity
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '8px',
};

const suggestionTopStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '8px',
};

const profilePicStyle = {
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  marginBottom: '6px',
};

const usernameStyle = {
  fontSize: '1em',
  color: '#333',
  fontWeight: '500',
  margin: 0,
};

const bioStyle = {
  fontSize: '0.85em',
  color: '#666',
  marginBottom: '10px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  padding: '8px 0',
  cursor: 'pointer',
  fontSize: '0.85em',
  width: '100%',
  transition: 'background-color 0.3s',
};

export default SuggestionsSidebar;

