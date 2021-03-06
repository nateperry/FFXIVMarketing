// establish our environment
var env = process.env.NODE_ENV || 'development';
/** =======================
 * Load our packages
 * =======================*/
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var hbs             = require('hbs');
var morgan          = require('morgan');
var mongo           = require('mongodb');
var mongoose        = require('mongoose');
var config          = require('./config')[env]; // get our config file
var utils           = require('./utils');

/** =======================
 * Begin Configuration
 * =======================*/
var app = express();

var db = mongoose.connect(config.database, {
  server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// secret variable
app.set('superSecret', config.secret);
app.set('cookieName', config.cookieName);
app.set('registration-phrase', config.registration_secret);

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
if (env == 'development') {
  app.use(require('node-compass')({mode: 'expanded'}));
}
app.use(express.static(path.join(__dirname, 'public')));

/** =======================
 * Establish our routes
 * =======================*/
var dashboard = require('./routes/dashboard');
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

app.use('/', users);
/** =======================
 * Route middleware to authenticate and check token
 * =======================*/
app.use(function (req, res, next) {
  utils.isValidUser(req, res, function (valid) {
    if (valid) {
      req.app.set("view options", { layout: "layout-app.hbs" });
      next();
    } else {
      if (req.xhr) {
        res.send({
          result: "ERR",
          message: "Validation Error\n\nYour session may have timed out. You will be redirected to the login in screen.",
          terminate: true // will trigger a redirect client side
        })
      } else {
        res.redirect('/');
      }
    }
  });
});
app.use('/app', dashboard);
app.use('/api', api);

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
      error: err,
      user: req.user
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    user: req.user
  });
});


module.exports = app;
console.log('Application FFXIV Marketing Started');