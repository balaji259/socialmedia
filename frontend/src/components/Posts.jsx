import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './scroll.css';
import "./Posts.css"
import {useSocket} from "./useSocket";
import { useChatStore } from './useChatStore';
import axios from "axios";

// Define all styles at the top
const postComponentContainerStyle = {
  marginTop: '15px',
  // padding: '20px',
  width:'100%',
  backgroundColor: '#d5d5d5',
  // maxHeight: '80vh',
  overflowY: 'scroll',
};



const postInputContainerStyle = {
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  border:'2px solid black',
  marginTop:'15px'
};

const textareaStyle = {
  width: '100%',
  height: '60px',
  padding: '10px',
  borderRadius: '5px',
  border:'1px solid grey',
  borderColor: '#ddd',
  resize: 'none',
};

const removeButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  backgroundColor: '#ff4d4d',
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  padding: '5px 10px',
  cursor: 'pointer',
  fontSize: '12px',
};

// const submitButtonStyle = {
//   backgroundColor: '#007bff',
//   // backgroundColor:'#e5e5e5e',
//   color: '#fff',
//   padding: '8px 15px',
//   border: 'none',
//   borderRadius:'5px',
//   cursor: 'pointer',
//   marginTop: '10px',
//   // position:'relative',
//   // right:'-180px'
// };


// const hiddenFileInputStyle = {
//   position: 'absolute',
//   left: '0',
//   top: '0',
//   width: '100%',
//   height: '100%',
//   opacity: 0,
//   zIndex: -1,
// };

// const customUploadButtonStyle = {
//   backgroundColor: '#007bff',
//   color: '#fff',
//   padding: '8px 15px',
//   border: 'none',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   fontSize: '14px',
// };

const submitButtonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '10px 20px', // Ensure uniform padding
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px', // Match the font size
  display: 'flex', // Align content for consistent appearance
  alignItems: 'center',
  justifyContent: 'center',
};

const customUploadButtonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '10px 20px', // Same padding as the submit button
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px', // Match the font size
  display: 'flex', // Align content for consistency
  alignItems: 'center',
  justifyContent: 'center',
};

const hiddenFileInputStyle = {
  position: 'absolute',
  left: '0',
  top: '0',
  width: '100%',
  height: '100%',
  opacity: 0,
  zIndex: -1,
};


const userPostStyle = {
  backgroundColor: '#ffffff',
  padding: '30px',
  marginBottom: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  // border: '2px solid black'
  overflow:"hidden",
  position:"relative"
};

const postHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  // position: 'relative'
};

const userInfoStyle = {
  display: 'flex',
  // alignItems: 'center',
  alignItems: 'flex-start',
  cursor:"pointer",
  flexWrap:"noWrap",
  gap:"10px",
  overflow:"hidden"


};

const profilePicStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '5px',
  marginRight: '8px',
  // border:'4px solid grey'
};

const usernameStyle = {
  fontWeight: 'bold',
  marginLeft:'4px',
  marginTop:'8px'
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  marginLeft:"8px"
};

// const dropdownMenuStyle = {
//   position: 'absolute',
//   right: '20px',
//   top: '20px', // Position the dropdown below the three dots
//   backgroundColor: '#333',
//   color: '#fff',
//   borderRadius: '4px',
//   padding: '8px 0',
//   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   zIndex: 1
// };

// const dropdownMenuStyle = {
//   position: 'absolute',
//   right: '25px',
//   top: '25px', // Position the dropdown below the three dots
//   backgroundColor: '#333',
//   color: '#fff',
//   borderRadius: '4px',
//   padding: '8px 0',
//   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//   zIndex: 1
// };

const dropdownMenuStyle = {
  position: 'absolute',
  right: '0', // Align the dropdown beside the toggle button
  top: '0', // Align it vertically with the toggle button
  transform: 'translateX(calc(-100% + 40px))', // Add spacing between the toggle and dropdown
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '4px',
  padding: '8px 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 10,
};


const menuItemStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
};

menuItemStyle[':hover'] = { backgroundColor: '#444' };

// const postMediaStyle = {
//   width: '100%',
//   // maxHeight: '400px',
//   borderRadius: '8px',
//   marginTop: '10px',
// };

const postMediaStyle = {
  width:'100%',
  height:'auto',
  // maxWidth:'300px',
  maxHeight:'400px',
  marginTop:'10px',
  borderRadius:'8px',
  objectFit:'contain'
};




const postFooterStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '25px',
  marginBottom:'0px'
};

const postButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  color: '#007bff',
};

const commentsSectionStyle = {
  marginTop: '10px',
};

const commentStyle = {
  padding: '5px 0',
  borderTop: '1px solid #e0e0e0',
  fontSize: '14px',
};

const menuStyle = {
  position: 'absolute',
  top: '100%',
  right: '0',
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  zIndex: 1,
};


const userDetailsStyle = {
  display: "flex",
  flexDirection: "column", // Ensures bio appears above the username
  // maxWidth:"100%",
  flex:"1",
  // minWidth:"0",
  overflow:"hidden",
};

const bioStyle = {
  fontSize: "12px", // Smaller font size for the bio
  color: "#555", // Gray color for bio text
  whiteSpace: "nowrap", // Keeps the bio on a single line
  overflow: "hidden", // Hides overflowing text
  textOverflow: "ellipsis", // Adds "..." to indicate truncated text
  maxWidth: "100%",
  marginBottom: "4px",
  marginLeft:"4px" // Spacing between bio and username
};



const RecursiveReplies = ({
  replies,
  toggleCommentLike,
  toggleReplyInput,
  replyingTo,
  handleReplyChange,
  handleAddReply,
  replyTexts,
}) => {
  return replies.map((reply) => (
    <div key={reply.replyId} style={{ marginLeft: "20px", borderLeft: "1px solid #ddd", paddingLeft: "10px" }}>
      <strong>{reply.user?.username || "Anonymous"}:</strong> {reply.text}
      <div>
        <button onClick={() => toggleCommentLike(reply.replyId)}>Like</button>
        <button onClick={() => toggleReplyInput(reply.replyId)}>Reply</button>
      </div>

      {/* Reply input for each reply */}
      {replyingTo[reply.replyId] && (
        <div style={{ marginLeft: "20px" }}>
          <textarea
            placeholder="Write a reply..."
            value={replyTexts[reply.replyId] || ""}
            onChange={(e) => handleReplyChange(reply.replyId, e.target.value)}
            style={{ width: "90%", margin: "5px 0" }}
          />
          <button onClick={() => handleAddReply(reply.replyId)}>Reply</button>
        </div>
      )}

      {/* Recursive rendering of replies */}
      {reply.replies && reply.replies.length > 0 && (
        <RecursiveReplies
          replies={reply.replies}
          toggleCommentLike={toggleCommentLike}
          toggleReplyInput={toggleReplyInput}
          replyingTo={replyingTo}
          handleReplyChange={handleReplyChange}
          handleAddReply={handleAddReply}
          replyTexts={replyTexts}
        />
      )}
    </div>
  ));
};





const PostComponent = () => {
  const fileInputRef= useRef(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState(null);
  const [mediaContent, setMediaContent] = useState(null);
  const [showMenus, setShowMenus] = useState({});
  const [newComment, setNewComment] = useState('');
  const [openComments, setOpenComments] = useState({});
  const [replyingTo, setReplyingTo] = useState({}); // Tracks which comment's reply input is open
  const [replyTexts, setReplyTexts] = useState({}); // Stores reply text for each comment
  const [currentuserId,setcurrentuserId]=useState({});
  const {onlineUsers} =useSocket();
  const [isPosting,setIsPosting]=useState(false);
  const {profileId, setProfileId} =useChatStore();

  const [editingCommentId, setEditingCommentId] = useState(null); // Stores the comment being edited
  const [editText, setEditText] = useState(""); // Stores the updated text
  const [editingReplyId, setEditingReplyId] = useState(null);



  const backendBaseUrl = 'http://localhost:7000';
  const frontendBaseUrl='http://localhost:3000';
  const baseUrl="https://friendsbook.online";
  const renderurl="https://socialmedia-backend-2njs.onrender.com";


  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/posts/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("setting posts!");
      console.log(data);
      setPosts(data);
      setMediaContent(null); //added
      setPostContent(null); //added
     
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchuserId= async ()=>{
    try{
      const token = localStorage.getItem("token");

      // Decode the JWT token to get the userId
      const payload = parseJwt(token);
      if (!payload || !payload.userId) {
          alert("User not authenticated. Please log in again.");
          return;
      }
  
        setcurrentuserId(payload.userId);
      
    }
    catch(e){
      console.log(e);
    }
  }


  useEffect(() => {
    fetchPosts();
    fetchuserId();
    
  }, []);

  

  const handleSubmit = async (e) => {
    // setIsPosting(true);
    e.preventDefault();

    setIsPosting(true); // Ensure state change

    console.log("Posting state:", isPosting); // Debugging

    const token = localStorage.getItem("token");

    if (!token) {
        alert("No token found. Please log in again.");
        return;
    }

    if (!postContent?.trim() && !mediaContent) {
        toast.error("Post cannot be empty!");
        return;
    }

    // Decode userId from token in parallel
    const decodeUserId = new Promise((resolve, reject) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            resolve(JSON.parse(jsonPayload).userId);
        } catch (error) {
            reject(error);
        }
    });

    let mediaUrl = null;

    // Upload media to Cloudinary in parallel (if media exists)
    const uploadMedia = mediaContent
        ? fetch("https://api.cloudinary.com/v1_1/dhtk7vhyv/upload", {
              method: "POST",
              body: (() => {
                  const cloudinaryData = new FormData();
                  cloudinaryData.append("file", mediaContent);
                  cloudinaryData.append("upload_preset", "simpleunsigned");
                  return cloudinaryData;
              })(),
          })
              .then((res) => (res.ok ? res.json() : Promise.reject("Cloudinary upload failed")))
              .then((data) => data.secure_url)
              .catch((error) => {
                  console.error("Media upload error:", error);
                  toast.error("Failed to upload media. Please try again.");
                  throw error;
              })
        : Promise.resolve(null);

    try {
        const [userId, uploadedMediaUrl] = await Promise.all([decodeUserId, uploadMedia]);
        mediaUrl = uploadedMediaUrl;

        // Prepare formData
        const formData = new FormData();
        formData.append("userId", userId);
        if (postContent?.trim()) formData.append("captionOrText", postContent.trim());
        if (mediaUrl) formData.append("mediaContent", mediaUrl);

        // Send to backend
        const response = await fetch(`${renderurl}/posts/create`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend error response:", errorData);
            toast.error("Failed to create Post");
            // return;
        }
        else
        {
          
                  setPostContent(null);
                  setMediaContent(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  toast.success("Post created successfully");
                  await fetchPosts(); // Refresh posts

        }

    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error in creating post. Please try again.");
    }
    finally{
      // setIsPosting(false);
      setIsPosting(false); // Ensure it always resets
    }
};



  


  const handleLikeToggle = async (postId) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    // Decode the token to get userId
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const { userId } = JSON.parse(jsonPayload);
  
    try {
      const response = await fetch(`/posts/like/${userId}/${postId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        const data = await response.json();  // Response includes updated likes count and liked status
  
        // Update the post state with the new like status and count
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.postId === postId) {
              return {
                ...post,
                liked: data.liked,  // Update liked status based on backend response
                likesCount: data.likesCount,  // Update likes count
              };
            }
            return post;
          })
        );
      } else {
        console.log("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      // alert("Error updating like status");
    }
  };
  

  const handleToggleMenu = (postId) => {
    setShowMenus((prevMenus) => ({
      ...prevMenus,
      [postId]: !prevMenus[postId]
    }));
  };


  const reportPost = (postId) => {
    const token = localStorage.getItem("token");

    // Decode the JWT token to get the userId
    const payload = parseJwt(token);
    if (!payload || !payload.userId) {
        alert("User not authenticated. Please log in again.");
        return;
    }

    const userId = payload.userId;

    // Redirect to the report page with query parameters
    navigate(`/report?postId=${postId}&userId=${userId}`);
};

const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(window.atob(base64));
    } catch (error) {
        console.error("Invalid token format");
        return null;
    }
};


function savePost(postId) {

const token = localStorage.getItem("token");

// Decode the JWT token to get the userId
const payload = parseJwt(token);
if (!payload || !payload.userId) {
  toast.error("User not authenticated. Please log in again.",{duration:2500});
  return;
}

const userId = payload.userId;


  const saveData = { userId, postId };

  console.log(saveData);

  fetch(`/posts/save`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(saveData)
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          toast.success("Post saved successfully!",{duration:2500});
      } else {
          toast.error(data.message,{duration:2500});
      }
  })
  .catch(error => {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.",{duration:2500});
  });
}

const copyPostIdToClipboard = (postId) => {
  const postUrl = `/posts/${postId}`; // Adjust URL structure
  navigator.clipboard.writeText(`${baseUrl}${postUrl}`)
    .then(() => toast.success("Post link copied! Share it anywhere."))
    .catch(err => console.error('Failed to copy:', err));
};


//delete
const deletePost = async (postId) => {
  try {
    console.log("delete called");
    const token=localStorage.getItem('token');
    const response = await fetch(`/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Replace with your actual token
      },
    });

    const data = await response.json();
    if (response.ok) {
      toast.success('Post deleted successfully!',{duration:1500});

      // Refresh or update the UI
      fetchPosts();
    } else {
      toast.error(data.message,{duration:2500});
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('Failed to delete post');
  }
};


  


  const handleAddComment = async (postId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }

  try {
    const response = await fetch(`/posts/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newComment }),
    });

    if (response.ok) {
      await fetchPosts();
      setNewComment('');
    } else {
      alert("Failed to add comment");
    }
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};



const handleAddReply = async (replyId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }

  try {
    const response = await fetch(`/posts/comment/reply/${replyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: replyTexts[replyId] || "" }),
    });

    if (response.ok) {
      await fetchPosts(); // Reload posts after reply is added
      clearReplyText(replyId);
      setReplyingTo((prev) => ({ ...prev, [replyId]: false }));
    } else {
      alert("Failed to add reply");
    }
  } catch (error) {
    console.error("Error adding reply:", error);
  }
};

const toggleComments = (postId) => {
  setOpenComments((prev) => ({
    ...prev,
    [postId]: !prev[postId]
  }));
};


const handleReplyChange = (replyId, text) => {
  setReplyTexts((prev) => ({
    ...prev,
    [replyId]: text,
  }));
};




const clearReplyText = (replyId) => {
  setReplyTexts((prev) => ({
    ...prev,
    [replyId]: "",
  }));
};


const toggleReplyInput = (replyId) => {
  setReplyingTo((prev) => ({
    ...prev,
    [replyId]: !prev[replyId],
  }));
};


const goToUserProfile = (userId) => {
  // navigate(`/profile/${userId}`); 
  setProfileId(userId);
  // userId===currentuserId?navigate(`/profile`):navigate(`/other/${userId}`);
};

useEffect(()=>{
  if(profileId!=null){
    if(profileId==currentuserId)
        navigate('/profile');
    else 
        navigate('/other');
  }
},[profileId]);

// const handleMediaChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setMediaContent(file);
//   }
// };

const removePreview = () => {
  setMediaContent(null); // Clear the media content state
  fileInputRef.current.value = ""; // Clear the file input field
};
const handleMediaChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setMediaContent(file); // Save the selected file
  } else {
    setMediaContent(null); // Clear the preview if no file is selected
  }
};



function handleDeleteComment(commentId) {
  console.log("Clicked delete for comment:", commentId);

  // const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
  // if (!confirmDelete) return;

  axios.delete(`/posts/comment/delete/${commentId}`)
    .then(response => {
        console.log("Comment deleted successfully:", response.data);

        // Update UI by removing the deleted comment
        setPosts(prevPosts => 
          prevPosts.map(post => ({
            ...post,
            comments: post.comments.filter(comment => comment.commentId !== commentId)
          }))
        );
    })
    .catch(error => {
        console.error("Error deleting comment:", error.response?.data || error.message);
    });
}

function handleEditComment(commentId, currentText) {
  setEditingCommentId(commentId); // Track which comment is being edited
  setEditText(currentText); // Store the existing comment text in state
}

function handleSaveEdit(commentId) {
  axios.put(`/posts/comment/edit/${commentId}`, { text: editText })
    .then(response => {
      console.log("Comment updated successfully:", response.data);

      // Update UI to show the edited comment text
      setPosts(prevPosts => prevPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment =>
          comment.commentId === commentId ? { ...comment, text: editText } : comment
        )
      })));

      setEditingCommentId(null); // Exit edit mode
    })
    .catch(error => {
      console.error("Error updating comment:", error);
    });
}


function handleEditReply(commentId, replyId, currentText) {
  setEditingReplyId(replyId); // Track which reply is being edited
  setEditText(currentText); // Store the existing reply text in state
}

function handleSaveEditReply(commentId, replyId) {

  console.log("replyId");
  console.log(replyId);


  axios.put(`/posts/reply/edit/${replyId}`, { text: editText })
    .then(response => {
      console.log("Reply updated successfully:", response.data);

      // Update UI to show the edited reply text
      setPosts(prevPosts => prevPosts.map(post => ({
        ...post,
        comments: post.comments.map(comment =>
          comment.commentId === commentId
            ? { 
                ...comment, 
                replies: comment.replies.map(reply =>
                  reply.replyId === replyId ? { ...reply, text: editText } : reply
                ) 
              }
            : comment
        )
      })));

      setEditingReplyId(null); // Exit edit mode
    })
    .catch(error => {
      console.error("Error updating reply:", error);
    });
}





const handleDeleteReply = async (commentId, replyId) => {
  try {
      const response = await axios.delete(`/posts/reply/delete/${replyId}`);

      if (response.status === 200) {
          console.log("Reply deleted successfully");

          setPosts(prevPosts =>
            prevPosts.map(post => ({
                ...post,
                comments: post.comments.map(comment => 
                    comment.commentId === commentId 
                        ? { ...comment, replies: comment.replies.filter(reply => reply.replyId !== replyId) } 
                        : comment
                )
            }))
        );

       
      }
  } catch (error) {
      console.error("Error deleting reply:", error);
      alert("Failed to delete reply.");
  }
};


return (



  <div className="post-component-container" style={postComponentContainerStyle}>
  
  <div style={postInputContainerStyle}>
  <form onSubmit={handleSubmit}>
    <textarea
      placeholder="Share your thoughts...."
      value={postContent || ""}
      onChange={(e) => setPostContent(e.target.value)}
      style={textareaStyle}
    />

    {/* Media Preview */}
    {mediaContent && (
      <div style={{ marginTop: '10px', position: 'relative' }}>
        {mediaContent.type.startsWith('video') ? (
          <video
            src={URL.createObjectURL(mediaContent)}
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '5px',
            }}
          />
        ) : (
          <img
            src={URL.createObjectURL(mediaContent)}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '5px',
              objectFit: 'contain',
            }}
          />
        )}
        <button
          type="button"
          onClick={removePreview}
          style={removeButtonStyle}
        >
          Remove
        </button>
      </div>
    )}

    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button
        type="button"
        onClick={() => fileInputRef.current.click()} // Trigger the hidden file input click
        style={customUploadButtonStyle}
      >
        Upload Media
      </button>
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        onChange={(e) => handleMediaChange(e)}
        style={hiddenFileInputStyle} // Hide the default file input
      />
      <button type="submit" disabled={isPosting} style={submitButtonStyle}>
        {isPosting ? "Posting...." : "Post"}
      </button>
    </div>
  </form>
</div>


    <div  style={{ marginTop: '20px' }}>
      {posts.map((post) => (
        <div key={post.postId} style={userPostStyle}>
          <div style={postHeaderStyle}>
            <div style={userInfoStyle}  onClick={() => goToUserProfile(post.userId._id)}>
              <img
                src={post.user.profilePic === '/images/squarepfp.png' ? '/images/squarepfp.png' : `${post.user.profilePic}`}
                alt="User Profile"
                style={profilePicStyle}
              />
              
              

              <div style={userDetailsStyle}>
              <span style={usernameStyle}>{post.user?.username || "Anonymous"}</span>
              <span style={bioStyle}>{post.userId?.bio || ""}</span>

              </div>


             

            </div>

            <div style={{ position: 'relative' }}>

            <button style={toggleButtonStyle} onClick={() => handleToggleMenu(post.postId)}>⋮</button>
            {showMenus[post.postId] && (
              <div style={dropdownMenuStyle}>
                <div style={menuItemStyle} onClick={() => savePost(post.postId)}>Save</div>
                

                <div style={menuItemStyle} onClick={() => reportPost(post.postId)}>Report</div>
                {/* //delete */}
                {post.userId._id === currentuserId && (
                <div style={menuItemStyle} onClick={() => deletePost(post.postId)}>Delete</div>
                )}
              </div>
            )}
          </div>
          </div>

          <p style={{
      wordWrap: 'break-word',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      overflow: 'hidden', // Hide any text that exceeds the container
      whiteSpace: 'pre-wrap', // Preserve line breaks while wrapping
      maxWidth: '100%', // Ensure the text stays within the container width
      paddingLeft:'20px',
      paddingRight:'20px'
    }}>
      {post.caption}
    </p>

          {post.content && post.content.mediaUrl && (
            post.postType === 'video' ? (
              <video
                src={`${post.content.mediaUrl}`}
                controls
                style={postMediaStyle}
              />
            ) : (
              <img
                src={`${post.content.mediaUrl}`}
                alt="Post Media"
                style={postMediaStyle}
              />
            )
          )}

          <div style={postFooterStyle}>
            <button
              style={postButtonStyle}
              onClick={() => handleLikeToggle(post.postId)}
            >
             <div className="flex items-center justify-center">
    <img src="/images/like.jpg" className="h-6 w-6 mr-2" alt="Like" />
    {post.likesCount}
  </div>
              



            </button>
            <button style={postButtonStyle} onClick={() => toggleComments(post.postId)}>
              {/* {`💬 Comment ${post.comments.length}`} */}
              <div className="flex items-center justify-center"> 
                <img src="/images/comments.jpeg" className="w-6 h-6 mr-4" />
                <p>{`${post.comments.length}`}</p>

              </div>

            </button>
            <button style={postButtonStyle} onClick={() => copyPostIdToClipboard(post.postId)}>
              {/* 🔗 Share */}
              <div className="flex items-center justify-center">
              <img src='/images/share.jpeg' className="w-6 h-6 mr-4" />
              {/* <p>Share</p>  */}
              </div>
               
            </button>
          </div>

         {/* Comment Section */}
{openComments[post.postId] && (
  <div style={{ padding: "10px", border: "1px solid #ccc" }}>
    {post.comments.map((comment) => (
      
     


      <div key={comment.commentId} style={{ margin: "10px 0" }}>
        <strong>{comment.user?.username || "Anonymous"}:</strong> 

        {console.log("comment")}
        {console.log(comment)}

        {/* {comment.text} */}

         {/* Show input field if editing */}
    {editingCommentId === comment.commentId ? (
      <input
        type="text"
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        style={{ border: "2px solid black", padding: "5px", borderRadius: "4px" }} 
      />
    ) : (
      <span>{comment.text}</span>
    )}

        <div>
          {/* <button onClick={() => toggleCommentLike(comment.commentId)}> */}
            {/* Like button content */}
          {/* </button> */}
          <button className="mr-4" onClick={() => toggleReplyInput(comment.commentId)}>Reply</button>
          {/* {comment.user.userId === currentuserId && (
            <>
              <button onClick={() => handleEditComment(comment.commentId)}>Edit</button>
              <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
            </>
          )} */}

      {comment.user.userId === currentuserId && (
        <>
          {editingCommentId === comment.commentId ? (
            <>
              <button className="mr-4" onClick={() => handleSaveEdit(comment.commentId)}>Save</button>
              <button className="mr-4" onClick={() => setEditingCommentId(null)}>Cancel</button>
            </>
          ) : (
            <button className="mr-4" onClick={() => handleEditComment(comment.commentId, comment.text)}>Edit</button>
          )}
          <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
        </>
      )}


        </div>

        {/* Display replies */}
        <div style={{ marginLeft: "20px" }}>
        {comment.replies.map((reply) => (
    <div key={reply.replyId} className="mb-1">
      <strong>{reply.user?.username || "Anonymous"}:</strong> 

      {/* If editing this reply, show input field */}
      {editingReplyId === reply.replyId ? (
        <>
          <input 
            type="text" 
            placeholder="Enter the new reply!"
            value={editText} 
            onChange={(e) => setEditText(e.target.value)} 
            style={{ border: "2px solid black", padding: "5px", borderRadius: "4px" }} 
          />
          <button className="mr-4" onClick={() => handleSaveEditReply(comment.commentId, reply.replyId)}>Save</button>
          <button onClick={() => setEditingReplyId(null)}>Cancel</button>
        </>
      ) : (
        <>
          {reply.text}
          {reply.user.userId === currentuserId && (
            <div>
              <button className="mr-4" onClick={() => handleEditReply(comment.commentId, reply.replyId,reply.text)}>Edit</button>
              <button onClick={() => handleDeleteReply(comment.commentId, reply.replyId)}>Delete</button>
            </div>
          )}
        </>
      )}
    </div>
  ))}
        </div>

        {/* Reply input for each comment */}
        {replyingTo[comment.commentId] && (
          <div style={{ marginLeft: "20px" }}>
            <textarea
              placeholder="  Write a reply..."
              value={replyTexts[comment.commentId] || ""}
              onChange={(e) => handleReplyChange(comment.commentId, e.target.value)}
              style={{ width: "100%", margin: "5px 0", border: "2px solid black" }}
            />
            <div class="flex justify-end">
              <button onClick={() => handleAddReply(comment.commentId)}>Reply</button>
            </div>
          </div>
        )}
      </div>
    ))}

    {/* New comment input */}
    <textarea
      class="border-2 border-black"
      placeholder="  Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      style={{ width: "100%", margin: "5px 0" }}
    />
    <div class="flex justify-end">
      <button class="text-right pl-2 pr-2" onClick={() => handleAddComment(post.postId)}>Comment</button>
    </div>
  </div>
)}

        </div>
      ))}
    </div>
  </div>
  
);


}
   
export default PostComponent;