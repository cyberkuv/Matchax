const mongoose = require('mongoose');

const usrSchema = new mongoose.Schema({
    googleId: { type: String },
    profilePic: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: String },
    age: { type: Number },
    email: { type: String, unique: true,  },
    username: { type: String, unique: true,  },
    password: { type: String, minlength: 6 },
    verified: { type: Boolean, default: false },
    preference: { type: String },
    hobby: { type: String },
    interest: { type: String },
    language: { type: String },
    nationality: { type: String },
    countryOfResidence: { type: String },
    createdDate: { type: Date, default: Date.now }
});

usrSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', usrSchema);
module.exports = User