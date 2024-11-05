import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SinglePost.css'; // Import CSS for styling
import { useParams } from 'react-router-dom';

const SinglePost = ({ match }) => {
  const [post, setPost] = useState(null);
  const {postId} = useParams(); // Retrieve postId from URL params
    console.log(postId);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="single-post-container">
      <div className="post-header">
        <img src={post.user.profilePic} alt={post.user.username} className="profile-pic" />
        <div className="post-user-info">
          <span className="username">{post.user.username}</span>
          <span className="created-at">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div className="post-content">
        {post.postType === "image" && (
          <img src={post.content.mediaUrl} alt="Post media" className="post-media" />
        )}
        <p className="caption">{post.caption}</p>
      </div>
      <div className="post-actions">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>🔗 Share</button>
      </div>
    </div>
  );
};

export default SinglePost;
