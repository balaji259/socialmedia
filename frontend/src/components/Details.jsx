import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserDetails() {
    const [userData, setUserData] = useState(null);
    const [sectionData, setSectionData] = useState([]);
    const [savedData, setSavedData] = useState([]);
    const [likedData,setLikedData]=useState([]);
    const [activeSection, setActiveSection] = useState('posts');
    const [error, setError] = useState(null);
    const [friendSuggestions, setFriendSuggestions] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    const [suggestions, setSuggestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
                dateOfBirth: userData.dateOfBirth || '', // New fields
                collegeName: userData.collegeName || '',
                bestFriend: userData.bestFriend || '',
                interests: userData.interests || '',
                favoriteSports: userData.favoriteSports || '',
                favoriteGame: userData.favoriteGame || '',
                favoriteMusic: userData.favoriteMusic || '',
                favoriteMovie: userData.favoriteMovie || '',
                favoriteAnime: userData.favoriteAnime || '',
                favoriteActor: userData.favoriteActor || '',
            });
        }
    }, [userData]);

    const handleDeletePost = async (postId) => {
        try {
            console.log("handledeletepost fucntion");
          const response = await fetch(`${backendBaseUrl}/profile/deleteSavedPost/${postId}`, {
            method: "DELETE",
          });
          if (response.ok) {
            // Update the saved posts list
            setSavedData((prevData) => prevData.filter((post) => post._id !== postId));

            alert("Post deleted successfully!");
          } else {
            alert("Failed to delete the post. Please try again.");
          }
        } catch (error) {
          console.error("Error deleting post:", error);
          alert("An error occurred. Please try again.");
        }
      };
      

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



    const fetchSuggestions = async (query) => {
        if (query.length >= 2) {
            try {
                const response = await fetch(`${backendBaseUrl}/profile/bestfriend/search?username=${query}`);
                const data = await response.json();
                setSuggestions(data.length ? data : []); // Clear suggestions if no data
            } catch (error) {
                console.error('Error fetching user suggestions:', error);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleBestFriendChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchSuggestions(value);
        handleInputChange(e); // Update the form data with the new value
    };

    const handleSuggestionClick = (user) => {
        setEditableData((prevData) => ({
            ...prevData,
            bestFriend: user._id // Correctly updating the state
        }));
        setSearchQuery(user.username); // Show the selected username
        setSuggestions([]); // Hide suggestions
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
       
        // Object.keys(editableData).forEach((key) => {
        //     // Skip appending 'bestFriend' if it's an empty string
        //     if (key === 'bestFriend' && editableData[key] === '') {
        //         formData.append(key, null); // Set it as null
        //     } else {
        //         formData.append(key, editableData[key]);
        //     }
        // });
        formData.append('username', editableData.username);
        formData.append('fullname', editableData.fullname);
        formData.append('relationshipStatus', editableData.relationshipStatus);
        formData.append('bio', editableData.bio);
        formData.append('dateOfBirth', editableData.dateOfBirth);
        formData.append('collegeName', editableData.collegeName);
        formData.append('bestFriend', editableData.bestFriend); // ID of selected friend
        formData.append('interests', editableData.interests);
        formData.append('favoriteSports', editableData.favoriteSports);
        formData.append('favoriteGame', editableData.favoriteGame);
        formData.append('favoriteMusic', editableData.favoriteMusic);
        formData.append('favoriteMovie', editableData.favoriteMovie);
        formData.append('favoriteAnime', editableData.favoriteAnime);
        formData.append('favoriteActor', editableData.favoriteActor);

        if (editableData.profilePic instanceof File) {
            formData.append('profilePic', editableData.profilePic);
        }

        console.log("formData");
        console.log(formData);

        try {
            console.log(formData);
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
                            <input type="text" name="username" value={editableData.username} onChange={handleInputChange} style={styles.input} placeholder="Username" />
                            <input type="text" name="fullname" value={editableData.fullname} onChange={handleInputChange} style={styles.input} placeholder="Full Name" />
                            <input type="date" name="dateOfBirth" value={editableData.dateOfBirth} onChange={handleInputChange} style={styles.input} placeholder="Date of Birth" />
                            <input type="text" name="collegeName" value={editableData.collegeName} onChange={handleInputChange} style={styles.input} placeholder="College Name" />
                            {/* <input type="text" name="bestFriend" value={editableData.bestFriend} onChange={handleInputChange} style={styles.input} placeholder="Best Friend" /> */}
                            <div style={styles.inputContainer}>
                                    <input
                                        
                                        type="text"
                                        name="bestFriend"
                                        value={searchQuery}
                                        onChange={handleBestFriendChange}
                                        style={styles.input}
                                        placeholder="Type username of your best friend"
                                    />
                                    {suggestions.length > 0 && (
                                        <ul>
                                        {suggestions.map((user) => (
                                            <li key={user._id} onClick={() => handleSuggestionClick(user)} style={{
                                                ...styles.suggestionItem,
                                                ':hover': styles.suggestionItemHover,
                                            }} >
                                            {user.username}
                                            </li>
                                        ))}
                                        </ul>
                                    )}
                                    </div>

                            <input type="text" name="interests" value={editableData.interests} onChange={handleInputChange} style={styles.input} placeholder="Interests" />
                            <input type="text" name="favoriteSports" value={editableData.favoriteSports} onChange={handleInputChange} style={styles.input} placeholder="Favorite Sports" />
                            <input type="text" name="favoriteGame" value={editableData.favoriteGame} onChange={handleInputChange} style={styles.input} placeholder="Favorite Game" />
                            <input type="text" name="favoriteMusic" value={editableData.favoriteMusic} onChange={handleInputChange} style={styles.input} placeholder="Favorite Music" />
                            <input type="text" name="favoriteMovie" value={editableData.favoriteMovie} onChange={handleInputChange} style={styles.input} placeholder="Favorite Movie" />
                            <input type="text" name="favoriteAnime" value={editableData.favoriteAnime} onChange={handleInputChange} style={styles.input} placeholder="Favorite Anime" />
                            <input type="text" name="favoriteActor" value={editableData.favoriteActor} onChange={handleInputChange} style={styles.input} placeholder="Favorite Actor" />
                            <select id="edit-relationship-status" name="relationshipStatus" value={editableData.relationshipStatus} onChange={handleInputChange} style={styles.input}>
                                <option value="single">Single</option>
                                <option value="in a relationship">In a Relationship</option>
                                <option value="married">Married</option>
                                <option value="complicated">Complicated</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea name="bio" value={editableData.bio} onChange={handleInputChange} style={styles.textarea} placeholder="Bio" />
                            <button style={styles.saveButton} onClick={saveChanges}>Save Changes</button>
                            <button style={styles.cancelButton} onClick={toggleEditMode}>Cancel</button>
                        </>
                    ) : (
                        <>
                        {console.log("userData")}
                        {console.log(userData)}
                        <h2 style={styles.username}>{userData.username || "User's Name"}</h2>
                        <p style={styles.fullname}>{userData.fullname || 'Full Name'}</p>
                      
                        {/* New Row for Posts, Following, and Followers */}
                        <div style={styles.statsRow}>
                          <div style={styles.statItem}>
                            <span style={styles.statCount}>{userData.postsCount || 0}</span>
                            <span style={styles.statLabel}> Posts</span>
                          </div>
                          <div style={styles.statItem}>
                            <span style={styles.statCount}>{userData.followingCount || 0}</span>
                            <span style={styles.statLabel}> Following</span>
                          </div>
                          <div style={styles.statItem}>
                            <span style={styles.statCount}>{userData.followersCount || 0}</span>
                            <span style={styles.statLabel}> Followers</span>
                          </div>
                        </div>
                      
                        <p style={styles.additionalInfo}>Date of Birth: {userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : 'Not specified'}</p>
                        <p style={styles.additionalInfo}>College: {userData.collegeName || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Relationship Status: {userData.relationshipStatus || 'Single'}</p>
                        <p style={styles.additionalInfo}>Best Friend: {userData.bestFriend?.username || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Interests: {userData.interests || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Favorite Sports: {userData.favoriteSports || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Favorite Game: {userData.favoriteGame || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Favorite Music: {userData.favoriteMusic || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Favorite Movie: {userData.favoriteMovie || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Favorite Anime: {userData.favoriteAnime || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Favorite Actor: {userData.favoriteActor || 'Not specified'}</p>
                        <p style={styles.additionalInfo}>Bio: {userData.bio || 'User bio goes here...'}</p>
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
                 {activeSection === "posts" &&
  sectionData.map((post, index) => (
    <div
      key={post._id}
      className="bg-white rounded-lg shadow-md p-10 mb-4"
    >
      {/* Profile picture and username */}
      <div className="flex items-center mb-4">
        <img
          src={`${backendBaseUrl}${userData.profilePic}`} // Add profile picture URL here
          alt="Profile"
          className="w-12 h-12 rounded-md mr-2"
        />
        <strong className="text-lg ml-4">{post.user.username}</strong>
      </div>

      {/* Post caption */}
      {post.caption && (
        <p className="text-gray-700 mb-4">{post.caption}</p>
      )}

      {/* Image or video media */}
      {post.content.mediaUrl && post.postType === "image" && (
        <img
          src={`${backendBaseUrl}/${post.content.mediaUrl}`}
          alt="Post content"
          className="w-full rounded-lg mt-2"
        />
      )}
      {post.content.mediaUrl && post.postType === "video" && (
        <video controls className="w-full rounded-lg mt-2">
          <source
            type="video/mp4"
            src={`${backendBaseUrl}/${post.content.mediaUrl}`}
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  ))}
            {/* //saved */}
            {activeSection === "saved" &&
  savedData.map((post, index) => (
    <div
      key={post._id}
      className="bg-white rounded-lg shadow-md p-4 mb-4 relative"
    >
      {/* Delete Icon */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        onClick={() => handleDeletePost(post._id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Profile picture and username */}
      <div className="flex items-center mb-4">
        <img
          src={`${backendBaseUrl}${userData.profilePic}`} // Add profile picture URL here
          alt="Profile"
          className="w-10 h-10 rounded-md mr-2"
        />
        <strong className="text-lg ml-4">{post.postId.user.username}</strong>
      </div>

      {/* Post caption */}
      {post.postId.caption && (
        <p className="text-gray-700 mb-4">{post.postId.caption}</p>
      )}

      {/* Image or video media */}
      {post.postId.content.mediaUrl && post.postId.postType === "image" && (
        <img
          src={`${backendBaseUrl}/${post.postId.content.mediaUrl}`}
          alt="Post content"
          className="w-full rounded-lg mt-2"
        />
      )}
      {post.postId.content.mediaUrl && post.postId.postType === "video" && (
        <video controls className="w-full rounded-lg mt-2">
          <source
            type="video/mp4"
            src={`${backendBaseUrl}/${post.postId.content.mediaUrl}`}
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  ))}

            {/* liked */}
            {activeSection === "liked" &&
  likedData.map((post, index) => (
    <div
      key={post._id}
      className="bg-white rounded-lg shadow-md p-4 mb-4"
    >
      {/* Profile picture and username */}
      <div className="flex items-center mb-4">
        <img
          src={`${backendBaseUrl}${userData.profilePic}`} // Add profile picture URL here
          alt="Profile"
          className="w-10 h-10 rounded-md mr-2"
        />
        <strong className="text-lg ml-4">{post.user.username}</strong>
      </div>

      {/* Post caption */}
      {post.caption && (
        <p className="text-gray-700 mb-4">{post.caption}</p>
      )}

      {/* Image or video media */}
      {post.content.mediaUrl && post.postType === "image" && (
        <img
          src={`${backendBaseUrl}/${post.content.mediaUrl}`}
          alt="Post content"
          className="w-full rounded-lg mt-2"
        />
      )}
      {post.content.mediaUrl && post.postType === "video" && (
        <video controls className="w-full rounded-lg mt-2">
          <source
            type="video/mp4"
            src={`${backendBaseUrl}/${post.content.mediaUrl}`}
          />
          Your browser does not support the video tag.
        </video>
      )}
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
        backgroundColor: '#d5d5d5',
    },
    profileCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',  // Makes both sections equal in height
        width: '800px',
        maxWidth: '90%',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        gap: '20px',
        marginBottom: '25px',
    },
    profilePicContainer: {
        flex: '1',
        // backgroundColor: 'red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',  // Provides spacing around the image
    },
    profilePic: {
        width: '100%',  
        maxWidth: '250px',  // Adjusts the max width to create a vertical rectangle shape
        height: '350px',  // Sets the height to make it taller than it is wide
        borderRadius: '12px',
        objectFit: 'cover',
        backgroundColor: '#e0e0e0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    profileInfo: {
        flex: '2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingLeft: '20px',
        textAlign: 'left',
        lineHeight: '1.6',
    },
    // username: {
    //     fontSize: '1.8em',
    //     fontWeight: 'bold',
    //     color: '#333',
    //     marginBottom: '5px',
    // },
    // fullname: {
    //     fontSize: '1.3em',
    //     color: '#555',
    //     marginBottom: '15px',
    // },
    username: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
      },
      fullname: {
        fontSize: '1.3rem',
        color: '#555',
        marginBottom: '20px',
      },
    // statsRow: {
    //     display: 'flex',
    //     justifyContent: 'space-around',
    //     alignItems: 'center',
    //     margin: '16px 0',
    //     padding: '8px 0',
    //     borderTop: '1px solid #ddd',
    //     borderBottom: '1px solid #ddd',
    //   },
    //   statItem: {
    //     textAlign: 'center',
    //   },
    //   statCount: {
    //     fontSize: '20px',
    //     fontWeight: 'bold',
    //     color: '#333',
    //   },
    //   statLabel: {
    //     fontSize: '14px',
    //     color: '#777',
    //   },
    // additionalInfo: {
    //     fontSize: '1.1em',
    //     color: '#666',
    //     marginTop: '8px',
    // },
    statsRow: {
        display: 'flex',
        justifyContent: 'space-around',
        borderTop: '1px solid #e0e0e0',
        borderBottom: '1px solid #e0e0e0',
        padding: '10px 0',
        marginBottom: '20px',
      },
      statItem: {
        textAlign: 'center',
      },
      statCount: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#333',
      },
      statLabel: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '#777',
      },
      additionalInfo: {
        fontSize: '1rem',
        color: '#555',
        marginBottom: '10px',
      },
    
    editButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#6C63FF',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 12px rgba(108, 99, 255, 0.2)',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '20px',
    },
    activeButton: {
        padding: '12px 25px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.2em',
    },
    inactiveButton: {
        padding: '12px 25px',
        // backgroundColor: '#bbb',
        backgroundColor:'transparent',
        color: '#333',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1.2em',
    },
    sectionContent: {
        marginTop:'40px',
        width: '1000px',
        backgroundColor: '#d5d5d5',
        // backgroundColor:'blue',
        padding: '25px',
        // borderRadius: '10px',
        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'left',
        lineHeight: '1.6',
    },
    post: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        fontSize: '1em',
    },

    inputContainer: {
        position: 'relative',  // Required for the absolute positioning of the suggestions dropdown
        width: '100%',
    },

    suggestionsList: {
        position: 'absolute',
        top: '100%',  // Positions the list right below the input
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        border: '1px solid black',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '200px',  // Limits the height so it doesn't grow indefinitely
        overflowY: 'auto',  // Adds scroll if suggestions exceed max height
        zIndex: 10,
        padding: '0',
        marginTop: '8px',
    },
    suggestionItem: {
        padding: '10px',
        cursor: 'pointer',
        fontSize: '1em',
        color: '#333',
    },
    suggestionItemHover: {
        backgroundColor: '#f0f0f0',  // Light background when hovering
    },

    input: {
        marginBottom: '12px',
        padding: '10px',
        width: '100%',
        fontSize: '1em',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    textarea: {
        marginBottom: '12px',
        padding: '10px',
        width: '100%',
        height: '80px',
        fontSize: '1em',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    saveButton: {
        padding: '10px 20px',
        marginTop:'5px',
        marginBottom:'15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.2)',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px 12px rgba(220, 53, 69, 0.2)',
    },

};



export default UserDetails;
