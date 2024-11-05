const express = require('express');
const path = require('path');
const router = express.Router();
const multer = require('multer');
// const Post = require('../models/post');
const { Post, Comment } = require('../models/post');
const Report = require('../models/report');
const authMiddleware = require('../middleware/auth');  // Ensure correct import
const authenticateUser = require('./authenticate_user');
const SavedPost = require('../models/savedPost');
const User = require("../models/users");
const { checkStreakOnLoad, updateStreakOnPost } = require("./streak");


// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));  // Path to save uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Unique filename
    }
});
const upload = multer({ storage });



router.post('/create', upload.single('mediaContent'), async (req, res) => {
    try {
        const { captionOrText, userId } = req.body;  // Extract userId from the request body

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Determine post type
        let postType = 'text';
        let mediaUrl = null; // Initialize mediaUrl
        if (req.file) {
            const mediaType = req.file.mimetype.split('/')[0];
            postType = mediaType === 'image' ? 'image' : 'video';
            mediaUrl = `../uploads/${req.file.filename}`; // Correct media URL
        }

        // Create a new post
        const post = new Post({
            user: userId,  // Use userId sent from the client-side
            postType,
            caption: captionOrText,
            content: {
                mediaUrl, // Use the constructed mediaUrl
            },
        });

        // Save the new post to the database
        await post.save();

        // Increment the user's postsCount by 1
        await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.error('Error creating post:', error); // More specific error logging
        res.status(500).json({ error: error.message || 'Failed to create post' });
    }
});



router.get('/get', async (req, res) => {
    const userId = req.user ? req.user._id : null; // Optional authentication check

    try {
        const posts = await Post.find({})
            .populate('user', 'username profilePic') // Populate user info for the post
            .populate({
                path: 'comments',
                populate: [
                    { path: 'user', select: 'username profilePic' }, // Populate user for comments
                    {
                        path: 'replies',
                        populate: {
                            path: 'user', select: 'username profilePic'  // Populate user for replies
                        }
                    }
                ]
            })
            .sort({ createdAt: -1 });

        const formattedPosts = posts.map(post => ({
            postId: post._id,
            user: {
                profilePic: post.user?.profilePic || 'default-pic-url',
                username: post.user?.username || 'Unknown User',
            },
            postType: post.postType,
            caption: post.caption,
            content: {
                mediaUrl: post.content.mediaUrl,
            },
            likesCount: post.likes.length,
            likedByUser: userId ? post.likes.includes(userId) : false,
            comments: post.comments.map(comment => formatComment(comment)),
            shares: post.shares,
            createdAt: post.createdAt,
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Helper function to format comments and recursively format replies
function formatComment(comment) {
    return {
        commentId: comment._id, // Include comment ID
        user: comment.user ? {
            userId: comment.user._id, // Include user ID
            profilePic: comment.user.profilePic || 'default-pic-url',
            username: comment.user.username || 'Unknown User',
        } : {
            profilePic: 'default-pic-url',
            username: 'Unknown User',
        },
        text: comment.text,
        createdAt: comment.createdAt,
        replies: (comment.replies || []).map(reply => formatReply(reply)) // Map replies using helper
    };
}

// Helper function to format replies, including nested replies
function formatReply(reply) {
    return {
        replyId: reply._id, // Include reply ID
        user: reply.user ? {
            userId: reply.user._id, // Include user ID
            profilePic: reply.user.profilePic || 'default-pic-url',
            username: reply.user.username || 'Unknown User',
        } : {
            profilePic: 'default-pic-url',
            username: 'Unknown User',
        },
        text: reply.text,
        createdAt: reply.createdAt,
        replies: (reply.replies || []).map(nestedReply => formatNestedReply(nestedReply)) // Recursively map nested replies
    };
}

// Helper function for nested replies
function formatNestedReply(nestedReply) {
    return {
        nestedReplyId: nestedReply._id, // Include nested reply ID
        user: nestedReply.user ? {
            userId: nestedReply.user._id, // Include user ID
            profilePic: nestedReply.user.profilePic || 'default-pic-url',
            username: nestedReply.user.username || 'Unknown User',
        } : {
            profilePic: 'default-pic-url',
            username: 'Unknown User',
        },
        text: nestedReply.text,
        createdAt: nestedReply.createdAt,
    };
}

// POST route to like/unlike a post

// Like/Unlike Post
    router.post('/like/:userId/:postId', async (req, res) => {
    const { postId, userId } = req.params;

    console.log(`postid ${postId}`);
    console.log(`userid ${userId}`);

    try {
        // Convert userId to ObjectId
        // const userIdObject = mongoose.Types.ObjectId(userId);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        const userIndex = post.likes.indexOf(userId);

        if (userIndex === -1) {
            // User has not liked the post, so add like
            post.likes.push(userId);
        } else {
            // User already liked the post, so remove the like
            post.likes.splice(userIndex, 1);
        }

        await post.save();
        res.status(200).json({ message: 'Like status updated', likesCount: post.likes.length });
    } catch (error) {
        console.error('Error updating like status:', error);
        res.status(500).json({ error: 'Failed to update like status' });
    }
});


// Add a comment to a post
// Comment route for a specific post
// Example using Express.js
// Add a new comment to a post
router.post('/comment/:postId', authenticateUser, async (req, res) => {
    const postId = req.params.postId;
    const { text } = req.body;
    const { userId, username } = req.user;

    if (!text || !userId || !username) {
        return res.status(400).send({ message: 'Comment text, user ID, and username are required.' });
    }

    try {
        const newComment = new Comment({
            user: userId,
            username: username,
            text: text,
            createdAt: new Date(),
        });

        // Save the comment before adding it to the post
        await newComment.save();

        const post = await Post.findById(postId);
        if (!post) return res.status(404).send({ message: 'Post not found.' });

        post.comments.push(newComment._id);
        await post.save();

        // Populate the new comment with its replies (if any)
        const populatedComment = await Comment.findById(newComment._id).populate('replies');

        res.status(200).send(populatedComment);
    } catch (error) {
        console.error('Error adding comment:', error.message || error);
        res.status(500).send({ message: 'Error adding comment.', error: error.message });
    }
});



// Route to add a reply to a comment
router.post('/comment/:commentId/reply', async (req, res) => {
    const { commentId } = req.params;
    const { text, userId, username } = req.body;

    console.log("Request Body:", req.body); // Check what is being sent in the request body

    try {
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Create a new reply comment
        const newReply = new Comment({
            user: userId,  // Ensure this is not undefined
            username: username,
            text: text,
        });

        console.log("newReply");
        console.log(newReply);

        // Save the reply comment to the database
        const savedReply = await newReply.save();

        // Update the parent comment to include this reply
        await Comment.findByIdAndUpdate(commentId, {
            $push: { replies: savedReply._id }
        });

        res.status(201).json({ message: "Reply added successfully", reply: savedReply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add reply" });
    }
});
// Fetch a post with comments and replies
router.get('/post/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
            .populate({
                path: 'comments',
                populate: {
                    path: 'replies',
                    model: 'Comment',
                    populate: {
                        path: 'replies',
                        model: 'Comment',  // Deep populate more levels if needed
                    }
                },
            });

        if (!post) return res.status(404).send({ message: 'Post not found.' });

        console.log("Populated Post:", JSON.stringify(post, null, 2));
        res.status(200).send(post);
    } catch (error) {
        console.error('Error fetching post:', error.message || error);
        res.status(500).send({ message: 'Error fetching post.', error: error.message });
    }
});


router.post("/report", async (req, res) => {
    try {
        const { userId, postId, reason } = req.body;

        const newReport = new Report({
            userId,
            postId,
            reason,
            reportedAt: new Date()
        });

        await newReport.save();

        res.json({ success: true, message: "Report saved successfully!" });
    } catch (error) {
        console.error("Failed to save report:", error);
        res.status(500).json({ success: false, message: "Failed to submit report." });
    }
});

//savepost

router.post('/save', async (req, res) => {
    const { userId, postId } = req.body;

    try {
        // Check if the post is already saved by the user
        const existingSave = await SavedPost.findOne({ userId, postId });
        if (existingSave) {
            return res.status(400).json({ success: false, message: "Post already saved." });
        }

        const savedPost = new SavedPost({ userId, postId });
        await savedPost.save();

        res.json({ success: true, message: "Post saved successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred." });
    }
});

// Route to fetch saved posts by user
router.get('/getsaved/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const savedPosts = await SavedPost.find({ userId }).populate('postId').exec();
        res.json({ success: true, savedPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred." });
    }
});





router.get('/:postId', async (req, res) => {
    console.log(req.params);
    const { postId } = req.params;
    console.log(postId);

    try {
        const post = await Post.findById(postId)
            .populate('user', 'username profilePic') // Populate user details for the post owner
            .populate({
                path: 'comments',
                populate: [
                    { path: 'user', select: 'username profilePic' }, // Populate user details for each comment
                    {
                        path: 'replies',
                        populate: { path: 'user', select: 'username profilePic' } // Populate nested replies' user details
                    }
                ]
            });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({ error: 'Failed to fetch post details' });
    }
});








module.exports = router;
