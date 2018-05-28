var createError = require('http-errors');
var express = require('express');
var favicon = require('serve-favicon')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
//const MongoStore = require('mongo-connection')(session);
const MongoStore = require('connect-mongo')(session);


//manage views partials hbs
const expressHsb = require('express-handlebars');

//routes
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

//Database mongo connection
mongoose.connect('mongodb://localhost:27017/shopping');
require('./config/passport');


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

app.use(validator());

app.use(cookieParser());

app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 180 * 160 * 1000
  }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.loggin = req.isAuthenticated();
  res.locals.session = req.session;
  next();
})
//routes use
app.use('/user', userRouter);
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