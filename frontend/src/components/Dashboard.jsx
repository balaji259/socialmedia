import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 h-full w-60 bg-gray-100 border-r border-gray-300 p-6 flex flex-col justify-between">
      {/* Top Section */}
      <div className="flex flex-col space-y-10 pt-20">
        
          <button className="sec-left-button" onClick={()=>{navigate('/home')}}>Home</button>
    
        <button className="sec-left-button" onClick={()=>{navigate('/search')}}>Search</button>
        <button className="sec-left-button">Friends</button>
        <button className="sec-left-button">Chats</button>
        <button className="sec-left-button">Notifications</button>
        
          <button className="sec-left-button" onClick={()=>{navigate('/profile')}}>Profile</button>
        
      </div>

      {/* Bottom Section */}
      <div className="pt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
