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
    active: { type: Boolean, default: false },
    preference: { type: String },
    prefAge: {
        min: { type: Number },
        max: { type: Number }
    },
    hobby: { type: String },
    interest: {
        first: { type: String },
        second: { type: String },
        third: { type: String },
        fourth: { type: String },
        fifth: { type: String }
    },
    bio: { type: String },
    language: { type: String },
    nationality: { type: String },
    ethnicity: { type: String },
    countryOfResidence: { type: String },
    createdDate: { type: Date, default: Date.now },
    state: { type: String },
    city: { type: String },
    longitude: { type: Number },
    latitude: { type: Number }
});

usrSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', usrSchema);
module.exports = User