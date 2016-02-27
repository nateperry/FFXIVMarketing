var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var transactionSchema = new Schema({
  date_listed: {type: Number, required: true},
  date_sold: Number,
  high_quality: Boolean,
  name: {type: String, required: true},
  price_listed: {type: Number, required: true},
  price_sold: Number,
  quantity: {type: Number, required: true},
  user_id: {type: String, required: true},
  character_id: {type: String, required: true},
  retainer_id: {type: String, required: true},
  created_at: Number,
  updated_at: Number
});

/** ===============
 ** STATIC METHODS
 ** ===============
 **/


/**
 * Retreive all sales for the current request's retainer
 * @param user - the user to look for
 * @param character - the character to look for
 * @param retainer - the retainer to look for
 * @param successFn - what to do when complete
 * @param errorFn - what to do event of error
 */
transactionSchema.statics.getSalesByRetainer = function (user, character, retainer, successFn, errorFn) {
  this.find({
    user_id: user._id,
    character_id: character._id,
    retainer_id: retainer._id
  }, function (err, docs) {
    if (err) {
      errorFn.call(null, err);
      return;
    }
    successFn.call(null, docs);
  });
};

/** ===============
 ** INSTANCE METHODS
 ** ===============
 **/
transactionSchema.methods.isSold = function () {
  return (this.price_sold > 0 && this.date_sold);
};

transactionSchema.methods.salePrice = function () {
  return this.price_listed * this.quantity;
};

transactionSchema.methods.taxAmount = function () {
  return (this.salePrice() - this.price_sold);
};

transactionSchema.methods.taxRate = function () {
  return (this.taxAmount() / this.salePrice());
};

/** ===============
 ** EVENT HANDLERS
 ** ===============
 **/
// on every save, pre process the data
transactionSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date().getTime();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.created_at = currentDate;
  }

  // sanitize some values

  if (this.quantity < 1) {
    this.quantity = 1;
  }

  if (this.date_listed > this.date_sold) {
    this.date_sold = this.date_listed;
  }

  if (this.price_listed < this.price_sold) {
    this.price_sold = this.price_listed;
  }

  next();
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;