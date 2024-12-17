import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import "./details.css";

const UserProfile = () => {
    const { userId } = useParams(); // Get userId from the URL
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [sectionData, setSectionData] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [savedData, setSavedData] = useState([]);
    const [likedData,setLikedData]=useState([]);
    const [activeSection, setActiveSection] = useState('posts');
    const backendBaseUrl = "http://localhost:7000";

    const handleSectionChange = (section) => {
        setActiveSection(section);
        if (section === 'posts') fetchUserPosts();
        else if (section === 'liked') fetchUserLiked();
        else if (section === 'saved') fetchUserSaved();
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
    // useEffect(() => {
    //     console.log("Updated sectionData:", sectionData);
    // }, [sectionData]);



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

    // useEffect(() => {
    //     console.log("Updated likedData:", likedData);
    // }, [likedData]);

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
    
    // useEffect(() => {
    //     console.log("Updated saved Data:");
    //     console.log(savedData);
        

    // }, [savedData]);

    useEffect(() => {
        // Fetch user data by userId
        axios.get(`${backendBaseUrl}/user/viewProfile/${userId}`)
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [userId]);

    const openModal = (type) => {
        const content = type === 'following' ? userData.following : userData.followers;
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent([]);
    };

    const toggleEditMode = () => {
        console.log("Edit mode toggled");
    };

    if (!userData) return <p>Loading...</p>;

    return (
        <div className="container">
            <div className="profileCard">
                {/* Left Section: Profile Picture */}
                <div className="profilePicContainer">
                    <img
                        src={userData.profilePic === '/images/default_profile.jpeg' ? '/images/default_profile.jpeg' : `${backendBaseUrl}${userData.profilePic}`}
                        alt="Profile Pic"
                        className="profilePic"
                    />
                </div>

                {/* Right Section: Profile Information */}
                <div className="profileInfo">
                    <h2 className="username">{userData.username || "User's Name"}</h2>
                    <p className="fullname">{userData.fullname || 'Full Name'}</p>

                    {/* Stats Row */}
                    <div className="statsRow">
                        <div className="statItem">
                            <span className="statCount">{userData.postsCount || 0}</span>
                            <span className="statLabel">Posts</span>
                        </div>
                        <div className="statItem" onClick={() => openModal('following')}>
                            <span className="statCount">{userData.following.length || 0}</span>
                            <span className="statLabel">Following</span>
                        </div>
                        <div className="statItem" onClick={() => openModal('followers')}>
                            <span className="statCount">{userData.followers.length || 0}</span>
                            <span className="statLabel">Followers</span>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <p className="additionalInfo">Date of Birth: {userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : 'Not specified'}</p>
                    <p className="additionalInfo">College: {userData.collegeName || 'Not specified'}</p>
                    <p className="additionalInfo">Relationship Status: {userData.relationshipStatus || 'Single'}</p>
                    <p className="additionalInfo">Best Friend: {userData.bestFriend?.username || 'Not specified'}</p>
                    <p className="additionalInfo">Interests: {userData.interests || 'Not specified'}</p>
                    <p className="additionalInfo">Favorite Sports: {userData.favoriteSports || 'Not specified'}</p>
                    <p className="additionalInfo">Favorite Game: {userData.favoriteGame || 'Not specified'}</p>
                    <p className="additionalInfo">Favorite Music: {userData.favoriteMusic || 'Not specified'}</p>
                    <p className="additionalInfo">Favorite Movie: {userData.favoriteMovie || 'Not specified'}</p>
                    <p className="additionalInfo">Favorite Anime: {userData.favoriteAnime || 'Not specified'}</p>
                    <p className="additionalInfo">Favorite Actor: {userData.favoriteActor || 'Not specified'}</p>
                    <p className="additionalInfo">Bio: {userData.bio || 'User bio goes here...'}</p>
                    
                </div>
            </div>

            {isModalOpen && (
                <div className="modalBackdrop">
                    <div className="modalContent">
                        <h3 className="modalTitle">{modalContent.length > 0 ? 'Users List' : 'No Users Found'}</h3>
                        <ul className="modalList">
                            {modalContent.map((username, index) => (
                                <li key={index} className="modalListItem">
                                    <img
                                        src={`https://via.placeholder.com/40`} // Replace with actual user avatar URL if available
                                        alt={username}
                                        className="userAvatar"
                                    />
                                    <span className="username">{username}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="closeButton" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}

<div className="buttonContainer">
    <button style={activeSection === 'posts' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange('posts')}>Posts</button>
    {/* <button style={activeSection === 'saved' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange('saved')}>Saved</button>
    <button style={activeSection === 'liked' ? styles.activeButton : styles.inactiveButton} onClick={() => handleSectionChange('liked')}>Liked</button> */}
</div>

<div className="sectionContent">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {activeSection === "posts" &&
            sectionData.map((post) => (
                <div
                    key={post._id}
                    className="relative bg-white rounded-lg shadow-md cursor-pointer overflow-hidden"
                    onClick={() => setSelectedPost(post)}
                    style={{ aspectRatio: "4 / 3" }}
                >
                    {post.postType === "image" && post.content.mediaUrl && (
                        <img
                            src={`${backendBaseUrl}/${post.content.mediaUrl}`}
                            alt="Post media"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {post.postType === "video" && post.content.mediaUrl && (
                        <video className="w-full h-full object-cover" muted>
                            <source
                                src={`${backendBaseUrl}/${post.content.mediaUrl}`}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {post.postType === "text" && (
                        <div className="p-4 flex items-center justify-center text-center">
                            <p className="text-gray-700">{post.caption}</p>
                        </div>
                    )}
                </div>
            ))}
    </div>

    {selectedPost && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            style={{ paddingTop: "4rem" }}
        >
            <div
                className="bg-white rounded-lg shadow-lg p-4 relative max-w-4xl w-full mx-4"
                style={{
                    maxHeight: "90vh",
                    overflow: "hidden",
                }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedPost(null)}
                >
                    ✖
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center mb-4">
                        <img
                            src={`${backendBaseUrl}${selectedPost.user.profilePic}`}
                            alt="Profile"
                            className="w-10 h-10 rounded-mid mr-3"
                        />
                        <strong className="text-lg text-gray-800">
                            {selectedPost.user.username}
                        </strong>
                    </div>
                    {selectedPost.caption && (
                        <p className="text-gray-700 mb-4 text-left">{selectedPost.caption}</p>
                    )}
                    <div className="flex justify-center items-center">
                        {selectedPost.content.mediaUrl && selectedPost.postType === "image" && (
                            <img
                                src={`${backendBaseUrl}/${selectedPost.content.mediaUrl}`}
                                alt="Post content"
                                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                            />
                        )}
                        {selectedPost.content.mediaUrl &&
                            selectedPost.postType === "video" && (
                                <video
                                    controls
                                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                                >
                                    <source
                                        type="video/mp4"
                                        src={`${backendBaseUrl}/${selectedPost.content.mediaUrl}`}
                                    />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                    </div>
                </div>
            </div>
        </div>
    )}

    {/* {activeSection === "saved" &&
        savedData.map((post, index) => (
            <div
                key={post._id}
                className="bg-white rounded-lg shadow-md p-8 mb-4 relative"
            >
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
                <div className="flex items-center mb-4">
                    <img
                        src={`${backendBaseUrl}${userData.profilePic}`}
                        alt="Profile"
                        className="w-14 h-14 rounded-md mr-2"
                    />
                    <strong className="text-lg ml-4">{post.postId.user.username}</strong>
                </div>
                {post.postId.caption && (
                    <p className="text-gray-700 mb-4">{post.postId.caption}</p>
                )}
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

    {activeSection === "liked" &&
        likedData.map((post, index) => (
            <div
                key={post._id}
                className="bg-white rounded-lg shadow-md p-8 mb-4"
            >
                <div className="flex items-center mb-4">
                    <img
                        src={`${backendBaseUrl}${userData.profilePic}`}
                        alt="Profile"
                        className="w-14 h-14 rounded-md mr-2"
                    />
                    <strong className="text-lg ml-4">{post.user.username}</strong>
                </div>
                {post.caption && (
                    <p className="text-gray-700 mb-4">{post.caption}</p>
                )}
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
        ))} */}
</div>




        {/* //container     */}
        </div>
    );
};




const styles = {
    //     
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
            backgroundColor: 'transparent',
            color: '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1.2em',
        },
    //     
    };

export default UserProfile;
