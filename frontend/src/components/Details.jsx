import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserDetails() {
    const [userData, setUserData] = useState(null);
    const [sectionData, setSectionData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [likedData,setLikedData]=useState([]);
    const [activeSection, setActiveSection] = useState('posts');
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    const backendBaseUrl = 'http://localhost:7000';

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            setEditableData({
                username: userData.username,
                fullname: userData.fullname,
                relationshipStatus: userData.relationshipStatus,
                bio: userData.bio,
                profilePic: userData.profilePic,
            });
        }
    }, [userData]);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You are not logged in. Please log in to view your profile.');
                window.location.href = 'index.html';
                return;
            }

            const response = await fetch(`${backendBaseUrl}/profile/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("data");
            console.log(data);
            // console.log(userData._id);
            setUserData(data);
           
            
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setError('Error fetching user data. Please try again later.');
        }
    };

    useEffect(() => {
        if (userData) {
            console.log("User ID:", userData._id); // Access userData._id here after it’s updated
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setEditableData((prevData) => ({ ...prevData, profilePic: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveChanges = async () => {
        const formData = new FormData();
        formData.append('username', editableData.username);
        formData.append('fullname', editableData.fullname);
        formData.append('relationshipStatus', editableData.relationshipStatus);
        formData.append('bio', editableData.bio);
        if (editableData.profilePic instanceof File) {
            formData.append('profilePic', editableData.profilePic);
        }

        try {
            
            const response = await axios.patch(`${backendBaseUrl}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setUserData(response.data.updatedUser);
            toggleEditMode();
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Failed to update profile. Please try again later.');
        }
    };

    const fetchUserPosts = async () => {
        try {
            const userId = userData._id;
            console.log(userId);
    
            if (userData) {
                const response = await axios.get(`${backendBaseUrl}/profile/userPosts/${userId}`);
                
    
                console.log(response);
                
                setSectionData(response.data.posts || []);
            } else {
                console.log("No user data!");
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setSectionData([]);
        }
    };
    
    // Log sectionData when it updates
    useEffect(() => {
        console.log("Updated sectionData:", sectionData);
    }, [sectionData]);



    const fetchUserLiked = async () => {
        try {
            const userId=userData._id;
            console.log(userId);

            const response = await axios.get(`${backendBaseUrl}/profile/likedPosts/${userId}`);
            console.log(response);
            setLikedData(response.data);
        } catch (error) {
            console.error('Error fetching liked posts:', error);
            setLikedData([]);
        }
    };

    useEffect(() => {
        console.log("Updated likedData:", likedData);
    }, [likedData]);


    const fetchUserSaved = async () => {
        try {
            console.log("entered fetch User Saved");
            const userId = userData._id;
            console.log(userId);
    
            if (userData) {
                const response = await axios.get(`${backendBaseUrl}/profile/savedPosts/${userId}`);
                
                console.log("response");
                console.log(response);
                console.log("setting savedData");
                
                setSavedData(response.data || []);
                
            } else {
                console.log("No user data!");
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
            setSavedData([]);
        }
    };
    
    useEffect(() => {
        console.log("Updated saved Data:");
        console.log(savedData);
        

    }, [savedData]);
    
    

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === 'posts') fetchUserPosts();
        else if (section === 'liked') fetchUserLiked();
        else if (section === 'saved') fetchUserSaved();
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.profileCard}>
                <div style={styles.profilePicContainer}>
                    {isEditing ? (
                        <div>
                            <label htmlFor="profilePicUpload">
                                <img
                                    src={previewImage || editableData.profilePic || '/images/default_profile.jpeg'}
                                    alt="Profile Pic"
                                    style={styles.profilePic}
                                />
                            </label>
                            <input
                                type="file"
                                id="profilePicUpload"
                                name="profilePic"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                        </div>
                    ) : (
                        <img
                            src={userData.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${userData.profilePic}`}
                            alt="Profile Pic"
                            style={styles.profilePic}
                        />
                    )}
                </div>
                
                <div style={styles.profileInfo}>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="username"
                                value={editableData.username}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Username"
                            />
                            <input
                                type="text"
                                name="fullname"
                                value={editableData.fullname}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="Full Name"
                            />
                            <select
                                id="edit-relationship-status"
                                name="relationshipStatus"
                                value={editableData.relationshipStatus}
                                onChange={handleInputChange}
                                style={styles.input}
                            >
                                <option value="single">Single</option>
                                <option value="in a relationship">In a Relationship</option>
                                <option value="married">Married</option>
                                <option value="complicated">Complicated</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea
                                name="bio"
                                value={editableData.bio}
                                onChange={handleInputChange}
                                style={styles.textarea}
                                placeholder="Bio"
                            />
                            <button style={styles.saveButton} onClick={saveChanges}>Save Changes</button>
                            <button style={styles.cancelButton} onClick={toggleEditMode}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <h2 style={styles.username}>{userData.username || "User's Name"}</h2>
                            <p style={styles.fullname}>{userData.fullname || 'Full Name'}</p>
                            <div style={styles.statsContainer}>
                                <p style={styles.stat}>{`${userData.postsCount || 0} Posts`}</p>
                                <p style={styles.stat}>{`${(userData.followers && userData.followers.length) || 0} Followers`}</p>
                                <p style={styles.stat}>{`${(userData.following && userData.following.length) || 0} Following`}</p>
                            </div>
                            <p style={styles.additionalInfo}>Relationship Status: {userData.relationshipStatus || 'Single'}</p>
                            <p style={styles.additionalInfo}>Bio: {userData.bio || 'User bio goes here...'}</p>
                            <p style={styles.additionalInfo}>Streak: {userData.streak?.count || 0}</p>
                            <button style={styles.editButton} onClick={toggleEditMode}>Edit Profile</button>
                        </>
                    )}
                </div>
            </div>

            <div style={styles.buttonContainer}>
                <button style={activeSection === 'posts' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange('posts')}>Posts</button>
                <button style={activeSection === 'saved' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange('saved')}>Saved</button>
                <button style={activeSection === 'liked' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange('liked')}>Liked</button>
            </div>
            <div style={styles.sectionContent}>
                {/* {sectionData.map((item, index) => (
                    <div key={index} style={styles.post}>{item.caption}</div>
                ))} */}
                 {activeSection==="posts" && sectionData.map((post, index) => (
                <div key={post._id} style={styles.post}>
                    {/* Profile picture and username */}
                    <div style={styles.header}>
                        <img
                            src={`${backendBaseUrl}${userData.profilePic}`} // Add profile picture URL here
                            alt="Profile"
                            style={styles.profilePic}
                        />
                        <strong>{post.user.username}</strong>
                    </div>

                    {/* Post caption */}
                    {post.caption && <p style={styles.caption}>{post.caption}</p>}

                    {/* Image or video media */}
                    {console.log(post.content.mediaUrl)};
                    {post.content.mediaUrl && post.postType === 'image' && (
                        <img
                            src={`${backendBaseUrl}/${post.content.mediaUrl}`}
                            alt="Post content"
                            style={styles.media}
                        />
                    )}
                    {post.content.mediaUrl && post.postType === 'video' && (
                        <video controls style={styles.media}>
                            <source type="video/mp4" src={`${backendBaseUrl}/${post.content.mediaUrl}`}  />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {/* Likes count */}
                    <p>{post.likes.length} Likes</p>

                    {/* Comments */}
                    <div className="comments">
                        {post.comments.map((comment, index) => (
                            <p key={index}>
                                <strong>{comment.username}:</strong> {comment.text}
                            </p>
                        ))}
                    </div>
                </div>
            ))}

            {/* //saved */}
            {activeSection==="saved" && savedData.map((post, index) => (
                <div key={post._id} style={styles.post}>
                    {/* Profile picture and username */}
                    <div style={styles.header}>
                        <img
                            src={`${backendBaseUrl}${userData.profilePic}`} // Add profile picture URL here
                            alt="Profile"
                            style={styles.profilePic}
                        />
                        <strong>{post.postId.user.username}</strong>
                    </div>

                    {/* Post caption */}
                    {post.postId.caption && <p style={styles.caption}>{post.postId.caption}</p>}

                    {/* Image or video media */}
                    {console.log(post.postId.content.mediaUrl)};
                    {post.postId.content.mediaUrl && post.postId.postType === 'image' && (
                        <img
                            src={`${backendBaseUrl}/${post.postId.content.mediaUrl}`}
                            alt="Post content"
                            style={styles.media}
                        />
                    )}
                    {post.postId.content.mediaUrl && post.postId.postType === 'video' && (
                        <video controls style={styles.media}>
                            <source type="video/mp4" src={`${backendBaseUrl}/${post.postId.content.mediaUrl}`}  />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {/* Likes count */}
                    <p>{post.postId.likes.length} Likes</p>

                    {/* Comments */}
                    <div className="comments">
                        {post.postId.comments.map((comment, index) => (
                            <p key={index}>
                                <strong>{comment.username}:</strong> {comment.text}
                            </p>
                        ))}
                    </div>
                </div>
            ))}

            {/* liked */}
            {activeSection==="liked" && likedData.map((post, index) => (
                <div key={post._id} style={styles.post}>
                    {/* Profile picture and username */}
                    <div style={styles.header}>
                        <img
                            src={`${backendBaseUrl}${userData.profilePic}`} // Add profile picture URL here
                            alt="Profile"
                            style={styles.profilePic}
                        />
                        <strong>{post.user.username}</strong>
                    </div>

                    {/* Post caption */}
                    {post.caption && <p style={styles.caption}>{post.caption}</p>}

                    {/* Image or video media */}
                    {console.log(post.content.mediaUrl)};
                    {post.content.mediaUrl && post.postType === 'image' && (
                        <img
                            src={`${backendBaseUrl}/${post.content.mediaUrl}`}
                            alt="Post content"
                            style={styles.media}
                        />
                    )}
                    {post.content.mediaUrl && post.postType === 'video' && (
                        <video controls style={styles.media}>
                            <source type="video/mp4" src={`${backendBaseUrl}/${post.content.mediaUrl}`}  />
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {/* Likes count */}
                    <p>{post.likes.length} Likes</p>

                    {/* Comments */}
                    <div className="comments">
                        {post.comments.map((comment, index) => (
                            <p key={index}>
                                <strong>{comment.username}:</strong> {comment.text}
                            </p>
                        ))}
                    </div>
                </div>
            ))}






            </div>
        </div>
    );
}


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    profileCard: {
        display: 'flex',
        flexDirection: 'row',
        width: '700px', // Wider profile card
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        padding: '25px',
    },
    profilePicContainer: {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px', // Padding around profile picture
    },
    profilePic: {
        width: '90%',  // Narrower width for taller aspect ratio
        height: '90%', // Taller height for profile picture
        borderRadius: '8px',
        objectFit: 'cover',
        backgroundColor: '#f0f0f0'
    },
    profileInfo: {
        flex: '2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingLeft: '15px', // More padding for professional look
        textAlign: 'left',
        lineHeight: '1.8', // Increased line height for better spacing
    },
    username: {
        fontSize: '2em', // Increased font size
        fontWeight: 'bold',
    },
    fullname: {
        fontSize: '1.4em', // Larger font size for full name
        color: '#666',
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
    },
    stat: {
        fontSize: '1.1em', // Increased font size for stats
        fontWeight: 'bold',
    },
    additionalInfo: {
        fontSize: '1.1em', // Larger font size for bio and status
        color: '#555',
    },
    editButton: {
        marginTop: '15px',
        padding: '12px 24px', // Larger button size
        backgroundColor: '#6C63FF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em', // Increased font size for button
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '20px',
    },
    activeButton: {
        padding: '12px 25px',
        backgroundColor: 'green',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    inactiveButton: {
        padding: '12px 25px',
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    sectionContent: {
        width: '700px', // Matches profile card width
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
    },
    post: {
        marginBottom: '15px',
        padding: '12px',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '1em',
    },
    input: {
        marginBottom: '10px',
        padding: '10px',
        width: '100%',
        fontSize: '1em',
    },
    textarea: {
        marginBottom: '10px',
        padding: '10px',
        width: '100%',
        height: '80px',
        fontSize: '1em',
    },
    saveButton: {
        marginTop: '10px',
        padding: '12px 24px',
        backgroundColor: 'green',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
    cancelButton: {
        marginTop: '10px',
        padding: '12px 24px',
        backgroundColor: '#ccc',
        color: '#333',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
    },
};



export default UserDetails;
