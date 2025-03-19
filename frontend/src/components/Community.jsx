import React from "react";

const Community = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#3b5998] text-white px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">friendsbook</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Community"
            className="px-3 py-1 rounded-md text-black"
            />
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Profile</a>
          <a href="#" className="hover:underline">Messages</a>
          <a href="#" className="hover:underline">Notifications</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow bg-gray-100 h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-1/5 bg-white shadow-md h-full overflow-y-auto p-4">
          <h2 className="font-bold text-[#3b5998]">Community</h2>
          <ul className="mt-2 space-y-2">
            <li className="bg-gray-200 p-2 rounded-md">Your Community</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer rounded-md">Discover</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer rounded-md">Create Group</li>
            <li className="p-2 hover:bg-gray-200 cursor-pointer rounded-md">Settings</li>
          </ul>
        </div>

        {/* Right Content */}
        <div className="w-4/5 bg-white shadow-md h-full overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Community</h2>
            <button className="bg-[#3b5998] text-white px-4 py-2 rounded-md hover:bg-purple-700">
              + Create New Community
            </button>
          </div>

          {/* Community Cards */}
          <div className="grid grid-cols-4 gap-4">
            {Array(18).fill("").map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-lg shadow-md p-4">
                <div className="h-24 bg-gray-300 rounded-md"></div>
                <h3 className="font-bold text-[#3b5998] mt-2">Community Name</h3>
                <p className="text-sm text-gray-600">12K members • 5 posts today</p>
                <p className="text-sm text-gray-500">
                  This is a short description of the community.
                </p>
                <button className="mt-2 bg-[#3b5998] text-white px-3 py-1 rounded-md hover:bg-purple-200">
                  View Community
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
