var express = require('express');
var router = express.Router();

var Transaction = require('../model/transaction.js');

router.get('/', function (req, res, next) {
  res.render('dashboard');
});

/* GET home page. */
router.get('/sales', function (req, res, next) {
  Transaction.find({}, function (err, docs) {
    if (err) throw err;
    res.render('sales', {transactions: JSON.stringify(docs)});
  });
});

module.exports = router;
