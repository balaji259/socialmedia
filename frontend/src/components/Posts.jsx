import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const PostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [mediaContent, setMediaContent] = useState(null);
  
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

  useEffect(() => {
    fetchPosts();
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
        toast.error("Failed to create post", { duration: 2000 });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form", { duration: 2000 });
    }
  };

  // Like/Dislike functionality
  const handleLikeToggle = async (postId) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }
  
    // Decode user ID from token (assuming JWT format)
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
  
        // Update the posts state to reflect the new like status and count immediately
        setPosts((prevPosts) =>
          prevPosts.map((post) => {
            if (post.postId === postId) {
              // Toggle 'liked' status and update 'likesCount'
              const isLiked = !post.liked;
              const updatedLikesCount = isLiked ? post.likesCount + 1 : post.likesCount - 1;
              
              return { ...post, liked: isLiked, likesCount: updatedLikesCount };
            }
            return post;
          })
        );
      } else {
        toast.error("Failed to update like status", { duration: 2000 });
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      toast.error("Error updating like status", { duration: 2000 });
    }
  };
  
  return (
    <div style={postComponentContainerStyle}>
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
        </form>
      </div>
  
      <div style={{ marginTop: '20px' }}>
        {posts.map((post, index) => (
          <div key={index} style={userPostStyle}>
            <div style={postHeaderStyle}>
              <img
                src={post.user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${post.user.profilePic}`}
                alt="User Profile"
                style={profilePicStyle}
              />
              <span style={usernameStyle}>{post.user?.username || "Anonymous"}</span>
              <button style={toggleButtonStyle}>⋮</button>
            </div>

            <p>{post.caption}</p>
  
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
                onClick={() => handleLikeToggle(post.postId)} // Fix: Access correct property for post ID
              >
                {post.liked ? '👎 Dislike' : '👍 Like'} {post.likesCount}
              </button>
              <button style={postButtonStyle}>💬 comments</button>
              <button style={postButtonStyle}>🔗 Share</button>
            </div>
  
            <div style={commentsSectionStyle}>
              {post.comments.map((comment, idx) => (
                <div key={idx} style={commentStyle}>
                  <strong>{comment.username}:</strong> {comment.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// ... (CSS styles remain the same)
const postComponentContainerStyle = {
  marginTop: '15px',
  padding: '20px',
  backgroundColor: 'transparent',
  maxHeight: '80vh',
  overflowY: 'scroll',
};

const postInputContainerStyle = {
  backgroundColor: '#fff',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
};

const textareaStyle = {
  width: '100%',
  height: '80px',
  padding: '10px',
  borderRadius: '5px',
  borderColor: '#ddd',
  resize: 'none',
};

const submitButtonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  padding: '8px 15px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '10px',
};

const userPostStyle = {
  backgroundColor: '#ffffff',
  padding: '15px',
  marginBottom: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  border:'2px solid black'
};

const postHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
};

const profilePicStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px',
};

const usernameStyle = {
  fontWeight: 'bold',
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

const postMediaStyle = {
  width: '100%',
  maxHeight: '400px',
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

export default PostComponent;
