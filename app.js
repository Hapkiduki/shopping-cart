var createError = require('http-errors');
var express = require('express');
var favicon = require('serve-favicon')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

//manage views partials hbs
const expressHsb = require('express-handlebars');

var indexRouter = require('./routes/index');

var app = express();

//Database mongo connection
mongoose.connect('mongodb://localhost:27017/shopping');


// view engine setup
app.engine('.hbs', expressHsb({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');
app.set('view engine', '.hbs');

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;