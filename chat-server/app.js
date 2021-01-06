var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var sessionMiddleware = session({
  secret: "as,uy;5641fs.,/#@!scuHJG",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 4 * 7 * 24 * 60 * 60 * 1000 },
});
var logger = require('morgan');

// express app routers
var indexRouter = require('./routes/index');

// express app
var app = express();

// socket app
var socketApp = require('./socket-app');
socketApp.bindSession(sessionMiddleware);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

// bind express app routers
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
