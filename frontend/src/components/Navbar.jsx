import React from 'react';
import logo from '/images/logo.jpeg';


const Navbar = ({ username, profilePic }) => {
  // Construct the full path for the profile picture
  const BACKEND_URL='http://localhost:7000'
  // const profilePicUrl = profilePic ? `${BACKEND_URL}${profilePic}` : '/images/default_profile.jpeg';
  const profilePicUrl=profilePic==='/images/default_profile.jpeg'?'/images/default_profile.jpeg':`${BACKEND_URL}${profilePic}`;
  console.log(`profilePicUrl ${profilePicUrl}`)

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center py-4 px-5 bg-gray-100 border-b-2 border-gray-300 z-10 shadow-md">
      {/* Left side: Brand Logo and Tagline */}
      <div className="flex items-center ml-6">
        <img src={logo} alt="Friendsbook logo" className="w-14 h-14 mr-3" />
        <div className="text-xl">
          <h1 className="text-2xl font-bold">friendsbook</h1>
          <p className="text-sm">&nbsp;&nbsp;Be Social . Be Popular</p>
        </div>
      </div>

      {/* Right side: Profile Picture and Username */}
      <div className="flex items-center mr-6">
        <img
          id="profilePic"
          src={profilePicUrl}
          alt="Profile Picture"
          className="w-12 h-12 rounded-full mr-2"
        />
        {console.log(`in nav ${profilePicUrl}-${username}`)}
        <p id="username" className="font-bold text-lg">
          {username || "Username"}
        </p>
      </div>
    </nav>

);
};

export default Navbar;
