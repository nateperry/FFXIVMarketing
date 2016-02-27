var express = require('express'),
  router = express.Router();

var Transaction = require('../model/transaction.js');

var API_Response = {
  sendSuccessResponse: function (req, res) {
    // instead of returning only the inserted object, reload the entire list
    var character = req.user.characters[(req.params.character_id || req.body.character_id)];
    var retainer = character.retainers[req.params.retainer_id || req.body.retainer_id];
    Transaction.getSalesByRetainer(
      req.user,
      character,
      retainer,
      function (users) {
        var response = {};
        response.result = "OK";
        response.transactions = users;
        console.log(response);
        res.send(response);
      },
      function (err) {
        API_Response.sendErrorResponse(req, res, "An error occurred while inserting the entry", err);
      }
    );
  },
  sendErrorResponse: function (req, res, msg, error) {
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

/**
 * Adds a new transaction
 */
router.post('/insert', function (req, res) {
  if (req.body.user_id == undefined) {
    req.body.user_id = req.user._id;
  }
  var t = new Transaction(req.body);
  t.save(function (err) {
    if (err) {
      API_Response.sendErrorResponse(req, res, "An error occurred while inserting the entry", err);
      return;
    }
    API_Response.sendSuccessResponse(req, res);
  });
});

/**
 * Update a given entry
 */
router.post('/update', function (req, res) {
  if (req.body.user_id == undefined) {
    req.body.user_id = req.user._id;
  }
  var t = new Transaction(req.body);
  Transaction.findOne({_id: req.body._id, user_id: req.body.user_id}, function (err, transaction) {
    if (err || !transaction) {
      API_Response.sendErrorResponse(req, res, "An error occurred while updating the entry", err);
      return;
    }
    Transaction.update({_id: transaction._id}, req.body, {}, function (err) {
      if (err) {
        API_Response.sendErrorResponse(req, res, "An error occurred while updating the entry", err);
        return;
      }
      API_Response.sendSuccessResponse(req, res);
    });
  });
});

/**
 * Deletes a transaction
 */
router.post('/delete', function (req, res) {
  if (!req.body.id) {
    API_Response.sendErrorResponse(req, res, "Invalid id submitted.");
    return;
  }
  Transaction.findOneAndRemove({_id: req.body.id}, function (err) {
    if (err) {
      API_Response.sendErrorResponse(req, res, "An error occurred while inserting the entry", err);
    }
    API_Response.sendSuccessResponse(req, res);
  });
});

module.exports = router;