var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var err = new Error('Access Not Allowed');
  err.status = 403;
  next(err);
});

router.get('/insert', function(req, res, next) {
  var db = req.db;
  var collection = db.get('transactions');
  //var obj = {"name": "Weak Silencing Potion","price_listed": 1000, "price_sold": 950,"quantity": 10,"date_listed": 1451088000,"date_sold": 1451088000};
  collection.insert(req.data, function (err) {
    var response = {};
    if (err) {
      response.result = "OK";
      response.message = "An error occurred while inserting the entry";
      throw err;
    } else {
      response.result = "OK";
    }
    res.send(JSON.stringify(response));
  });
});

module.exports = router;