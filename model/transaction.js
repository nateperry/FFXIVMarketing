var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/*{
  "name": "Weak Silencing Potion",
  "price_listed": 1000,
  "price_sold": 950,
  "quantity": 10,
  "date_listed": 1451088000,
  "date_sold": 1451088000
};*/

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

transactionSchema.methods.isSold = function () {
  return (this.price_sold > 0 && this.date_sold);
};

// on every save, pre process the data
transactionSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date().getTime();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;