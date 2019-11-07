const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var linksSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    token: { type: String, required: true },
    type: { type: Number, min: 1, max: 2, required: true }
});

linksSchema.set('toJSON', { virtuals: true });
const Links = mongoose.model('Links', linksSchema);
module.exports = Links;