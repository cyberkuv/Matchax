const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');
const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
sgMail.setApiKey(keys.sendGrid.apiKey);

// Login Page
router.get('/signi',
  forwardAuthenticated,
  (req, res) => res.render('signi', { title: 'Welcome' }));

// Register Page
router.get('/signu',
  forwardAuthenticated,
  (req, res) => res.render('signu', { title: 'Register' }));

// Register
router.post('/signu',
  (req, res) => {
    const {
      firstname, lastname, gender, age, username,
      email, password, rpassword, verified,
      hobby, language, nationality, ethnicity, countryOfResidence
    } = req.body;
    let errors = [];

    if (!firstname || !lastname || !gender || !age
      || !hobby || !language || !ethnicity ||
      !nationality || !countryOfResidence || !username ||
      !email || !password || !rpassword) {
      errors.push({ msg: 'Fields cannot be empty!' });
    }

    if (age < 18) {
      errors.push({ msg: 'Must be 18 and above!' });
    }

    if (password != rpassword) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
      res.render('signu', {
        errors, firstname, lastname, gender, age,
        username, email, password, rpassword, preference,
        hobby, language, nationality, ethnicity, countryOfResidence
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('signu', {
            errors, firstname, lastname, gender,
            age, username, email, password, rpassword
          });
        } else {
          const newUser = new User({
            firstname, lastname, gender, age, username,
            email, password, verified, hobby,
            language, nationality, ethnicity , countryOfResidence
          });

          const link = 'https://matchax.herokuapp.com/verify';
          const message = {
            to: email,
            from: 'noreply@gmail.com',
            subject: 'User Verification || Matchax',
            text: 'Hi',
            html: `<strong>Welcome ${username} to Matchax!<br>Use this link : ${link}<br>to verify your account!<br>Welcome to the family!</strong>`
          };

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    `You are now registered, Verification email sent to ${email}`
                  );
                  res.redirect('/signi');
                })
                .catch(err => console.log(err));
            });
          });
          sgMail.send(message);
        }
      });
    }
  });

// Login
router.post('/signi', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/signi',
    failureFlash: true
  })(req, res, next);
  req.flash('success_msg', 'You Are Logged In')
});

// Google Auth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get('/google/callback', passport.authenticate('google'), (req, res)=> {
  User.updateOne({googleId: req.user.googleId}, { active: true }, (err, res)=> {
    if(err) throw err;
  });
  res.redirect('/profile');
});

// Logout
router.get('/logout', (req, res) => {
  User.updateOne({_id: req.user._id}, { active: false }, (err, res)=> {
    if(err) throw err;
  });
  req.logOut();
  req.flash('success_msg', 'You Are Logged Out');
  res.redirect('/');
});

module.exports = router;
