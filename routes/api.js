var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var err = new Error('Access Not Allowed');
  err.status = 403;
  next(err);
});

router.get('/insert', function(req, res, next) {
  res.send('inserting:');
});

module.exports = router;