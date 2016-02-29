/**
 * utils.js
 *
 * collection of helper functions that can be reused globally
 */

var User = require('./model/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.isValidUser = function (req, res, callback) {
  // check header or url parameters or post parameters for token
  var token = req.cookies[req.app.get('cookieName')];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        callback.call(null, false);
        return false;
      }
      // if everything is good, save to request for use in other routes
      req.user = decoded._doc;
      if (decoded._doc) {
        User.getUser(
          {_id: decoded._doc._id},
          function (user) {
            req.user = user;
            callback.call(null, true);
          },
          function () {
            res.clearCookie(req.app.get('cookieName'));
            callback.call(null, false);
          }
        )
      }
    });
  } else {
    // if there is no token
    callback.call(null, false);
    return false;
  }
};


exports.getRandomString = function (charLength) {
  if (charLength == undefined) {
    charLength = 8;
  }
  var text = "", possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < charLength; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

exports.clearToken = function (req, res) {
  res.clearCookie(req.app.get('cookieName'));
};

exports.setToken = function (req, res, user) {
  this.clearToken(req, res);
  var token = jwt.sign(user, req.app.get('superSecret'), {
    expiresIn: "36h" // expires in 36 hours
  });
  // set the cookie
  res.cookie(req.app.get('cookieName'), token, {maxAge: 129600000}); // set cookie for 36 hours
  console.log('cookie set');
};

exports.getCleanUser = function (user) {
  var clean = user;
  clean['password'] = null;
  clean['new_password'] = '';
  clean['conf_password'] = '';
  return clean;
};