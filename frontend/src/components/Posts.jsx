import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './scroll.css';


// Define all styles at the top
const postComponentContainerStyle = {
  marginTop: '15px',
  padding: '20px',
  backgroundColor: '#d5d5d5',
  maxHeight: '80vh',
  overflowY: 'scroll',
};



const postInputContainerStyle = {
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  border:'2px solid black'
};

const textareaStyle = {
  width: '100%',
  height: '80px',
  padding: '10px',
  borderRadius: '5px',
  border:'1px solid grey',
  borderColor: '#ddd',
  resize: 'none',
};

const submitButtonStyle = {
  backgroundColor: '#007bff',
  // backgroundColor:'#e5e5e5e',
  color: '#fff',
  padding: '8px 15px',
  border: 'none',
  borderRadius:'5px',
  cursor: 'pointer',
  marginTop: '10px',
};

const userPostStyle = {
  backgroundColor: '#ffffff',
  padding: '15px',
  marginBottom: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  // border: '2px solid black'
};

const postHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
  position: 'relative'
};

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
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
  marginLeft:'4px'
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
};

const dropdownMenuStyle = {
  position: 'absolute',
  right: '20px',
  top: '20px', // Position the dropdown below the three dots
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '4px',
  padding: '8px 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  zIndex: 1
};

const menuItemStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
};

menuItemStyle[':hover'] = { backgroundColor: '#444' };

const postMediaStyle = {
  width: '100%',
  // maxHeight: '400px',
  borderRadius: '8px',
  marginTop: '10px',
};

const postFooterStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  marginTop: '15px',
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
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [mediaContent, setMediaContent] = useState(null);
  const [showMenus, setShowMenus] = useState({});
  const [newComment, setNewComment] = useState('');
  const [openComments, setOpenComments] = useState({});
  const [replyingTo, setReplyingTo] = useState({}); // Tracks which comment's reply input is open
  const [replyTexts, setReplyTexts] = useState({}); // Stores reply text for each comment
  const [currentuserId,setcurrentuserId]=useState({});

  const backendBaseUrl = 'http://localhost:7000';

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${backendBaseUrl}/posts/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPosts(data);
      console.log(data);
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
        console.log("currentuserId");
        console.log(currentuserId);
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
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("captionOrText", postContent);
    if (mediaContent) {
      formData.append("mediaContent", mediaContent);
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const { userId } = JSON.parse(jsonPayload);

      formData.append("userId", userId);

      const response = await fetch(`${backendBaseUrl}/posts/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPostContent("");
        setMediaContent(null);
        await fetchPosts(); // Refresh posts
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  const handleLikeToggle = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

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
      const response = await fetch(`${backendBaseUrl}/posts/like/${userId}/${postId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.postId === postId) {
              const isLiked = !post.liked;
              const updatedLikesCount = isLiked ? post.likesCount + 1 : post.likesCount - 1;
              
              return { ...post, liked: isLiked, likesCount: updatedLikesCount };
            }
            return post;
          })
        );
      } else {
        alert("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      alert("Error updating like status");
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

  fetch(`${backendBaseUrl}/posts/save`, {
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
          toast.error("Failed to save post. " + data.message,{duration:2500});
      }
  })
  .catch(error => {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.",{duration:2500});
  });
}

const copyPostIdToClipboard = (postId) => {
  const postUrl = `http://localhost:5174/posts/${postId}`; // Adjust URL structure
  navigator.clipboard.writeText(postUrl)
    .then(() => alert("Post link copied to clipboard! Share it anywhere."))
    .catch(err => console.error('Failed to copy:', err));
};


//delete
const deletePost = async (postId) => {
  try {
    console.log("delete called");
    const token=localStorage.getItem('token');
    const response = await fetch(`${backendBaseUrl}/posts/${postId}`, {
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
    const response = await fetch(`${backendBaseUrl}/posts/comment/${postId}`, {
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
    const response = await fetch(`${backendBaseUrl}/posts/comment/reply/${replyId}`, {
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

// const handleReplyChange = (commentId, text) => {
//   setReplyTexts((prevReplies) => ({
//     ...prevReplies,
//     [commentId]: text,
//   }));
// };

const handleReplyChange = (replyId, text) => {
  setReplyTexts((prev) => ({
    ...prev,
    [replyId]: text,
  }));
};


// const clearReplyText = (commentId) => {
//   setReplyTexts((prevReplies) => ({
//     ...prevReplies,
//     [commentId]: "",
//   }));
// };

const clearReplyText = (replyId) => {
  setReplyTexts((prev) => ({
    ...prev,
    [replyId]: "",
  }));
};


// const toggleReplyInput = (commentId) => {
//   setReplyingTo((prev) => ({
//     ...prev,
//     [commentId]: !prev[commentId],
//   }));
// };

const toggleReplyInput = (replyId) => {
  setReplyingTo((prev) => ({
    ...prev,
    [replyId]: !prev[replyId],
  }));
};


return (


  <div className="post-component-container" style={postComponentContainerStyle}>
    <div style={postInputContainerStyle}>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What are you thinking?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          style={textareaStyle}
        />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMediaContent(e.target.files[0])}
          style={{ marginTop: '10px' }}
        />

        <button type="submit" style={submitButtonStyle}>Post</button>
        {/* <button type="submit" style={submitButtonStyle} >
            <div className="flex items-center justify-center">
            <img src="/images/send.jpeg" className=" w-6 h-6 mr-4" />
            <span>Post</span>
            </div>
            
        </button> */}
      </form>
    </div>

    <div   style={{ marginTop: '20px' }}>
      {posts.map((post) => (
        <div key={post.postId} style={userPostStyle}>
          <div style={postHeaderStyle}>
            <div style={userInfoStyle}>
              <img
                src={post.user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${post.user.profilePic}`}
                alt="User Profile"
                style={profilePicStyle}
              />
              <span style={usernameStyle}>{post.user?.username || "Anonymous"}</span>
            </div>
            <button style={toggleButtonStyle} onClick={() => handleToggleMenu(post.postId)}>⋮</button>
            {showMenus[post.postId] && (
              <div style={dropdownMenuStyle}>
                <div style={menuItemStyle} onClick={() => savePost(post.postId)}>Save Post</div>
                

                <div style={menuItemStyle} onClick={() => reportPost(post.postId)}>Report</div>
                {/* //delete */}
                {post.userId._id === currentuserId && (
                <div style={menuItemStyle} onClick={() => deletePost(post.postId)}>Delete</div>
                )}
              </div>
            )}
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
                src={`${backendBaseUrl}/${post.content.mediaUrl}`}
                controls
                style={postMediaStyle}
              />
            ) : (
              <img
                src={`${backendBaseUrl}/${post.content.mediaUrl}`}
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
              {/* {post.liked ? '👎' : '👍'} {post.likesCount} */}
              {post.liked ? (
  <div className="flex items-center justify-center">
    <img src="/images/like.jpg" className="h-6 w-6 mr-2" alt="Like" /> 
    {post.likesCount}
  </div>
) : (
  <div className="flex items-center justify-center">
    <img src="/images/like.jpg" className="h-6 w-6 mr-2" alt="Like" />
    {post.likesCount}
  </div>
)}


            </button>
            <button style={postButtonStyle} onClick={() => toggleComments(post.postId)}>
              {/* {`💬 Comment ${post.comments.length}`} */}
              <div className="flex items-center justify-center"> 
                <img src="/images/comments.jpeg" className="w-6 h-6 mr-4" />
                <p>{`Comments ${post.comments.length}`}</p>

              </div>

            </button>
            <button style={postButtonStyle} onClick={() => copyPostIdToClipboard(post.postId)}>
              {/* 🔗 Share */}
              <div className="flex items-center justify-center">
              <img src='/images/share.jpeg' className="w-6 h-6 mr-4" />
              <p>Share</p> 
              </div>
               
            </button>
          </div>

          {/* Comment Section */}
          {openComments[post.postId] && (
            <div style={{ padding: "10px", border: "1px solid #ccc" }}>
              {post.comments.map((comment) => (
                <div key={comment.commentId} style={{ margin: "10px 0" }}>
                  <strong>{comment.user?.username || "Anonymous"}:</strong> {comment.text}

                  <div>
                    <button onClick={() => toggleCommentLike(comment.commentId)}>
                      {/* Like button content */}
                    </button>
                    <button onClick={() => toggleReplyInput(comment.commentId)}>Reply</button>
                  </div>

                  {/* Display replies */}
                  <div style={{ marginLeft: "20px" }}>
                    {comment.replies.map((reply) => (
                      <div key={reply.replyId} >
                        {console.log("reply")}
                        {console.log(reply)}
                        <strong>{reply.user?.username || "Anonymous"}:</strong> {reply.text}
                        <div>
                          <button onClick={() => toggleCommentLike(reply.replyId)}>
                            {/* Like button content */}
                          </button>
                          {/* <button onClick={() => toggleReplyInput(reply.replyId)}>Reply</button> */}
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
                      </div>
                    ))}
                  </div>

                  {/* Reply input for each comment */}

                  {replyingTo[comment.commentId] && (
                    <div style={{ marginLeft: "20px" }}>
                      <textarea
                        placeholder="Write a reply..."
                        value={replyTexts[comment.commentId] || ""}
                        onChange={(e) => handleReplyChange(comment.commentId, e.target.value)}
                        style={{ width: "90%", margin: "5px 0" }}
                      />
                      <button onClick={() => handleAddReply(comment.commentId)}>Reply</button>
                    </div>
                  )}
                </div>
              ))}

              {/* New comment input */}
              <textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ width: "100%", margin: "5px 0" }}
              />
              <button onClick={() => handleAddComment(post.postId)}>Comment</button>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
  
);


}
   
export default PostComponent;