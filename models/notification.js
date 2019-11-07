const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var notificationSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    userId2: { type: Schema.Types.ObjectId, required: true },
    type: { type: Number, require: true },
    message: { type: Object, required: true },
    status: { type: Number, required: true, default: 0 },
    link: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now }
});

notificationSchema.set('toJSON', { virtuals: true });
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;