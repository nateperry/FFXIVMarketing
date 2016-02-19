var express = require('express'),
  router = express.Router();

var Transaction = require('../model/transaction.js');

var API_Response = {
  sendSuccessResponse: function (res) {
    // instead of returning only the inserted object, reload the entire list
    Transaction.find({}, function (err, docs) {
      var response = {};
      if (err) {
        API_Response.sendErrorResponse(res, "An error occurred while inserting the entry", req, err);
        return;
      }
      response.result = "OK";
      response.transactions = docs;
      res.send(response);
    });
  },
  sendErrorResponse: function (res, msg, req, error) {
    var response = {};
    response.result = "ERR";
    response.message = msg;
    if (req) {
      response.data = req.data;
    }
    if (error) {
      response.error = error;
    }
    res.send(response);
  }
};

router.all('/', function (req, res, next) {
  var err = new Error('Access Not Allowed');
  err.status = 403;
  res.render('error', {
    message: err.message,
    error: err
  });
});

router.post('/insert', function (req, res) {
  var t = new Transaction(req.body);
  t.save(function (err) {
    if (err) {
      API_Response.sendErrorResponse(res, "An error occurred while inserting the entry", req, err);
      return;
    }
    API_Response.sendSuccessResponse(res);
  });
});

router.post('/delete', function (req, res) {
  if (!req.body.id) {
    API_Response.sendErrorResponse(res, "Invalid id submitted.", req);
    return;
  }
  Transaction.findOneAndRemove({_id: req.body.id}, function (err) {
    if (err) {
      API_Response.sendErrorResponse(res, "An error occurred while inserting the entry", req, err);
    }
    API_Response.sendSuccessResponse(res);
  });
});

module.exports = router;