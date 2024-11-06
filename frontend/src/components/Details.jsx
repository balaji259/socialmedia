import React, { useEffect, useState } from 'react';

function UserDetails() {
    const [userData, setUserData] = useState(null);
    const [sectionData, setSectionData] = useState([]);
    const [activeSection, setActiveSection] = useState('posts');
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editableData, setEditableData] = useState({});

    const backendBaseUrl = 'http://localhost:7000';

    useEffect(() => {
        fetchUserData();
    }, []);

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
            setUserData(data);
            
        } catch (error) {
            console.error('Failed to fetch user data:', error);
            setError('Error fetching user data. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    const saveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${backendBaseUrl}/profile/me`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editableData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const updatedData = await response.json();
            setUserData(updatedData);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save user data:', error);
            setError('Error saving user data. Please try again later.');
        }
    };


    const fetchUserPosts = async () => {
        setSectionData(['Post 1', 'Post 2', 'Post 3']); // Sample data, replace with actual fetch logic
    };

    const fetchUserLiked = async () => {
        setSectionData(['Liked Post 1', 'Liked Post 2']);
    };

    const fetchUserSaved = async () => {
        setSectionData(['Saved Post 1']);
    };

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
                            src={editableData.profilePic || '/images/default_profile.jpeg'}
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
                        // onChange={handleImageUpload}
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
        {sectionData.map((item, index) => (
            <div key={index} style={styles.post}>{item}</div>
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
        width: '70%',  // Narrower width for taller aspect ratio
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
