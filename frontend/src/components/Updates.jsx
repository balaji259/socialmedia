import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useSocket } from "./useSocket";
import { useChatStore } from "./useChatStore";

export default function Updates() {
  const [activeTab, setActiveTab] = useState('friends');
  const [followRequests, setFollowRequests] = useState([]);
  const [query, setQuery] = useState('');
  const emptyquery='';
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [allSuggestedUsers, setAllSuggestedUsers] = useState([]);
  const [friends,setFriends]=useState([]);
//   const userId = "67c343222142a971928c836c";
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { setChatUserId, profileId, setProfileId } = useChatStore();

  const {onlineUsers} =useSocket();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log(`userId is ${payload.userId}`);
      return payload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       console.log("active tab chnaged to requests");
  //       const response = await axios.get(`/notifications/getall/${userId}`);
  //       const notifications = response.data;

  //       const filteredRequests = notifications.filter(notif => 
  //         notif.type === 'Follow Notification' &&
  //         notif.senderId && 
  //         notif.senderId.followers && 
  //         !notif.senderId.followers.some(follower => follower._id === userId)
  //       );

  //       setFollowRequests(filteredRequests);
  //     } catch (error) {
  //       console.error('Error fetching notifications:', error);
  //     }
  //   };

  //   fetchNotifications();
  // }, [userId,activeTab]);

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...");
      const response = await axios.get(`/notifications/getall/${userId}`);
  
      console.log("API Response:", response.data); // Debugging log
  
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Error: Expected an array but got:", response.data);
        setFollowRequests([]); // Ensure followRequests is always an array
        return;
      }
  
      const filteredRequests = response.data.filter(notif => 
        notif.type === 'Follow Notification' &&
        notif.senderId && 
        notif.senderId.followers && 
        !notif.senderId.followers.some(follower => follower._id === userId)
      );
  
      setFollowRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setFollowRequests([]); // Set an empty array in case of an error
    }
  };
  



  const handleFollowUnfollow = async (targetId, action, notificationId = null) => {
    try {
      await axios.post(`/user/search/${action}`,
        { userId: userId, targetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (action === "follow") {
        await axios.post("/send-notification", {
          userId: targetId,
          senderId: userId,
          type: "Follow Notification",
          title: "New Follower",
          body: `${userId} started following you!!`,
        }, { headers: { Authorization: `Bearer ${token}` } });
      }

      if (notificationId) {
        handleDelete(notificationId);
      } else {
        setSuggestedUsers(prev =>
          prev.map(user =>
            user._id === targetId ? { ...user, followStatus: action === 'follow' ? 'unfollow' : 'follow' } : user
          )
        );
        setAllSuggestedUsers(prev =>
          prev.map(user =>
            user._id === targetId ? { ...user, followStatus: action === 'follow' ? 'unfollow' : 'follow' } : user
          )
        );
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(`/notifications/delete/${notificationId}`);
      setFollowRequests(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification', error);
    }
  };

  const handleChat = (friendId) => {
    setChatUserId(friendId);
    navigate("/chats");
  };

  const fetchUsers = useCallback(async () => {
    if (!query) return;

    try {
      const response = await axios.get(`/user/search/suggestions`, {
        params: { query },
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response);
      if (!response.data || !Array.isArray(response.data.users)) {
        console.error("Error: Expected an array but got:", response.data);
        setSuggestedUsers([]); // Ensure followRequests is always an array
        return;
      }
      setSuggestedUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [query]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(()=>{
    fetchAllUserSuggestions();
  },[]);

  const fetchFriends = async () => {
    try {
      console.log("Fetching friends for userId:", userId);
      const response = await axios.get(`/user/${userId}/friends`);
      
      if (!response.data || !Array.isArray(response.data.friends)) {
        console.error("Error: Expected an array but got:", response.data);
        setFriends([]); // Ensure followRequests is always an array
        return;
      }
  

      setFriends(response.data.friends);
    
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(()=>{
    fetchFriends();
  },[userId]);
 


  const goToUserProfile = (id) => {
    console.log(id);
    setProfileId(id);
    
  };

  useEffect(()=>{
    console.log("navigating to user profile");
    console.log("now the profileId is:",profileId);
    if(profileId!=null)
      navigate(profileId === userId ? `/profile` : `/other`);

  },[profileId]);


  // const fetchAllUserSuggestions = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`/user/suggestions`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error('Unauthorized access');
  //     }

  //     const data = await response.json();

  //     if (data.users && Array.isArray(data.users)) {
  //       setAllSuggestedUsers(data.users);
  //     } else {
  //       console.error("Unexpected data format:", data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch user suggestions:', error);
  //   }
  // };

  const fetchAllUserSuggestions = useCallback(async () => {
    // if (!query) return;

    try {
      const response = await axios.get(`/user/search/suggestions`, {
        params: { emptyquery },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.data || !Array.isArray(response.data.users)) {
        console.error("Error: Expected an array but got:", response.data);
        setAllSuggestedUsers([]); // Ensure followRequests is always an array
        return;
      }
      setAllSuggestedUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);


  useEffect(()=>{

    if(activeTab==='friends')
    {
      fetchFriends();
    }
   
    else if(activeTab==='people'){
      fetchAllUserSuggestions();

    }
    else if(activeTab==='search'){
      fetchUsers();
    }


  },[activeTab])


  return (
    <div className="bg-[#d8dfea] min-h-screen">
      {/* <div className="bg-[#3b5998] text-white p-3">
        <h1 className="text-xl font-bold">friendsbook</h1>
      </div> */}

<div className="bg-[#3B5998] text-white p-4 flex items-center justify-between shadow-md">
        <div className="text-xl font-bold">friendsbook</div>
        <div className="flex space-x-4">
      
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white border border-gray-300 mt-5 p-5">
        <div className="border-b border-gray-300 flex space-x-5 mb-5">

        <button
            className={`p-2 ${activeTab === 'friends' ? 'border-b-2 border-gray-500' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends
          </button>

          <button
            className={`p-2 ${activeTab === 'requests' ? 'border-b-2 border-gray-500' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Friend Requests ({followRequests.length})
          </button>

          <button
            className={`p-2 ${activeTab === 'people' ? 'border-b-2 border-gray-500' : ''}`}
            onClick={() => setActiveTab('people')}
          >
            People You May Know
          </button>

          <button
            className={`p-2 ${activeTab === 'search' ? 'border-b-2 border-gray-500' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </button>
        </div>

        {activeTab === 'requests' && (
  <div>
    {followRequests.length > 0 ? (
      followRequests.map((notif, index) => (
        <div key={index} className="border border-gray-300 p-4 flex items-center mb-3">
          <div className="w-16 h-16 bg-gray-200 flex items-center justify-center border mr-4">
            <img 
              src={notif.senderId.profilePic} 
              alt="profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{notif.senderId.fullname}</h3>
            <p className="text-sm text-gray-500">{notif.title}</p>
            <div className="mt-2 flex space-x-2">
              <button 
                onClick={() => handleFollowUnfollow(notif.senderId._id, 'follow', notif._id)}
                className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                Confirm
              </button>
              <button 
                onClick={() => handleDelete(notif._id)}
                className="bg-gray-200 text-sm px-3 py-1 rounded">
                Not Now
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p>No follow requests</p>
    )}
  </div>
)}



        {activeTab === 'search' && (
          <div>
            <input
              type="text"
              placeholder="Search for people..."
              className="border w-full p-2 rounded mb-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {suggestedUsers.map(user => (
              <div key={user._id} className="border border-gray-300 p-4 flex items-center mb-3">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center border mr-4">
                  <img 
                    src={user.profilePic} 
                    alt="profile" 
                    className="w-full h-full object-cover cursor-pointer"

                    onClick={() => goToUserProfile(user._id)}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{user.username}</h3>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleFollowUnfollow(user._id, user.followStatus === 'follow' ? 'follow' : 'unfollow')}
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                      {user.followStatus === 'follow' ? 'Follow' : 'Unfollow'}
                    </button>
                    <button
                      onClick={() => handleChat(user._id)}
                      className="bg-yellow-500 text-white text-sm px-3 py-1 rounded">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        {activeTab === 'people' && (
          <div>
         
            {allSuggestedUsers.map(user => (
              <div key={user._id} className="border border-gray-300 p-4 flex items-center mb-3">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center border mr-4">
                  <img 
                    src={user.profilePic} 
                    alt="profile" 
                    className="w-full h-full object-cover cursor-pointer"

                    onClick={() => goToUserProfile(user._id)}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{user.username}</h3>
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={() => handleFollowUnfollow(user._id, user.followStatus === 'follow' ? 'follow' : 'unfollow')}
                      className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                      {user.followStatus === 'follow' ? 'Follow' : 'Unfollow'}
                    </button>
                    <button
                      onClick={() => handleChat(user._id)}
                      className="bg-yellow-500 text-white text-sm px-3 py-1 rounded">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


{activeTab === 'friends' && (
          <div>
         
            {friends.map(user => (
              <div key={user._id} className="border border-gray-300 p-4 flex items-center mb-3">
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center border mr-4">
                  <img 
                    src={user.profilePic} 
                    alt="profile" 
                    className="w-full h-full object-cover cursor-pointer"

                    onClick={() => goToUserProfile(user._id)}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{user.username}</h3>
                  <div className="mt-2 flex space-x-2">
                  
                    <button
                      onClick={() => handleChat(user._id)}
                      className="bg-yellow-500 text-white text-sm px-3 py-1 rounded">
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        

        





      </div>
    </div>
  );
}
