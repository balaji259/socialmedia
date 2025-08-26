import React, {useEffect,useState, useRef} from 'react';
import { useNavigate } from "react-router-dom";
import logo from '/images/logo.jpeg';
import { FaBell } from 'react-icons/fa';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';


const Navbar = ({ username, profilePic }) => {

  const [notificationCount, setNotificationCount] = useState(0);


  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  


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

      // Close dropdown if clicked outside
      useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
    

 
 
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


  const toggleGoogleTranslate = () => {
    const translateDiv = document.getElementById('google_translate_element');
    if (translateDiv) {
      translateDiv.classList.toggle('hidden');
    }
  };



  return (
    <nav className="fixed top-0 left-0 w-full flex flex-wrap justify-between items-center py-3 px-4 bg-gray-100 border-b-2 border-gray-300 z-10 shadow-md">
      {/* Left side: Brand Logo and Tagline */}
      <div className="flex items-center space-x-3">
        {/* <img src={logo} alt="Friendsbook logo" className="w-10 h-10 sm:w-12 sm:h-12" /> */}
        <div className="text-base sm:text-lg">
          <h1 className="font-bold text-[#3b5998] text-xl">peoplechat</h1>
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

        {/* <img
          src={profilePicUrl}
          alt="Profile"
          onClick={()=>navigate(`/profile`)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[6rem] sm:max-w-[10rem]" onClick={()=>navigate(`/profile`)}>
          {username || 'Username'}
        </p> */}

<div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Summary (clickable) */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img
          src={profilePicUrl}
          alt="Profile"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[6rem] sm:max-w-[10rem]">
          {username || 'Username'}
        </p>
      </div>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border">
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              navigate('/profile');
              setOpen(false);
            }}
          >
            View Profile
          </button>
       
          {/* <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  toggleGoogleTranslate();
                  setOpen(false);
                }}
              >
                Google Translate
              </button> */}


              

          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              navigate('/feedback');
              setOpen(false);
            }}
          >
            Feedback
          </button>
        </div>
      )}
    </div>

      </div>
    </nav>
  );
};

export default Navbar;
