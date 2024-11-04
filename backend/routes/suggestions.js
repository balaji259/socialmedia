const User = require('../models/users'); // Adjust the path as needed
const authenticateUser = require('./authenticate_user');

// Function to get random users excluding those who are followed by the logged-in user and excluding the user themself
// async function getRandomUserSuggestions(req, res) {
//     try {
//         const loggedInUserId = req.user.userId; // Ensure we are using req.user.userId from the decoded token

//         if (!loggedInUserId) {
//             return res.status(400).json({ message: 'User not authenticated' });
//         }

//         // Fetch the logged-in user with their following list
//         const loggedInUser = await User.findById(loggedInUserId).populate('following');
//         if (!loggedInUser) {
//             return res.status(404).json({ message: 'Logged-in user not found' });
//         }

//         // Create an array of IDs to exclude: logged-in user + users they are following
//         const excludeIds = loggedInUser.following.map(user => user._id.toString());
//         excludeIds.push(loggedInUserId.toString()); // Add logged-in user's ID to exclusion list

//         // Fetch random users excluding those in the excludeIds array
//         const randomUsers = await User.aggregate([
//             { $match: { _id: { $nin: excludeIds } } }, // Exclude followed users and self
//             { $sample: { size: 5 } } // Get 5 random users
//         ]);

//         // Ensure logged-in user's ID is not included
//         const filteredUsers = randomUsers.filter(user => user._id.toString() !== loggedInUserId.toString());

//         res.status(200).json({ users: filteredUsers.slice(0, 3) });
//     } catch (error) {
//         console.error('Error fetching user suggestions:', error); // Log the error
//         res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// }


async function getRandomUserSuggestions(req, res) {
    try {
        const loggedInUserId = req.user.userId;

        if (!loggedInUserId) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        // Fetch the logged-in user's following list
        const loggedInUser = await User.findById(loggedInUserId).populate('following');
        if (!loggedInUser) {
            return res.status(404).json({ message: 'Logged-in user not found' });
        }

        // Create an exclusion list with the logged-in user's ID and their following list
        const excludeIds = loggedInUser.following.map(user => user._id);
        excludeIds.push(loggedInUser._id);

        // Aggregate to fetch random users excluding those in the excludeIds array
        const randomUsers = await User.aggregate([
            { $match: { _id: { $nin: excludeIds } } }, // Exclude followed users and self
            { $sample: { size: 3 } }, // Directly limit to 3 random users
            { $project: { password: 0 } } // Exclude sensitive information
        ]);

        res.status(200).json({ users: randomUsers });
    } catch (error) {
        console.error('Error fetching user suggestions:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
}


module.exports = { getRandomUserSuggestions };