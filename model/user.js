// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
  email: {type: String, trim: true, required: true},
  password: {type: String, trim: true, required: true},
  admin: Boolean,
  characters: Array,
  created_at: Number,
  updated_at: Number
});

/** ===============
 ** STATIC METHODS
 ** ===============
 **/
userSchema.statics.getUser = function (queryArgs, succesFn, errorFn) {
  this.findOne(
    queryArgs,
    function (err, docs) {
      if (err || !docs) {
        errorFn.call(null, err);
      } else {
        succesFn.call(null, docs);
      }
    }
  )
};

// on every save, pre process the data
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date().getTime();
  // hash the password
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password);
  }

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

module.exports = mongoose.model('User',userSchema);