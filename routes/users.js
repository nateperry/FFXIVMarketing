var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var User = require('../model/user');
var utils = require('../utils');

// load the homepage
router.get('/', function(req, res, next) {
  req.app.set("view options", { layout: "layout.hbs" });
  utils.isValidUser(req, function (valid) {
    if (valid) {
      return res.redirect('/app');
    } else {
      return res.render('login');
    }
  });
});

/**
 * New User
 */
router.get('/user/new', function(req, res, next) {
  return res.render('new-user');
});

// handles a new user request
router.post('/user/new', function(req, res, next) {
  // validate the user
  var errors = [];
  if (!req.body.email.trim()) {
    errors.push('Email address is required');
  }
  if (!req.body.password.trim()) {
    errors.push('Password is required');
  }
  if (req.body.password !== req.body.conf_password) {
    errors.push('Password mismatch');
  }
  if (req.body.password.trim().length < 8) {
    errors.push('Passwords must be at least 8 characters long');
  }
  if (req.body.secret_phrase.trim() !== req.app.get('registration-phrase')) {
    errors.push('Incorrect secret phrase');
  }
  // check for any errors
  if (errors.length > 0) {
    return res.render('new-user', {errors: errors, user: req.body});
  }

  var newUser = new User(req.body);
  // verify that this email does not already exist before attempting to insert
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) throw err;
    if (!user) {
      newUser.save(function (err) {
        if (err) {
          return res.render('new-user', {errors: ['An error occurred while saving the user. Please try again.'], user: req.body});
        }
        return res.render('new-user-confirmation');
      });
    } else {
      return res.render('new-user', {errors: ['Email already in use.'], user: req.body});
    }
  });
});

/**
 * Logout
 */
router.get('/user/logout', function (req, res, next) {
  utils.clearToken(req, res);
  res.redirect('/');
});

/**
 * Password Reset
 */

router.get('/user/reset', function (req, res, next) {
  res.render('password-reset');
});

router.post('/user/reset', function (req, res, next) {
  var errorMessage = 'No user with that email was found.';
  User.findOne({
    email: req.body.email
  },
  function(err, user) {
    if (!user || err) {
      return res.render('password-reset', {success: false, message: errorMessage });
    } else if (user) {
      var pass = utils.getRandomString();
      User.update({_id: user._id}, {password: bcrypt.hashSync(pass)}, {}, function (err) {
        if (err) {
          return res.render('password-reset', {success: false, message: 'An error occurred, and your password was not reset correctly. Please try again.' });
        }
        var Emailer = require('../utilities/emailer');
        Emailer.sendPasswordReset(user.email, pass, function (success) {
          if (success) {
            return res.render('password-reset', {success: true, email:user.email});
          }
          return res.render('password-reset', {success: false, message:'An error occurred while sending you an email. Please try again.'});
        });
      });
    }
  });
});

/**
 * User Authentication
 */
// attempts to login a user
router.post('/user/authenticate', function(req, res) {
  var errorMessage = 'Authentication failed. Email and/or password may be wrong.';
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      return res.render('login', {success: false, message: errorMessage });
    } else if (user) {
      // check if password matches
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // if user is found and password is right
        // create a token
        utils.setToken(req, res, user);
        // return the information including token as JSON
        return res.redirect('/app');
      }
      return res.render('login', {success: false, message: errorMessage });
    }
  });
});

module.exports = router;
