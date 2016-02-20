/**
 * utils.js
 *
 * collection of helper functions that can be reused globally
 */

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

function isValidUser (req, callback) {
  // check header or url parameters or post parameters for token
  var token = req.cookies.ffxiv_user;
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {
      if (err) {
        callback.call(null, false);
        return false;
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded._doc;
        callback.call(null, true);
        return true;
      }
    });
  } else {
    // if there is no token
    callback.call(null, false);
    return false;
  }
}
exports.isValidUser = isValidUser;