import React from "react";

const Groups = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#3b5998] h-12 fixed top-0 w-full shadow-md z-50">
        <div className="max-w-6xl mx-auto flex items-center h-full px-4">
          <a href="#" className="text-white text-lg font-bold">friendsbook</a>
          <div className="bg-white ml-4 px-3 h-7 flex items-center rounded-md w-72">
            <input
              type="text"
              placeholder="Search Groups"
              className="w-full outline-none text-sm"
            />
          </div>
          <div className="ml-auto flex space-x-4">
            <a href="#" className="text-white text-sm font-semibold mr-4">Home</a>
            <a href="#" className="text-white text-sm font-semibold mr-4">Profile</a>
            <a href="#" className="text-white text-sm font-semibold mr-4">Messages</a>
            <a href="#" className="text-white text-sm font-semibold mr-4">Notifications</a>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto mt-16 p-4 flex gap-4 h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-4 shadow-sm rounded-md h-full flex flex-col overflow-y-auto">
          <h2 className="text-[#3b5998] text-lg font-bold">Groups</h2>
          <ul className="mt-2 text-sm flex-1">
            <li className="py-2 px-4 font-bold bg-gray-200 rounded-md ">Your Groups</li>
            <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer">Discover</li>
            <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer">Create Group</li>
            <li className="py-2 px-4 hover:bg-gray-200 cursor-pointer">Settings</li>
          </ul>
        </div>

        {/* Groups Section */}
        <div className="w-3/4 bg-white p-4 shadow-sm rounded-md flex-1 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Your Groups</h1>
            <button className="bg-[#4267B2] text-white px-4 py-1 text-sm font-semibold rounded-md hover:bg-[#3b5998]">
              + Create New Group
            </button>
          </div>
          {/* Groups Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Group Card */}
            {[1, 2, 3, 4, 5, 6, 7,8,9,10,11,12].map((group) => (
              <div key={group} className="border border-gray-300 rounded-md overflow-hidden">
                <div className="h-36 bg-gray-300">
                  <img
                    src="https://via.placeholder.com/250x150"
                    alt="Group Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-[#3b5998] font-bold text-sm">Group Name {group}</h3>
                  <p className="text-gray-600 text-xs">10K members • 3 posts today</p>
                  <p className="text-gray-800 text-xs mt-1">This is a group description.</p>
                  <button className="w-full mt-2 bg-gray-200 text-[#3b5998] py-1 text-sm font-semibold rounded-md hover:bg-gray-300">
                    View Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
