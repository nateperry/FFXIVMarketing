var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../model/user');

// load the homepage
router.get('/', function(req, res, next) {
  return res.render('login');
});

// displays new user form
router.get('/user/new', function(req, res, next) {
  return res.render('new-user');
});

// handles a new user request
router.post('/user/new', function(req, res, next) {
  var newUser = new User(req.body);
  // verify that this email does not already exist
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      newUser.save(function (err) {
        if (err) {
          return res.render('new-user', {error: 'An error occurred while saving the user. Please try again.', user: req.body});
        }
        return res.render('new-user-confirmation');
      });
    } else {
      return res.render('new-user', {error: 'Email already in use.', user: req.body});
    }
  });
});

// attemps to login a user
router.post('/user/authenticate', function(req, res) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      return res.render('login', {success: false, message: 'Authentication failed. Email and/or password may be wrong.' });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        return res.render('login', {success: false, message: 'Authentication failed. Email and/or password may be wrong.' });
      } else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, req.app.get('superSecret'), {
          expiresIn: "36h" // expires in 24 hours
        });
        // return the information including token as JSON
        return res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

module.exports = router;
