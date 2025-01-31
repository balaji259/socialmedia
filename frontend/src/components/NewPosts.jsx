import React, { useState, useEffect, useRef } from "react";
import "./NewPosts.css";
import axios from "axios";
const App = () => {
  const [activeTab, setActiveTab] = useState(null);

  const [userData,setUserData]=useState(null);
  const [userPosts,setUserPosts]=useState([]);
  const [savedPosts,setSavedPosts]=useState([]);
  const [likedPosts,setLikedPosts]=useState([]);
  const [selectedPost,setSelectedPost]=useState(null);


  const backendBaseUrl = 'http://localhost:7000';
  const renderurl="https://socialmedia-backend-2njs.onrender.com";
  const buttonRef=useRef(null);
  
  useEffect(() => {
    // Click the button programmatically when the component renders
    setTimeout(() => {
      if (buttonRef.current) {
        console.log("Clicked posts!");
        buttonRef.current.click();
      }
    }, 1000);
    
  }, []); // Empty dependency array ensures this runs only once on render

  const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in. Please log in to view your profile.');
            window.location.href = 'index.html';
            return;
        }

        console.log("i n fetching userposts");

        const response = await fetch(`/profile/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        // console.log(response.json().data);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("data");
        console.log("this is me id");
        console.log(data);
        // console.log(userData._id);
        setUserData(data);
       
        
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        // setError('Error fetching user data. Please try again later.');
    }
};


useEffect(() => {
    fetchUserData();
}, []);

useEffect(() => {
    if (userData) {
        console.log("User ID:", userData._id); // Access userData._id here after it’s updated
    }
}, [userData]);



  const fetchUserPosts = async () => {
    try {
        const userId = userData._id;
        console.log(userId);

        if (userData) {
            const response = await axios.get(`/profile/userPosts/${userId}`);
            

            console.log("posts esponse");
            console.log(response);
            
            setUserPosts(response.data.posts || []);
        } else {
            console.log("No user data!");
        }
    } catch (error) {
        console.error('Error fetching user posts:', error);
        setUserPosts([]);
    }
};


const fetchSavedPosts = async () => {
    try {
        console.log("entered fetch User Saved");
        const userId = userData._id;
        console.log(userId);

        if (userData) {
            const response = await axios.get(`/profile/savedPosts/${userId}`);
            
            console.log("response");
            console.log(response);
            console.log("setting savedData");
            
            setSavedPosts(response.data || []);
            
        } else {
            console.log("No user data!");
        }
    } catch (error) {
        console.error('Error fetching user posts:', error);
        setSavedPosts([]);
    }
};


  const fetchLikedPosts = async () => {
    try {
        const userId=userData._id;
        console.log(userId);

        const response = await axios.get(`/profile/likedPosts/${userId}`);
        console.log(response);
        setLikedPosts(response.data);
    } catch (error) {
        console.error('Error fetching liked posts:', error);
        setLikedPosts([]);
    }
};


useEffect(()=>{
    console.log("actuveTab changed!");
    if(userData){
        if(activeTab==="posts")
            fetchUserPosts();
        else if(activeTab==="saved")
            fetchSavedPosts();
        else
            fetchLikedPosts();
    }
  },[activeTab])



  const renderPosts = () => {
    const data =
      activeTab === "posts"
        ? userPosts
        : activeTab === "saved"
        ? savedPosts
        : likedPosts;

        return (
            <div className="grid-container">
  {data.map((post) => {
    // Determine whether to use post or post.postId
    const currentPost = post.postId || post;

    return (
      <div
        key={currentPost._id}
        className="grid-item"
        onClick={() => setSelectedPost(currentPost)}
      >
       
        {currentPost.content?.mediaUrl && currentPost.postType === "image" && (
          <img
            src={currentPost.content.mediaUrl}
            alt={`Post ${currentPost._id}`}
          />
        )}
        {currentPost.content?.mediaUrl && currentPost.postType === "video" && (
          <video
            
            src={currentPost.content.mediaUrl}
            alt={`Post ${currentPost._id}`}
          />
        )}
        {currentPost.caption && <p>{currentPost.caption}</p>}
      </div>
    );
  })}

  {/* Modal Section */}
  {selectedPost && (
    <div
      className="modal-overlay"
      onClick={() => setSelectedPost(null)} // Close modal on overlay click
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent overlay click from closing modal
      >
        <button
          className="close-button"
          onClick={() => setSelectedPost(null)} // Close modal on button click
        >
          &times;
        </button>
        {selectedPost.content?.mediaUrl && selectedPost.postType==="image" && (
          <img
            src={selectedPost.content.mediaUrl}
            alt={`Selected Post ${selectedPost._id}`}
            className="modal-image"
          />
        )}
        {selectedPost.content?.mediaUrl && selectedPost.postType==="video" && (
          <video
            controls
            src={selectedPost.content.mediaUrl}
            alt={`Selected Post ${selectedPost._id}`}
            className="modal-image"
          />
        )}
        {selectedPost.caption && (
          <p className="modal-caption">{selectedPost.caption}</p>
        )}
      </div>
    </div>
  )}
</div>

          );
         
  };


 

  return (
    <div className="App">
      <div className="button-container">
        <button
          ref={buttonRef}
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
        <button
          className={activeTab === "liked" ? "active" : ""}
          onClick={() => setActiveTab("liked")}
        >
          Liked
        </button>
      </div>
      <div className="posts-container">{renderPosts()}</div>
    </div>
  );
};

export default App;