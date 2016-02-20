// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  admin: Boolean,
  characters: Array,
  created_at: Number,
  updated_at: Number
});

// on every save, pre process the data
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date().getTime();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

module.exports = mongoose.model('User',userSchema);