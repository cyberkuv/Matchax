const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const MongoClient = require('mongodb').MongoClient;
const datab = require('../config/database').mongoURI;
// const bcrypt = require('bcryptjs');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated,
  (req, res) => res.render('index', { title: 'Matchax' }));

// Dashboard
router.get('/profile', ensureAuthenticated, (req, res)=> {
  MongoClient.connect(datab, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db)=> {
    const dbo = db.db("matchax");
    dbo.collection("users").find({}).toArray(function (err, data) {
      if(err) throw err;
      res.render('profile', { user: req.user, title: 'MatchYa', obj: data });
      db.close();
    });
  });
})

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
      db.close();
    });
    req.flash('success_msg', 'Account Successfully Verified!');
    res.redirect('/');
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
      min, max, hobby, first, second, third, fourth, fifth,
      ethnicity, language, nationality, countryOfResidence, bio
    } = req.body;
    const email = req.user.email;
    if(age < 18) {
      errors.push({ msg: 'Must be 18 and above!' });
    }
    if(err) throw err;
    const dbObject = db.db("matchax");
    const query = { email: email };
    const change = { $set: { firstname: firstname, lastname: lastname, username: username, age: age,
      prefAge: { min: min, max: max }, hobby: hobby,
      interest: { first: first, second: second, third: third, fourth: fourth, fifth: fifth }, ethnicity: ethnicity,
      language: language, nationality: nationality, countryOfResidence: countryOfResidence, bio: bio } };
    dbObject.collection("users").findOneAndUpdate(query, change, (err, res)=> {
      if(err) throw err;
      db.close();
    });
    req.flash('success_msg', 'Details Updated!');
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
      db.close();
    });
  });
  req.flash('success_msg', 'Image Uploaded!');
  res.redirect('/update');
});

// Delete Profile Pic
router.post('/delPic', (req, res)=> {
  MongoClient.connect(datab,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=> {
    if(err) throw err;
    const dbObject = db.db("matchax");
    const query = { email: req.user.email };
    const change = { $set: { profilePic: '' } };
    dbObject.collection("users").updateOne(query, change, (err, res)=> {
      if(err) throw err;
      db.close();
    });
  });
  req.flash('success_msg', 'Profile picture removed, default profile assigned!');
  res.redirect('/profile');
});

// Adding Users Longitude and Latutude to database
router.post('/location', (req, res)=> {
  MongoClient.connect(datab,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, db)=> {
    let errors = [];
    const { country, state, city, longitude, latitude } = req.body;
    if(!country || !state || !city || !longitude || !latitude) {
      errors.push({ msg: 'Fields Cannot Be Empty!' });
    }
    if(err) throw err;
    const dbObject = db.db("matchax");
    const query = { email: req.user.email };
    const change = { $set: { countryOfResidence: country, state: state, city: city, longitude: longitude, latitude: latitude } };
    dbObject.collection("users").updateOne(query, change, (err, res)=> {
      if(err) throw err;
      db.close();
    });
  });
  req.flash('success_msg', 'User Location Saved!');
  res.redirect('/update');
});

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
      db.close();
    });
  });
  req.flash('success_msg', 'So sad to see you leaving us so soon');
  res.redirect('/');
});

// Matches
router.get('/matches', ensureAuthenticated, (req, res)=> {
  MongoClient.connect(datab, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db)=> {
    const dbo = db.db("matchax");
    dbo.collection("users").find({}).toArray(function (err, matches) {
      if(err) throw err;
      var match = matches.filter(function(val) {
        return val;
      });
      res.render('match', { user: req.user, title: 'MatchYa', matches: match });
      db.close();
    });
  });
});

const Message = require('../models/message');

router.get('/chats', ensureAuthenticated, (req, res)=> {
  Message.find({}, (err, msg)=> {
    if(err) throw err;
    res.render('chat', { user: req.user, message: msg});
  });
});
router.post('/chats', ensureAuthenticated, (req, res)=> {
  var msg = new Message(req.body);
  msg.save((err)=> {
    if(err)
      sendStatus(500);
    res.sendStatus(200);
  })
});

// N2otifications
router.get('/notification', ensureAuthenticated, (req, res)=> {
  Notification.find({userId: req.user._id, status: 0}, (err, notif)=> {
    if(err) throw err;
    res.send(notif);
  });
});

// Forget password
router.get('/forgot', (req, res) => {
  res.render('forgot', { title: 'Matchax' });
});
router.post('/forgot', (req, res)=> {
});

module.exports = router;
