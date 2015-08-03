var express = require('express');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('./dependencies/auth');

var index = require('./routes/index');
var search = require('./routes/search');
var auth = require('./routes/auth');
var crawlerfeed = require('./routes/crawlerfeed');
var feed = require('./routes/feed');

var app = express();

// initialize mongo connection
mongoose.connect('mongodb://10.129.254.29/haveeruexaminer');
var conn = mongoose.connection;
// export mongo connection object
app.mongod = conn;

// configure express to trust nginx headers
app.enable('trust proxy');

// setup secure sessions
app.use(session({
    secret: 'some secret',
  	resave: false,
  	saveUninitialized: false,
  	cookie: { secure: true },
    store: new MongoStore({ 
    	mongooseConnection: conn, 
    	ttl: 1 * 1 * 5 * 60 
    })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//setup logging
var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize passport authentication and use with sessions
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/search', search);
app.use('/auth', auth);
app.use('/crawlerfeed', crawlerfeed);
app.use('/feed', feed);

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