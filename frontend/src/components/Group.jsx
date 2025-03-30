import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

const GroupPage = () => {
  const { id } = useParams(); // Get groupId from URL
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentMembers, setRecentMembers] = useState([]);

  const navigate=useNavigate(); 


  const token=localStorage.getItem('token');
  if(!token)
  {
    alert("Please login first");
  }

  const decoded=jwtDecode(token);
  const userId=decoded.userId;


  useEffect(() => {
    const fetchGroup = async () => {
      try {
        console.log("groupId", id);
        const response = await fetch(`/group/${id}`);
        if (!response.ok) throw new Error("Failed to fetch group data");
        
        const data = await response.json();
        console.log("data", data);
        setGroup(data);
      } catch (error) {
        console.error("Error fetching group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);


  useEffect(() => {
    const fetchRecentMembers = async () => {
      try {
        const response = await fetch(`/group/${id}/recent-members`);
        if (!response.ok) throw new Error("Failed to fetch recent members");

        const data = await response.json();
        setRecentMembers(data.recentMembers);
        console.log("members");
        console.log(data.recentMembers);
      } catch (error) {
        console.error("Error fetching recent members:", error);
      }
    };

    fetchRecentMembers();
  }, [id]);






  const handleJoinGroup = async () => {

    try {
      const response = await fetch(`/group/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      console.log(response);

      const data = await response.json();
      if (response.ok) {
        setGroup((prev) => ({
          ...prev,
          members: [...prev.members, userId], // Update frontend state
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  


  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!group) return <div className="text-center p-10">Group not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">friendsbook</h1>
        <input type="text" placeholder="Search" className="p-2 text-black rounded w-1/3" />
        <nav className="space-x-6">
          <a onClick={()=>{navigate('/home')}} className="hover:underline cursor-pointer">Home</a>
          <a onClick={()=>{navigate('/profile')}} className="hover:underline cursor-pointer">Profile</a>
          <a onClick={()=>{navigate('/chats')}} className="hover:underline cursor-pointer">Messages</a>
        </nav>
      </header>

      <div
        className="h-52 flex items-center justify-center text-gray-600 text-2xl font-semibold"
        style={{ backgroundImage: `url(${group.coverPhoto || "https://via.placeholder.com/800x200"})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="font-bold text-lg">About This Group</h3>
            <p className="text-sm text-gray-600">{group.description || "No description available."}</p>
            <p className="text-sm text-gray-600">Created on: {new Date(group.createdAt).toDateString()}</p>
            <p className="text-sm font-bold">Type: {group.privacy.charAt(0).toUpperCase() + group.privacy.slice(1)} Group</p>
            {/* <button className="bg-blue-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-800">Join Group</button> */}
            {!group.members.includes(userId) && (
            <button
              onClick={handleJoinGroup}
              className="bg-blue-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-800"
            >
              Join Group
            </button>
          )}
          </div>
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="font-bold text-lg">Group Admins</h3>
            {group.admins.length > 0 ? (
              group.admins.map((admin) => <p key={admin._id} className="text-sm text-gray-600">{admin.name}</p>)
            ) : (
              <p className="text-sm text-gray-600">No admins available.</p>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-5 rounded shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
              <input type="text" placeholder="Write something..." className="flex-1 border p-3 rounded-lg" />
            </div>
            <div className="flex space-x-6 mt-3 text-blue-600 text-sm font-semibold">
              <span>📷 Photo</span>
              <span>📁 File</span>
              <span>📌 Poll</span>
            </div>
          </div>

          {group.posts.length > 0 ? (
            group.posts.map((post) => (
              <div key={post._id} className="bg-white p-5 rounded shadow-lg">
                <div className="flex space-x-4">
                  <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                  <div>
                    <h4 className="font-bold">{post.author?.name || "Unknown User"}</h4>
                    <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleString()}</p>
                    <p className="mt-2">{post.content}</p>
                    {post.image && <img src={post.image} alt="Post" className="max-h-48 w-full object-cover rounded-lg mt-3" />}
                    <div className="flex space-x-6 text-blue-600 text-sm font-semibold mt-3">
                      <span>👍 Like</span>
                      <span>💬 Comment</span>
                      <span>🔄 Share</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No posts yet.</p>
          )}
        </div>

        {/* Right Sidebar (Newly Added) */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="font-bold text-lg">Recent Photos</h3>
            {/* {group.events.length > 0 ? (
              group.events.map((event) => (
                <p key={event._id} className="text-sm text-gray-600">{event.name} - {new Date(event.date).toDateString()}</p>
              ))
            ) : (
              <p className="text-sm text-gray-600">No upcoming events.</p>
            )} */}

              <p className="text-sm text-gray-600">No Recent Photos available</p>  

          </div>
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="font-bold text-lg">Recent Members</h3>
            <div className="flex space-x-4">
        {recentMembers.map((member) => (
          <div key={member._id} className="flex flex-col items-center">
            <img
              src={member.profilePic}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {/* <p className="text-sm text-gray-600">{member.name}</p> */}
          </div>
        ))}
      </div>
            {/* <p className="text-sm text-gray-600">No recent members available.</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
