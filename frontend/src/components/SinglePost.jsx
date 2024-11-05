import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const backendBaseUrl = 'http://localhost:7000';

const SinglePost = () => {
  const [post, setPost] = useState(null);
  const [showMenus, setShowMenus] = useState({});
  const { postId } = useParams(); // Retrieve postId from URL params

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleToggleMenu = (id) => {
    setShowMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const savePost = (id) => {
    // Implement save post logic
    console.log(`Post ${id} saved`);
  };

  const reportPost = (id) => {
    // Implement report post logic
    console.log(`Post ${id} reported`);
  };

  const handleLikeToggle = (id) => {
    // Implement like toggle logic
    console.log(`Toggled like for post ${id}`);
  };

  const copyPostIdToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    toast.success(`Post ID ${id} copied to clipboard`);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div style={singlePostContainerStyle}>
      <div style={postHeaderStyle}>
        <img
          src={post.user.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${post.user.profilePic}`}
          alt={post.user.username}
          style={profilePicStyle}
        />
        <div style={postUserInfoStyle}>
          <span style={usernameStyle}>{post.user.username}</span>
          <span style={createdAtStyle}>{new Date(post.createdAt).toLocaleString()}</span>
        </div>
        <button style={toggleButtonStyle} onClick={() => handleToggleMenu(post.postId)}>⋮</button>

        {showMenus[post.postId] && (
          <div style={dropdownMenuStyle}>
            <div style={menuItemStyle} onClick={() => savePost(post.postId)}>Save Post</div>
            <div style={menuItemStyle} onClick={() => reportPost(post.postId)}>Report</div>
          </div>
        )}
      </div>

      <div style={postContentStyle}>
        {post.postType === "image" && post.content.mediaUrl && (
          <img src={`${backendBaseUrl}/${post.content.mediaUrl}`} alt="Post media" style={postMediaStyle} />
        )}
        <p style={captionStyle}>{post.caption}</p>
      </div>

      <div style={postActionsStyle}>
        <button style={postButtonStyle} onClick={() => handleLikeToggle(post.postId)}>
          {post.liked ? '👎 Dislike' : '👍 Like'} {post.likesCount}
        </button>
        <button style={postButtonStyle}>💬 Comment</button>
        <button style={postButtonStyle} onClick={() => copyPostIdToClipboard(post.postId)}>
          🔗 Share
        </button>
      </div>

      <div style={commentsSectionStyle}>
        {post.comments.map((comment, i) => (
          <div key={i} style={commentStyle}>
            <strong>{comment.user?.username || "Anonymous"}:</strong> {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
};

const singlePostContainerStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '15px',
  margin: '20px auto',
  maxWidth: '600px',
};

const postHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
  position: 'relative',
};

const profilePicStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  marginRight: '10px',
};

const postUserInfoStyle = {
  flexGrow: 1,
};

const usernameStyle = {
  fontWeight: 'bold',
};

const createdAtStyle = {
  fontSize: '0.9em',
  color: '#777',
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
};

const dropdownMenuStyle = {
  position: 'absolute',
  background: '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  zIndex: 1,
};

const menuItemStyle = {
  padding: '10px',
  cursor: 'pointer',
};

const postContentStyle = {
  marginBottom: '15px',
};

const postMediaStyle = {
  width: '100%',
  borderRadius: '5px',
};

const captionStyle = {
  margin: '10px 0',
};

const postActionsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const postButtonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  padding: '10px 15px',
  cursor: 'pointer',
};

const commentsSectionStyle = {
  marginTop: '10px',
  borderTop: '1px solid #ddd',
  paddingTop: '10px',
};

const commentStyle = {
  marginBottom: '5px',
};

export default SinglePost;
