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
  var numCharacters = 0, numRetainers = 0;
  for (var i=0; i < req.user.characters.length; i++) {
    numCharacters++;
    for (var j=0; j < req.user.characters[i].retainers.length; j++) {
      numRetainers++;
    }
  }
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user,
    numCharacters: numCharacters,
    numRetainers: numRetainers
  });
});


/**
 * User Profile
 */
router.get('/profile', function (req, res) {
  var jsonUser = utils.getCleanUser(req.user);
  res.render('profile', {user: req.user, userJSON: JSON.stringify(jsonUser)});
});

router.post('/profile', function (req, res) {
  var jsonUser = utils.getCleanUser(req.user);
  var errors = [], data = {updated_at: new Date().getTime()};
  // TODO: add more validation;
  // validate email uniqueness
  if (req.body.email.trim()) {
    User.findOne({email: req.body.email.trim()}, function (err, user) {
      if (err || !user) {
        return res.render('profile', {user: req.user, userJSON: JSON.stringify(jsonUser), errors:['An error occurred updating your profile in the database. Please try again.']});
      }
      // if a user is found, make sure the requested user is the same as the authenticated user
      if (user._id != req.body.user_id) {
        errors.push('A user with that email already exists.');
        return res.render('profile', {user: req.user, userJSON: JSON.stringify(jsonUser), errors: errors});
      }
      data['email'] = req.body.email.trim();
      // validate password
      if (req.body.new_password) {
        if (req.body.new_password.trim() !== req.body.conf_password.trim()) {
          errors.push('Passwords must match');
        } else {
          data['password'] = bcrypt.hashSync(req.body.new_password.trim());
        }
      }
      // check for any characters and retainers
      if (req.body['character_name']) {
        data['characters'] = [];
        // ensure that characters is an array
        var characters = (typeof req.body['character_name'] == 'string'? [req.body['character_name']] : req.body['character_name']);
        for (var i = 0; i < characters.length; i++) {
          var char = {};
          char['_id'] = i;
          char['character_name'] = characters[i];
          char['retainers'] = [];
          var retainers = (typeof req.body[i+'_retainer_name'] == 'string'? [req.body[i+'_retainer_name']] : req.body[i+'_retainer_name']);
          if (retainers) {
            for (var j = 0; j < retainers.length; j++) {
              var ret = {};
              ret['_id'] = j;
              ret['retainer_name'] = retainers[j];
              char['retainers'].push(ret);
            }
            data['characters'].push(char);
          } else {
            errors.push('At least 1 retainer is required');
          }
        }
      } else {
        errors.push('At least 1 character and retainer is required');
      }
      if (errors.length > 0) {
        // dont update the user if there are errors
        return res.render('profile',{user: req.user, userJSON: JSON.stringify(jsonUser), errors: errors});
      }
      User.update({_id: req.user._id}, data, {}, function (err) {
        if (err) {
          return res.render('profile', {user: req.user, userJSON: JSON.stringify(jsonUser), errors:['An error occurred updating your profile in the database. Please try again.']});
        }
        User.findOne({_id: req.user._id}, function (err, user) {
          if (err) {
            return res.render('profile', {user: req.user, userJSON: JSON.stringify(jsonUser), errors:['An error occurred updating your profile in the database. Please try again.']});
          }
          utils.setToken(req, res, user);
          res.render('profile', {user: user, userJSON: JSON.stringify(utils.getCleanUser(user)), success: true});
        });
      });
    });
  } else {
    errors.push('Email is required');
    return res.render('profile',{user: req.user, userJSON: JSON.stringify(jsonUser), errors: errors});
  }
});

/**
 * Route Middleware
 */
router.use(function (req, res, next) {
  if (req.user.characters.length < 1) {
    return res.render('no-characters', {user: req.user});
  }
  next();
});

/**
 * Sales Table
 */
router.get('/sales', function (req, res) {
  res.redirect('/app/sales/0/0');
});

router.get('/sales/:character_id/:retainer_id', function (req, res, next) {
  var character = req.user.characters[req.params.character_id];
  var retainer = character.retainers[req.params.retainer_id];
  Transaction.getSalesByRetainer(req.user, character, retainer, function (user) {
    res.render('sales', {
      title: 'Sales',
      user: req.user,
      character: character,
      retainer: retainer,
      transactions: JSON.stringify(user)
    });
  }, function (err) {
    throw err;
  });
});

module.exports = router;
