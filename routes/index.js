var express = require('express');
var router = express.Router();

var Transaction = require('../model/transaction.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Transaction.find({}, function (err, docs) {
    if (err) throw err;
    res.render('index', { title: 'FFXIV Marketing', transactions: JSON.stringify(docs) });
  });
});

module.exports = router;
