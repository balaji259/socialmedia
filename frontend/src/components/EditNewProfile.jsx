import React from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import './EditNewProfile.css'; 


const NewProfile = () => {

    const [editableData, setEditableData] = useState({});
    const [userData, setUserData] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const backendBaseUrl="http://localhost:7000";
    const renderurl="https://socialmedia-backend-2njs.onrender.com";

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("undefined");

    const handleSearchInputChange = async (e) => {
      const value = e.target.value;
      setQuery(value);
  
      if (value.length > 0) {
        // Fetch suggestions from the backend
        try {
          const response = await fetch(`/profile/search-bestfriend?query=${value}`);
          const data = await response.json();
          setSuggestions(data.users); // Assuming the backend returns { users: [{ id, name }] }
          console.log("data of best freinds");
          console.log(data.users);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };
  
    const handleSuggestionClick = (user) => {
      console.log("in handle suggestion click");
      console.log(user._id);
      setQuery(user.username); // Update the input value with the selected username
      setSelectedUserId(user._id); // Store the selected user ID
      setSuggestions([]); // Clear the suggestions
    };



    const navigate=useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value
        }));
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
    
        // Append all fields to the formData
        // formData.append('username', editableData.username);
        // formData.append('email', editableData.email);
        formData.append('fullname', editableData.fullname);
        formData.append('mobile', editableData.mobile);
        formData.append('website', editableData.website);
        formData.append('fullname',editableData.fullname);
        formData.append('school', editableData.school);
        formData.append('status',editableData.status);

        formData.append('gender',editableData.gender);

        formData.append('residence', editableData.residence);
        formData.append('dateOfBirth', editableData.dateOfBirth);
        formData.append('hometown', editableData.hometown);
        formData.append('highschool', editableData.highschool);
        formData.append('lookingfor', editableData.lookingfor);
        formData.append('interestedIn', editableData.interestedIn);
        formData.append('relationshipstatus', editableData.relationshipstatus);
        // formData.append('bestfriend', editableData.bestfriend);
        formData.append('bestfriend',selectedUserId);
        formData.append('collegename', editableData.collegename);
        formData.append('interests',editableData.interests);
        formData.append('sport', editableData.sport);
        formData.append('game', editableData.game);
        formData.append('music', editableData.music);
        formData.append('movie', editableData.movie);
        formData.append('anime', editableData.anime);
        formData.append('actor', editableData.actor);
        formData.append('bio',editableData.bio);
        // if (editableData.profilePic instanceof File) {
        //     formData.append('profilePic', editableData.profilePic); // Attach image file
        // }
  
        if (editableData.profilePic instanceof File) {
          console.log('Profile picture is a file:', editableData.profilePic); // Debug
          formData.append('profilePic', editableData.profilePic); // Attach image file
      } else {
          console.log('Profile picture is not a file:', editableData.profilePic); // Debug
      }
    
        try {
            const response = await axios.patch(`/profile/demo/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token for authentication
                },
            });

            console.log("resposne.data");
            console.log(response.data);
    
            setUserData(response.data.updatedUser); // Update UI with new user data
            // toggleEditMode(); // Exit edit mode
        } catch (error) {
            console.error('Error updating profile:', error);
            // setError('Failed to update profile. Please try again later.');
        }

        for (let [name, value] of formData.entries()) {
            console.log(`${name}: ${value}`);
          }


        navigate("/profile");


    };
 

    return (
        <div className="profile-container">
          <div className="profile-header">
            <span>Name of the User:username</span>
            {/* <span>ex - Pranav Kawade profile</span> */}
            <span>University name</span>
          </div>
      
          <div className="profile-body">
            <div className="left-section">
              <div className="profile-photo">
              {previewImage ? ( // Show preview image if available
                    <img 
                    src={previewImage} 
                    alt="Profile Preview" 
                    className="preview-image"
                    // style={{ width: '100px', height: '100px', borderRadius: '50%' }} // Optional styling
                    />
                ) : (
                    <div className="placeholder-image">
                    <span>No Image Selected</span> {/* Placeholder content */}
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="photoInput"
                />
                {/* <label htmlFor="photoInput" style={{ cursor: 'pointer' }}>
                  Upload Profile Photo
                </label> */}
              </div>
              <label className="photo-input-label" htmlFor="photoInput" style={{ cursor: 'pointer' }}>
                  Upload Profile Photo
                </label>
      
              <div className="info-section class-section">
                <h4>Contact Info:</h4>
                {/* <div className="input-group">
                  <label>Email:</label>
                  <input type="email" name="email" value={editableData.email} onChange={handleInputChange} />
                </div> */}
                <div className="input-group">
                  <label>Mobile No:</label>
                  <input type="number" name="mobile" value={editableData.mobile} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Websites:</label>
                  <input type="text" name="website" value={editableData.website} onChange={handleInputChange} />
                </div>
              </div>
            </div>
      
            <div className="center-section">
              <h3>Information</h3>
              <div className="info-section">
                <h4>Account Info:</h4>
                {/* <div className="input-group">
                  <label>Full Name:</label>
                  <input type="text" name="fullname" value={editableData.fullname} onChange={handleInputChange} />
                </div> */}
                <div className="input-group">
                  <label>User Name:</label>
                  <input type="text" name="username" value={editableData.username} onChange={handleInputChange} />
                </div>
                {/* <p>Name:</p> */}
                {/* <p>Member Since:</p> */}
                {/* <p>Last Update:</p> */}
              </div>
      
              <div className="info-section">
                <h4>Basic Info:</h4>
                <div className="input-group">
                  <label>School:</label>
                  <input type="text" name="school" value={editableData.school} onChange={handleInputChange} />
                </div>
      
                <div className="input-group">
                  <label>Status:</label>
                  <select
                        name="status" // Specify the name for the dropdown
                        value={editableData.status} // Bind the value to the state
                        onChange={handleInputChange}
                  >
                    <option>Select Your Status</option>
                    <option value="student">Student</option>
                    <option value="Professor">Professor</option>
                    <option value="working">Working</option>
                    <option value="other">Other</option>
                    {/* <option value="divorced">Divorced</option> */}
                  </select>
    </div>
      
                <div className="input-group drop-down">
                  <label>Gender:</label>
                  <select
                        name="gender" // Specify the name for the dropdown
                        value={editableData.gender} // Bind the value to the state
                        onChange={handleInputChange}
                  >
                    <option>Select Your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div> 
      
                <div className="input-group">
                  <label>Residence:</label>
                  <input type="text" name="residence" value={editableData.residence} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Birthday:</label>
                  <input type="date" name="dateOfBirth" value={editableData.dateOfBirth} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Home Town:</label>
                  <input type="text" name="hometown" value={editableData.hometown}  onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>High School:</label>
                  <input type="text" name="highschool" value={editableData.highschool}  onChange={handleInputChange} />
                </div>
              </div>
      
              <div className="info-section">
                <h4>Personal Info:</h4>
                <div className="input-group">
                  <label>Looking for:</label>
                  <input type="text" name="lookingfor" value={editableData.lookingfor} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Interested In:</label>
                  <input type="text" name="interestedIn" value={editableData.interestedIn} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Relationship Status:</label>
                  <select
                        name="relationshipstatus" // Specify the name for the dropdown
                        value={editableData.relationshipstatus} // Bind the value to the state
                        onChange={handleInputChange}
                  >
                    <option>Select Your Status</option>
                    <option value="single">Single</option>
                    <option value="in-a-relationship">In RelationShip</option>
                    <option value="married">Married</option>
                    <option value="complicated">Complicated</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="input-group dropdownparent">
                  <label>Best Friend:</label>
                  {/* <input type="text" name="bestfriend" value={editableData.bestfriend} onChange={handleInputChange} /> */}

                  <input
        type="text"
        name="bestfriend"
        value={query}
        onChange={handleSearchInputChange}
        placeholder="Search for a user..."
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="dropdown">
          {suggestions.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSuggestionClick(user)}
              className="dropdown-item"
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
                
                </div>
                <div className="input-group">
                  <label>College Name:</label>
                  <input type="text" name="collegename" value={editableData.collegename} onChange={handleInputChange} />
                </div>
              </div>
      
              <div className="info-section">
                <h4>Interest:</h4>
                <div className="input-group">
                  <label>Interests:</label>
                  <input type="text" name="interests" value={editableData.interests} onChange={handleInputChange}/>
                </div>
                <div className="input-group">
                  <label>Favorite Sports:</label>
                  <input type="text" name="sport" value={editableData.sport} onChange={handleInputChange}  />
                </div>
                <div className="input-group">
                  <label>Favorite Game:</label>
                  <input type="text" name="game" value={editableData.game} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Favorite Music:</label>
                  <input type="text" name="music" value={editableData.music} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Favorite Movie:</label>
                  <input type="text" name="movie" value={editableData.movie} onChange={handleInputChange}/>
                </div>
                <div className="input-group">
                  <label>Favorite Anime:</label>
                  <input type="text" name="anime" value={editableData.anime} onChange={handleInputChange}/>
                </div>
                <div className="input-group">
                  <label>Favorite Actor:</label>
                  <input type="text" name="actor" value={editableData.actor} onChange={handleInputChange}/>
                </div>
                <div className="input-group">
                  <label>About me (Bio):</label>
                  <textarea rows="4" placeholder="Write something about yourself..." name="bio" value={editableData.bio} onChange={handleInputChange} />
                </div>

              </div>

                <div className="button-container">
                    
                    <button className="save-me" onClick={saveChanges}>Save Changes</button>
                    <button className="cancel-me" onClick={()=>navigate('/profile')} >Cancel</button>
                </div>

            </div>
      
            <div className="right-section">
              {/* <p>Leave this space</p> */}
            </div>
          </div>
        </div>
      );
};

export default NewProfile;