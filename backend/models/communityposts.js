const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema explicitly

const communityPostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postType: { type: String, enum: ['text', 'image', 'video'], required: true },
    group_id: { type: Schema.Types.ObjectId, ref: 'Community', required: true }, // Added `ref: 'Group'`
    caption: { type: String },
    media: { type: String }, // Fixed media field to store only the URL as a string
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 }, 
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now }
});



const CommunityPosts=mongoose.model('CommunityPosts', communityPostSchema);
module.exports = CommunityPosts;
    