const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: keys.google.callbackURL
}, (accessToken, refreshToken, profile, cb) => {
    // console.log(profile);
    User.findOne({ googleId: profile.id }).then((currUser) => {
        if (currUser) {
            return cb(null, currUser, { error_msg: 'User already exists!' });
        }
        else {
            new User({
                googleId: profile.id,
                profilePic: profile._json.picture,
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                username: profile.displayName,
                email: profile._json.email,
                gender: profile._json.gender,
                verified: profile._json.email_verified
            }).save().then((newUser) => {
                User.updateOne({googleId: newUser.googleId}, { active: true }, (err, res)=> {
                    if(err) throw err;
                });
                return cb(null, newUser, { success_msg: 'User Created!' });
            });
        }
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});