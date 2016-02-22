var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var User = require('../model/user');
var Transaction = require('../model/transaction');
var utils = require('../utils');

/**
 * Dashboard
 */
router.get('/', function (req, res, next) {
  console.log('loading dashboard');
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user
  });
});

/**
 * Sales Table
 */
router.get('/sales', function (req, res, next) {
  Transaction.find({user_id: req.user._id}, function (err, docs) {
    if (err) throw err;
    res.render('sales', {
      title: 'Sales',
      user: req.user,
      transactions: JSON.stringify(docs)
    });
  });
});

/**
 * User Profile
 */
router.get('/profile', function (req, res) {
  res.render('profile', {user: req.user});
});

router.post('/profile', function (req, res) {
  var errors = [], data = {updated_at: new Date().getTime()};
  // TODO: add more validation;
  // validate email uniqueness
  if (req.body.email.trim()) {
    User.findOne({email: req.body.email.trim()}, function (err, user) {
      if (err) {
        return res.render('profile', {user: req.user, errors:['An error occurred updating your profile in the database. Please try again.']});
      }
      if (user) {
        // if a user is found, make sure the requested user is the same as the authenticated user
        if (user._id != req.user._id) {
          errors.push('A user with that email already exists.');
          return res.render('profile', {user: req.user, errors: errors});
        }
      }
      data['email'] = req.body.email.trim();
      // validate password
      if (req.body.password.trim()) {
        if (req.body.password.trim() !== req.body.conf_password.trim()) {
          errors.push('Passwords must match');
        } else {
          data['password'] = bcrypt.hashSync(req.body.password.trim());
        }
      }
      if (errors.length > 0) {
        // dont update the user if there are errors
        return res.render('profile',{user: req.user, errors: errors});
      }
      User.update({_id: req.user._id}, data, {}, function (err) {
        if (err) {
          return res.render('profile', {user: req.user, errors:['An error occurred updating your profile in the database. Please try again.']});
        }
        User.findOne({_id: req.body.user_id}, function (err, user) {
          if (err) {
            return res.render('profile', {user: req.user, errors:['An error occurred updating your profile in the database. Please try again.']});
          }
          utils.setToken(req, res, user);
          res.render('profile', {user: user, success: true});
        });
      });
    });
  } else {
    errors.push('Email is required');
    return res.render('profile',{user: req.user, errors: errors});
  }
});

module.exports = router;
