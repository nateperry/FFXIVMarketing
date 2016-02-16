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
      // instead of returning only the inserted object, reload the entire list
      Transaction.find({}, function (err, docs) {
        if (err) throw err;
        response.transactions = docs;
        res.send(response);
      });
    }
  });
});

module.exports = router;