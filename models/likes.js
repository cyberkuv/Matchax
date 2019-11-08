const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var likesSchema = new mongoose.Schema({
    userId1: { type: Schema.Types.ObjectId, required: true },
    userId2: { type: Schema.Types.ObjectId, required: true },
    // match: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

likesSchema.set('toJSON', { virtuals: true });
const Likes = mongoose.model('Likes', likesSchema);
module.exports = Likes;