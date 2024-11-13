const express = require('express');
const router = express.Router();
const User = require('../models/users');
const authenticateToken = require('./authenticate_user');
const multer = require('multer');
// const { Post } = require('../models/post'); 
const { Post, Comment } = require('../models/post');
const SavedPost=require("../models/savedPost");
// const Comment=require("../models/post");

// Route to get the logged-in user's details
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log("req.user");
    console.log(req.user);
    const user = await User.findById(req.user.userId).select('-password').populate({
      path: 'bestFriend',   // Populate the bestFriend field
      select: 'username',   // Only fetch the username of the bestFriend
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      // cb(null, './public/uploads');  // Path for saving images
      cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);  // Unique filename
  }
});
const upload = multer({ storage });


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Ensure this folder exists or create it
//   },
//   filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, uniqueSuffix + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// router.put('/update', authenticateToken, upload.single('profilePic'), async (req, res) => {
//   try {
//       const userId = req.user.userId;
//       const { fullname, username, bio, relationshipStatus } = req.body;
//       let updatedFields = { fullname, username, bio, relationshipStatus };

//       // If a profile picture is uploaded, add the file path to updatedFields
//       if (req.file) {
//           updatedFields.profilePic = req.file.path;
//       }

//       const updatedUser = await User.findByIdAndUpdate(
//           userId,
//           updatedFields,
//           { new: true, runValidators: true }
//       );

//       if (!updatedUser) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
//   } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });



// Profile update route with profile picture upload
// router.put('/update',authenticateToken, upload.single('profilePic'), async (req, res) => {
//   try {
//       let mediaUrl = null;
//       if (req.file) {
//           mediaUrl = `/uploads/${req.file.filename}`; // Correct media URL
//       }

//       // Update the user's profile in the database
//       const updatedUser = await User.findByIdAndUpdate(
//           req.user.userId,
//           {
//               profilePic: mediaUrl,
//               fullname: req.body.fullname,
//               username: req.body.username,
//               bio: req.body.bio,
//               relationshipStatus: req.body.relationshipStatus
//           },
//           { new: true }
//       );

//       console.log("updatedUser", updatedUser);
//       res.json({ message: 'Profile updated successfully',updatedUser });
//   } catch (error) {
//       console.error('Error updating profile:', error);
//       res.status(500).send('Failed to update profile');
//   }
// });






// router.patch('/update', authenticateToken, upload.single('profilePic'), async (req, res) => {
//   try {
//       let mediaUrl = null;

//       // Check if a new profile picture is uploaded
//       if (req.file) {
//           mediaUrl = `/uploads/${req.file.filename}`; // Set media URL to new file path
//       } else {
//           // Retrieve the current user profile to get the existing profilePic
//           const currentUser = await User.findById(req.user.userId);
//           mediaUrl = currentUser.profilePic; // Retain the existing profile picture URL if none is uploaded
//       }

//       console.log("reqbody");
//       console.log(req.body);

//       // Update the user's profile in the database
//       const updatedUser = await User.findByIdAndUpdate(
//           req.user.userId,
//           {
//               profilePic: mediaUrl,
//               username: req.body.username,
//               fullname: req.body.fullname,
//               relationshipStatus: req.body.relationshipStatus,
//               bio: req.body.bio,
//               bestFriend: req.body.bestFriend,
//               dateOfBirth: req.body.dateOfBirth,
//               collegeName: req.body.collegeName,
//               interests: req.body.interests,
//               favoriteSports: req.body.favoriteSports,
//               favoriteGame: req.body.favoriteGame,
//               favoriteMusic: req.body.favoriteMusic,
//               favoriteMovie: req.body.favoriteMovie,
//               favoriteAnime: req.body.favoriteAnime,
//               favoriteActor: req.body.favoriteActor
//           },
//           { new: true }
//         );
        
//       console.log("updatedUser", updatedUser);
//       res.json({ message: 'Profile updated successfully', updatedUser });
//   } catch (error) {
//       console.error('Error updating profile:', error);
//       res.status(500).send('Failed to update profile');
//   }
// });


const mongoose = require('mongoose');

router.patch('/update', authenticateToken, upload.single('profilePic'), async (req, res) => {
  try {
      let mediaUrl = null;

      // Check if a new profile picture is uploaded
      if (req.file) {
          mediaUrl = `/uploads/${req.file.filename}`; // Set media URL to new file path
      } else {
          // Retrieve the current user profile to get the existing profilePic
          const currentUser = await User.findById(req.user.userId);
          mediaUrl = currentUser.profilePic; // Retain the existing profile picture URL if none is uploaded
      }

      console.log("reqbody");
      console.log(req.body);

      // Prepare update data
      const updateData = {
          profilePic: mediaUrl,
          username: req.body.username,
          fullname: req.body.fullname,
          relationshipStatus: req.body.relationshipStatus,
          bio: req.body.bio,
          dateOfBirth: req.body.dateOfBirth,
          collegeName: req.body.collegeName,
          interests: req.body.interests,
          favoriteSports: req.body.favoriteSports,
          favoriteGame: req.body.favoriteGame,
          favoriteMusic: req.body.favoriteMusic,
          favoriteMovie: req.body.favoriteMovie,
          favoriteAnime: req.body.favoriteAnime,
          favoriteActor: req.body.favoriteActor,
      };

      // Only add bestFriend if it's a valid MongoDB ObjectId
      if (req.body.bestFriend === "") {
        updateData.bestFriend = null; // Set to null if empty string
    } else if (mongoose.Types.ObjectId.isValid(req.body.bestFriend)) {
        updateData.bestFriend = req.body.bestFriend; // Set to the valid ObjectId
    }


      // Update the user's profile in the database
      const updatedUser = await User.findByIdAndUpdate(
          req.user.userId,
          updateData,
          { new: true }
      );

      console.log("updatedUser", updatedUser);
      res.json({ message: 'Profile updated successfully', updatedUser });
  } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).send('Failed to update profile');
  }
});



const searchUsers = async (req, res) => {
  try {
      const { username } = req.query;
      const users = await User.find({ username: { $regex: username, $options: 'i' } }).limit(5);
      res.json(users.length ? users : []);
  } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: 'Error fetching users' });
  }
};
router.get('/bestfriend/search',searchUsers)

// router.get('/userPosts/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   console.log("entered route");
//   console.log(userId);

//   try {
//       // Find all posts by the given userId
//       const posts = await Post.find({ user: userId })
//           .populate('user', 'username')  // Populate the user details (like username)
//           .populate({
//               path: 'comments',
//               populate: { path: 'user', select: 'username' } // Populate comments and commenter usernames
//           })
//           .exec();
//         console.log("posts"); 
//         console.log(posts);
//       res.status(200).json({ posts });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error fetching posts' });
//   }
// });

router.get('/userPosts/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log("entered route");
  console.log(userId);

  try {
      // Find all posts by the given userId, selecting only specific fields
      const posts = await Post.find({ user: userId })
          .select('postType caption content') // Select only postType, caption, and content fields of the post
          .populate('user', 'username profilePic')  // Populate only the username and profilePic of the user
          .exec();

      console.log("posts"); 
      console.log(posts);
      res.status(200).json({ posts });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching posts' });
  }
});



//fetchsavedposts
// router.get('/savedPosts/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch saved posts for the user and populate the post details
//     const savedPosts = await SavedPost.find({ userId })
//       .populate({
//         path: 'postId', // Populate post details
//         model: Post,
//         populate: [
//           { path: 'user', select: 'username' }, // Populate user details
//           {
//             path: 'comments',
//             model: Comment,
//             populate: { path: 'user', select: 'username' } // Populate commenter details
//           }
//         ]
//       })
//       .exec();

//     res.json(savedPosts);
//   } catch (error) {
//     console.error('Error fetching saved posts with details:', error);
//     res.status(500).json({ error: 'Failed to fetch saved posts with details' });
//   }
// });

router.get('/savedPosts/:userId', async (req, res) => {
  try {
    console.log("fetchd saved oposts");
    const { userId } = req.params;

    // Fetch saved posts for the user and populate only the necessary post details
    const savedPosts = await SavedPost.find({ userId })
      .populate({
        path: 'postId', // Populate post details
        model: Post,
        select: 'postType caption content', // Select only specific post fields
        populate: {
          path: 'user', // Populate user field inside the post
          model: User,
          select: 'username profilePic', // Select only the username and profilePic of the user
        },
      })
      .exec();

    console.log(savedPosts);
    res.json(savedPosts);
  } catch (error) {
    console.error('Error fetching saved posts with details:', error);
    res.status(500).json({ error: 'Failed to fetch saved posts with details' });
  }
});

// router.get('/likedPosts/:userId', async (req, res) => {
//   try {
//       const {userId} = req.params; // Adjust based on your auth implementation

//       // Find posts where the logged-in user's ID is in the likes array
//       const likedPosts = await Post.find({ likes: userId })
//           .populate('user', 'username') // Populate username of the user who posted
//           .populate({
//               path: 'comments',
//               populate: { path: 'user', select: 'username' } // Populate comments with usernames
//           });

//       res.json(likedPosts);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Server error' });
//   }
// });

router.get('/likedPosts/:userId', async (req, res) => {
  try {
      const { userId } = req.params;

      // Find posts where the logged-in user's ID is in the likes array
      const likedPosts = await Post.find({ likes: userId })
          .select('user mediaType caption content mediaUrl postType') // Include postType in selected fields
          .populate('user', 'username'); // Populate only the username of the user who posted

      res.json(likedPosts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
