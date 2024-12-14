import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [userId, setUserId] = useState(null); // Initialize with `null` to avoid premature API calls
  const backendBaseUrl = "http://localhost:7000";

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload:", payload.userId);
      setUserId(payload.userId); // Set the userId
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  useEffect(() => {
    getUserIdFromToken(); // Fetch userId from token
  }, []); // Run only on component mount

  useEffect(() => {
    if (!userId) return; // Avoid API call until userId is available

    const fetchFriends = async () => {
      try {
        console.log("Fetching friends for userId:", userId);
        const response = await axios.get(`${backendBaseUrl}/user/${userId}/friends`);
        console.log("API Response:", response.data);
        setFriends(response.data.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [userId]);

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {friends.map((friend) => (
          <div key={friend._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={
                friend.profilePic === "/images/default_profile.jpeg"
                  ? "/images/default_profile.jpeg"
                  : `${backendBaseUrl}${friend.profilePic}`
              }
              alt={friend.username}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-left">{friend.username}</h3>
              <button
                className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                onClick={() => {
                  console.log("clicked chat option!");
                }}
              >
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
console.log("FriendsList component mounted");
console.log("FriendsList component rendered");