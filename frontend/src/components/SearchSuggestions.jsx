import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const backendBaseUrl = "http://localhost:7000";

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const currentUserId = getUserIdFromToken();
  console.log(`currentUserId: ${currentUserId}`);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendBaseUrl}/user/search/suggestions`, {
        params: { query, page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.users.length > 0) {
        setSuggestedUsers((prev) => {
          const newUsers = response.data.users.filter(
            (user) => !prev.some((prevUser) => prevUser._id === user._id)
          );
          return [...prev, ...newUsers];
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFollowUnfollow = async (userId, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${backendBaseUrl}/user/search/${action}`,
        { userId: currentUserId, targetId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuggestedUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, followStatus: action === "follow" ? "unfollow" : "follow" }
            : user
        )
      );
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
    }
  };

  useEffect(() => {
    setSuggestedUsers([]);
    setPage(1);
    setHasMore(true);
    fetchUsers();
  }, [query]);

  useEffect(() => {
    if (!hasMore) return;
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  useEffect(() => {
    if (page > 1) fetchUsers();
  }, [page]);

  return (
    <div className="w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto p-4 sm:p-8 bg-gray-100 min-h-screen">
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out shadow-sm text-sm sm:text-base"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {suggestedUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col items-center text-sm sm:text-base"
          >
            <img
              src={
                user.profilePic === "/images/default_profile.jpeg"
                  ? "/images/default_profile.jpeg"
                  : `${backendBaseUrl}${user.profilePic}`
              }
              alt={user.username}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-blue-500"
            />
            <div className="text-center mt-3 sm:mt-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {user.username}
              </h3>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm">
                {user.bio ? user.bio : "-"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-4 sm:mt-6 gap-2 sm:gap-4">
              <button
                onClick={() =>
                  handleFollowUnfollow(user._id, user.followStatus === "follow" ? "follow" : "unfollow")
                }
                className={`w-full sm:w-auto px-3 sm:px-4 py-2 ${
                  user.followStatus === "follow"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-red-500 hover:bg-red-600"
                } text-white font-semibold rounded-full shadow-md transition duration-200 text-xs sm:text-sm`}
              >
                {user.followStatus === "follow" ? "Follow" : "Unfollow"}
              </button>
              <button className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-full shadow-md transition duration-200 text-xs sm:text-sm">
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSuggestions;
