var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookie_session = require('cookie-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var keys = require('./config/keys');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// passport configuration
require('./config/passport')(passport);
require('./config/google');

// DB Config
const datab = require('./config/database').mongoURI;

mongoose.connect(datab,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
.then(() => console.log('[MLab Connected]'))
.catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Cookie Session
app.use(cookie_session({
  maxAge: 24 * 60 * 60 * 100,
  keys: [keys.session.cookieKey]
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', indexRouter);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Socket Connection
io.on('connection', function(socket) {
  console.log('[A User Connected]');
  socket.on('sender', (snd)=> {
    io.emit('sender', snd);
  });
  socket.on('reciever', (recv)=> {
    io.emit('reciever', recv);
  });
  socket.on('message', (msg)=> {
    io.emit('message', msg);
  });
  socket.on('disconnect', function() {
    console.log('[User Disconnected]');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, ()=> { console.log(`[Listening on http://localhost:${port}]`) });
