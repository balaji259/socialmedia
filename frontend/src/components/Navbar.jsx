import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from '/images/logo.jpeg';

const Navbar = ({ username, profilePic }) => {
  const BACKEND_URL = 'http://localhost:7000';
  const profilePicUrl =
    profilePic === '/images/default_profile.jpeg'
      ? '/images/default_profile.jpeg'
      : `${profilePic}`;

    const navigate=useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full flex flex-wrap justify-between items-center py-3 px-4 bg-gray-100 border-b-2 border-gray-300 z-10 shadow-md">
      {/* Left side: Brand Logo and Tagline */}
      <div className="flex items-center space-x-3">
        {/* <img src={logo} alt="Friendsbook logo" className="w-10 h-10 sm:w-12 sm:h-12" /> */}
        <div className="text-base sm:text-lg">
          <h1 className="font-bold text-red-500 text-xl">friendsbook</h1>
          <p className="text-xs sm:text-sm text-gray-600">Be Social . Be Popular</p>
        </div>
      </div>

      {/* Right side: Profile Picture and Username */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>navigate(`/profile`)}> 
        <img
          src={profilePicUrl}
          alt="Profile"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
        />
        <p className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[6rem] sm:max-w-[10rem]">
          {username || 'Username'}
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
