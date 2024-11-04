const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Make sure this points to your User model
const { getRandomUserSuggestions } = require('./suggestions');
const authenticateUser=require("./authenticate_user");
const { checkStreakOnLoad, updateStreakOnPost } =require("./streak");

const router = express.Router();

// Middleware to fetch user details
const getUserDetails = async (req, res) => {
  try {

   
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // Split the header to extract the token
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid Authorization format' });
    }

    // Extract the token
    const token = tokenParts[1];

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set correctly
    } catch (err) {
      return res.status(401).json({ message: 'Token verification failed', error: err.message });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send relevant user data
    res.json({
      username: user.username,
      fullname: user.fullname,
      profilePic: user.profilePic,
    });
  } catch (err) {
    // Catch any server errors
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Define the route
router.get('/getdetails', getUserDetails);
router.get('/suggestions',authenticateUser,getRandomUserSuggestions);

//follow
router.post('/follow/:userId', authenticateUser, async (req, res) => {
  try {
      const currentUserId = req.user.userId; // Current user ID from token
      const targetUserId = req.params.userId; // User ID of the person to follow

      if (currentUserId === targetUserId) {
          return res.status(400).json({ message: 'You cannot follow yourself' });
      }

      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);

      if (!currentUser || !targetUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if already following
      if (!currentUser.following.includes(targetUserId)) {
          currentUser.following.push(targetUserId);
          targetUser.followers.push(currentUserId);

          await currentUser.save();
          await targetUser.save();

          return res.status(200).json({ message: 'Successfully followed user' });
      } else {
          return res.status(400).json({ message: 'Already following user' });
      }
  } catch (error) {
      console.error('Follow error:', error);
      res.status(500).json({ message: 'Failed to follow user' });
  }
});



module.exports = router;

