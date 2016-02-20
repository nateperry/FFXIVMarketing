var express = require('express');
var router = express.Router();
var Transaction = require('../model/transaction.js');

router.get('/', function (req, res, next) {
  console.log('loading dashboard');
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user
  });
});

/* GET home page. */
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

module.exports = router;
