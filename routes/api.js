var express = require('express'),
  router = express.Router();

var Transaction = require('../model/transaction.js');


router.get('/', function (req, res, next) {
  var err = new Error('Access Not Allowed');
  err.status = 403;
  next(err);
});

router.post('/insert', function (req, res, next) {
  var t = new Transaction(req.body);
  t.save(function (err) {
    var response = {};
    if (err) {
      response.result = "ERR";
      response.message = "An error occurred while inserting the entry";
      response.error = err;
      response.data = req.data;
    } else {
      response.result = "OK";
    }
    res.send(JSON.stringify(response));
  });
});

module.exports = router;