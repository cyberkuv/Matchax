const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    reciever: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

messageSchema.set('toJSON', { virtuals: true });
const Messages = mongoose.model('Messages', messageSchema);
module.exports = Messages;