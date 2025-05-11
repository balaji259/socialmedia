const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users'); // Adjust path as needed
const authMiddleware = require('../middleware/auth'); // Assume you have JWT auth middleware

// POST /api/fbkey/activate
router.post('/activate', async (req, res) => {
  console.log(req.body);
  const { key, userId } = req.body;
//   const userId = req.user.id;

  if (!key || key.length !== 6) {
    return res.status(400).json({ message: 'Key must be 6 characters long.' });
  }

  try {
    const hashedKey = await bcrypt.hash(key, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'friendsbookKey.key': hashedKey,
          'friendsbookKey.active': true,
          'friendsbookKey.lastModified': new Date()
        }
      },
      { new: true }
    );
    console.log('emailid');
    console.log(updatedUser.email);

    res.status(200).json({ message: 'Friendsbook Key activated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/deactivate', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          'friendsbookKey.active': false,
          'friendsbookKey.lastModified': new Date()
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Friendsbook Key deactivated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
