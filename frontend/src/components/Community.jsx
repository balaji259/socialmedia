import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import {useNavigate} from"react-router-dom";

const CommunityPage = () => {
  const { id } = useParams(); // Get groupId from URL
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentMembers, setRecentMembers] = useState([]);
  const [admins,setAdmins]=useState([]);
  const [user,setUser]=useState(null);

  const navigate=useNavigate();


  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);


  const [groupPhotos,setGroupPhotos]=useState([]);

  const token=localStorage.getItem('token');
  const decoded=jwtDecode(token);
  const userId=decoded.userId;


  const getUserData= async () =>{
    try{
        const token=localStorage.getItem("token");
        console.log("before call");
        const res=await axios.get(`/user/getdetails`,{
            headers: {
                Authorization:`Bearer ${token}`,
            },

        })
        console.log("after call...");
        console.log("userdata");
        console.log(res.data);
        setUser(res.data);
    }
    catch(e){
        console.log(`error fetching the user details: ${e}`);
        
    }
}

useEffect(()=>{
  getUserData();
},[]);



  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        console.log("CommunityId", id);
        const response = await fetch(`/community/${id}`);
        if (!response.ok) throw new Error("Failed to fetch community data");
        
        const data = await response.json();
        console.log("data", data);
        setCommunity(data);
      } catch (error) {
        console.error("Error fetching community:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  useEffect(() => {
    const fetchRecentMembers = async () => {
      try {
        const response = await fetch(`/community/${id}/recent-members`);
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


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch(`/community/${id}/admins`);
        if (!response.ok) throw new Error("Failed to fetch admins");

        const data = await response.json();
        setAdmins(data.admins);
        console.log("admins");
        console.log(data.admins);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, [id]);



  const handleJoinCommunity = async () => {

    try {
      const response = await fetch(`/community/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      console.log(response);

      const data = await response.json();
      if (response.ok) {
        setCommunity((prev) => ({
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


  const handleLeaveCommunity = async () => {
    try {
      const response = await fetch(`/community/${id}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setCommunity((prev) => ({
          ...prev,
          members: prev.members.filter((member) => member !== userId), // Update frontend state
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error leaving community:", error);
    }
  };


  const handleMediaChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(file);
    }
  };


  // const handleSubmit = async () => {
  //   if (!text && !image) return;
    
  //   const formData = new FormData();
  //   formData.append("text", text);
  //   if (image) formData.append("image", image);
    
  //   try {
  //     console.log("formdata");
  //     // console.log(formData);
  //     for (let pair of formData.entries()) {
  //       console.log(pair[0], pair[1]);
  //     }
  //     const response = await fetch("/community/post", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     if (response.ok) {
  //       console.log("Post submitted successfully");
  //       setText("");
  //       setImage(null);
  //     }
  //   } catch (error) {
  //     console.error("Error submitting post", error);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsPosting(true);
    
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in again.");
        return;
    }
    
    if (!text?.trim() && !media) {
        alert("Post cannot be empty!");
        // setIsPosting(false);
        return;
    }

    let mediaUrl = null;

    // Upload media to Cloudinary if present
    if (media) {
        try {
            const cloudinaryData = new FormData();
            cloudinaryData.append("file", media);
            cloudinaryData.append("upload_preset", "simpleunsigned");

            const cloudResponse = await fetch("https://api.cloudinary.com/v1_1/dhtk7vhyv/upload", {
                method: "POST",
                body: cloudinaryData,
            });

            if (!cloudResponse.ok) {
                throw new Error("Cloudinary upload failed");
            }

            const cloudData = await cloudResponse.json();
            mediaUrl = cloudData.secure_url;
        } catch (error) {
            console.error("Media upload error:", error);
            // toast.error("Failed to upload media. Please try again.");
            // setIsPosting(false);
            return;
        }
    }

    // Decode userId from token
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = JSON.parse(atob(base64));
    const userId = jsonPayload.userId;
    
    const groupId = id; 
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("groupId", groupId);
    if (text?.trim()) formData.append("caption", text.trim());
    if (mediaUrl) formData.append("mediaContent", mediaUrl);

    try {
      console.log("formdata");
      // console.log(formData);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
        const response = await fetch("/community/post", {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to create post");
        }

        // setPostContent("");
        // setMediaContent(null);
        // if (fileInputRef.current) fileInputRef.current.value = "";
        alert("Post created successfully");
        setText("");
        setMedia(null);
        getAllPosts(); // Refresh posts
    } catch (error) {
        console.error("Error submitting form:", error);
        // toast.error("Error in creating post. Please try again.");
    } 
};


const getAllPosts=async ()=>{
  try {
    console.log("Getting all the posts!");
    const response = await axios.get(`/community/posts/${id}`);
    if (!response.ok) {
      console.log("Error with response");
    }
    console.log("group posts");
    console.log(response.data);
    setGroupPhotos(response.data);
    // return data; // return posts to use in UI
  } catch (error) {
    console.error("Error fetching posts:", error);
    // return [];

  }
}

useEffect(()=>{
  getAllPosts();
},[])

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!community) return <div className="text-center p-10">Community not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">friendsbook</h1>
        <input type="text" placeholder="Search" className="p-2 text-black rounded w-1/3" />
        <nav className="space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Profile</a>
          <a className="hover:underline cursor-pointer" onClick={()=>{navigate(`/community/${id}/sections`)}}>Sections</a>
          {/* <a href="#" className="hover:underline">Messages</a> */}
        </nav>
      </header>

      {/* <div
        className="h-52 flex items-center justify-center text-gray-600 text-2xl font-semibold"
        style={{ backgroundImage: `url(${community.coverPhoto || "https://via.placeholder.com/800x200"})`, backgroundSize: "cover", backgroundPosition: "center" }}
      /> */}

      {/* Cover Photo with Profile Picture */}
      <div className="relative w-full h-52">
        <img
          src={community.coverPhoto || "https://via.placeholder.com/800x200"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <img
          src={community.profilePicture || "https://via.placeholder.com/100"}
          alt="Profile"
          className="absolute bottom-0 translate-y-8 left-5 w-[95px] h-[95px] object-cover border-4 border-white rounded-full"
        />
      </div>


      <div className="max-w-6xl mx-auto p-6 grid grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="font-bold text-lg">About This Community</h3>
            <p className="text-sm text-gray-600">{community.description || "No description available."}</p>
            <p className="text-sm text-gray-600">Created on: {new Date(community.createdAt).toDateString()}</p>
            <p className="text-sm font-bold">Type: {community.privacy.charAt(0).toUpperCase() + community.privacy.slice(1)} Community</p>
            {/* <button className="bg-blue-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-800">Join Community</button> */}
            {community.members.includes(userId) ? (
      <button
        onClick={handleLeaveCommunity}
        className="bg-red-600 text-white px-4 py-2 rounded mt-4 w-full hover:bg-red-700"
      >
        Leave Community
      </button>
    ) : (
      <button
        onClick={handleJoinCommunity}
        className="bg-blue-700 text-white px-4 py-2 rounded mt-4 w-full hover:bg-blue-800"
      >
        Join Community
      </button>
    )}
          </div>
          <div className="bg-white p-5 rounded shadow-lg">
            <h3 className="font-bold text-lg">Community Admins</h3>
            {admins.map((member) => (
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
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-6">
       
        <div className="bg-white p-5 rounded shadow-lg">
      <div className="flex items-center space-x-4">
        <img src={user?.profilePic} className="w-12 h-12 rounded-full" alt="Profile" />
        <input
          type="text"
          placeholder="Write something..."
          className="flex-1 border p-3 rounded-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
      {media && (
        <div className="mt-3">
        
        {media.type.startsWith('video') ? (
          <video
            src={URL.createObjectURL(media)}
            controls
            className="w-20 h-20 object-cover rounded"
      
          />
        ) : (
          <img
            src={URL.createObjectURL(media)}
            alt="Preview"
            className="w-20 h-20 object-cover rounded"
           
          />
        )}

        </div>
      )}
      <div className="flex space-x-6 mt-3 text-blue-600 text-sm font-semibold">
        <label htmlFor="imageUpload" className="cursor-pointer">📷 Photo</label>
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          accept="image/*,video/*"
          onChange={handleMediaChange}
        />
        {/* <span>📁 File</span> */}
        {/* <span>📌 Poll</span> */}
      </div>
    </div>

          {groupPhotos.length > 0 ? (
            groupPhotos.map((post) => (
              <div key={post._id} className="bg-white p-5 rounded shadow-lg">
                <div className="flex space-x-4">
                  {/* <div className="bg-gray-300 w-12 h-12 rounded-full"></div> */}
                  <img src={post.user?.profilePic} className="w-12 h-12 rounded-full" alt="Profile" />
                  <div>
                    <h4 className="font-bold">{post.user?.username}</h4>
                    <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleString()}</p>
                    <p className="mt-2">{post.caption}</p>
                    {/* {post.image && <img src={post.image} alt="Post" className="max-h-48 w-full object-cover rounded-lg mt-3" />} */}
                    {post.postType=='image' && <img src={post.media} alt="Image" className="max-h-48 w-full object-cover rounded-lg mt-3" /> }

                    {post.postType=='video' && <video src={post.media} alt="Video" controls className="max-h-48 w-full object-cover rounded-lg mt-3" /> }

                    
                    
                    {/* <div className="flex space-x-6 text-blue-600 text-sm font-semibold mt-3">
                      <span>👍 Like</span>
                      <span>💬 Comment</span>
                      <span>🔄 Share</span>
                    </div> */}

                    
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

export default CommunityPage;
