const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That Email Is Not Registered' });
        }
        if(user.verified == false) {
          return done(null, false, { message: 'Check Your Email For Your Verification Link' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            User.updateOne({_id: user._id}, { active: true }, (err, res)=> {
              if(err) throw err;
              return done(null, user);
            });
          } else {
            return done(null, false, { message: 'Password Incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};