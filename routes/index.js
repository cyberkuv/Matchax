const express = require('express');
const router = express.Router();
const User = require('../models/user');
const MongoClient = require('mongodb').MongoClient;
const datab = require('../config/database').mongoURI;
const bcrypt = require('bcryptjs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated,
  (req, res) => res.render('index', { title: 'Matchax' }));

// Dashboard
router.get('/profile', ensureAuthenticated,
  (req, res) =>
    res.render('profile', {
      user: req.user,
      title: 'Matchax'
    })
);

// Verification { Get Verification Page }
router.get('/verify',
  (req, res) => {
    res.render('verify');
});
// Verification { Actual process }
router.post('/verify', (req, res)=> {
  MongoClient.connect(datab,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=> {
    const email = req.body.email;
    if(err)
      throw err;
    const dbObject = db.db("matchax");
    const query = { email: email };
    const change = { $set: { verified: true } };
    dbObject.collection("users").updateOne(query, change, (err, res)=> {
      if(err) throw err;
      req.flash('success_msg', 'Account Successfully Verified!');
      db.close();
    });
    res.redirect('/signi');
  });
});

// Update User Information
router.get('/update', ensureAuthenticated,
  (req, res) => {
    res.render('update', { user: req.user });
});
router.post('/update', ensureAuthenticated, (req, res)=> {
  MongoClient.connect(datab,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=> {
    let errors = [];
    const {
      firstname, lastname, username, age,
      preference, hobby, interest, language,
      nationality, countryOfResidence
    } = req.body;
    const email = req.user.email;
    if(age < 18) {
      errors.push({ msg: 'Must be 18 and above!' });
    }
    if(err) throw err;
    const dbObject = db.db("matchax");
    const query = { email: email };
    const change = { $set: { firstname: firstname, lastname: lastname, username: username, age: age,
      preference: preference, hobby: hobby, interest: interest, language: language, nationality: nationality,
      countryOfResidence: countryOfResidence } };
    dbObject.collection("users").findOneAndUpdate(query, change, (err, res)=> {
      if(err) throw err;
      req.flash('success_msg', 'Details Updated!');
      db.close();
    });
    res.redirect('/profile');
  });
});

// Profile Picture Update/Upload
router.post('/ppUpdate', (req, res)=> {
  MongoClient.connect(datab,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=> {
    const prof = req.body.profile;
    if(err) throw err;
    const dbObject = db.db("matchax");
    const query = { email: req.user.email };
    const change = { $set: { profilePic: prof } };
    dbObject.collection("users").updateOne(query, change, (err, res)=> {
      if(err) throw err;
      req.flash('success_msg', 'Image Uploaded!');
      db.close();
    });
    res.redirect('/update');
  });
});

// Adding Users Longitude and Latutude to database

// Delete
router.delete('/delete', (req, res) => {
  MongoClient.connect(datab,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=> {
    if(err) throw err;
    const dbObject = db.db("matchax");
    const query = { email: req.user.email };
    dbObject.collection("users").deleteOne(query, (err, res)=> {
      if(err) throw err;
      req.flash('success_msg', 'User Deleted!');
      db.close();
    });
    res.redirect('/signu');
  });
});

// Matches
router.get('/matches', ensureAuthenticated,
  (req, res) => {
    res.render('match', { user: req.user });
  });

// Forget password
router.get('/forgot', (req, res) => {
  res.render('forgot', { title: 'Matchax' });
});
router.post('/forgot', (req, res)=> {
});

module.exports = router;
