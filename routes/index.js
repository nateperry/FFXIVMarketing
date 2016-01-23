var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('transactions');
  collection.find({}, {}, function (e, docs) {
    res.render('index', { title: 'FFXIV Marketing', transactions: JSON.stringify(docs) });
  });
});

module.exports = router;
