/** =======================
 * Load our packages
 * =======================*/
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var mongo           = require('mongodb');
var mongoose        = require('mongoose');
var jwt             = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config          = require('./config'); // get our config file
var User            = require('./model/user'); // get our mongoose model

/** =======================
 * Begin Configuration
 * =======================*/
var app = express();

var db = mongoose.connect(config.database, {
  server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));

/** =======================
 * Establish our routes
 * =======================*/
var routes = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');

// Make our db accessible to our router
app.use(function(req, res, next) {
  req.db = db;
  if (mongoose.connection.readyState !== 1) {
    res.render('db-error', {
      title: 'Database Error'
    });
    return;
  }
  next();
});

app.use('/', routes);
app.use('/api', api);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
console.log('Application FFXIV Marketing Started');