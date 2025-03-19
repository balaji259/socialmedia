import React, {useEffect,useState} from 'react';
import { useNavigate } from "react-router-dom";
import logo from '/images/logo.jpeg';
import { FaBell } from 'react-icons/fa';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';


const Navbar = ({ username, profilePic }) => {

  const [notificationCount, setNotificationCount] = useState(0);

  const BACKEND_URL = 'http://localhost:7000';
  const profilePicUrl =
    profilePic === '/images/default_profile.jpeg'
      ? '/images/default_profile.jpeg'
      : `${profilePic}`;

    const navigate=useNavigate();

    function sendFeedback(){
      // console.log("Send feedback!");
      navigate('/feedback');
    }

 
 
   // ✅ Function to fetch unread notifications count
   const fetchNotificationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const res = await axios.get(`/notifications/unread/count/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("res");
      console.log(res);

      // ✅ Update notification count
      setNotificationCount(res.data.unreadCount);
    } catch (error) {
      console.error("Error fetching notification count", error);
    }
  };

  // ✅ Fetch notifications every 5 seconds
  useEffect(() => {
    fetchNotificationCount(); // Fetch once on mount

    const intervalId = setInterval(() => {
      fetchNotificationCount();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);




  return (
    <nav className="fixed top-0 left-0 w-full flex flex-wrap justify-between items-center py-3 px-4 bg-gray-100 border-b-2 border-gray-300 z-10 shadow-md">
      {/* Left side: Brand Logo and Tagline */}
      <div className="flex items-center space-x-3">
        {/* <img src={logo} alt="Friendsbook logo" className="w-10 h-10 sm:w-12 sm:h-12" /> */}
        <div className="text-base sm:text-lg">
          <h1 className="font-bold text-[#3b5998] text-xl">friendsbook</h1>
          <p className="text-xs sm:text-sm text-gray-600">Be Social . Be Popular</p>
        </div>
      </div>

      {/* Right side: Profile Picture and Username */}
      <div className="flex items-center space-x-2 cursor-pointer" > 


     <div className="relative cursor-pointer mr-4" onClick={()=>{navigate('/notifications')}}>
      <FaBell size={24} color="#3b5998" />

      {/* ✅ Notification Count Badge */}
        {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}

     </div>

        <img
          src={profilePicUrl}
          alt="Profile"
          onClick={()=>navigate(`/profile`)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[6rem] sm:max-w-[10rem]" onClick={()=>navigate(`/profile`)}>
          {username || 'Username'}
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
