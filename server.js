// server setup
var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var multer = require('multer');
var flash = require('connect-flash');
var expressValidator = require('express-validator');

//db
var mongo = require('mongodb');
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

//routes variables
var routes = require('./app/routes/index');
var users = require('./app/routes/users');

// view engine setup
app.set('views', path.join(__dirname, './app/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//general
app.use(favicon(__dirname + '/app/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(multer({ dest: './uploads' }))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//express sessions
app.use(session(
  {
    secret: 'secret',
    saveUninitialized: false,
    resave: false
  }
));

//passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//flash messages
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// pipeline
app.use(express.static(path.join(__dirname, '/app/public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

//routes
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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