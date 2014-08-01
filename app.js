'use strict';

// define globals
var express = require('express'),
    io = require('socket.io'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = io.listen(server),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

// start the server
server.listen(3000);

// optional - set socket.io logging level
io.set('log level', 1000);

// view engine setup (for later)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// middleware settings
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));

// for production
app.use(express.static(__dirname +  '/public'));

var SpotifyPlayer = require('spotify-player'),
    sPlayer = new SpotifyPlayer({ appkeyFile: 'spotify_appkey.key' }, ready);

var trackList = [
  'spotify:track:6NwRJfCBxht02SYsGoevNt',
  'spotify:track:7M9TFsrpDqBLBTF4OXp0f3',
  'spotify:track:2K4uY7weA4LGJqd86UQBWw',
  'spotify:track:3OsTVKcXJTSKsdcVKQqQDB',
  'spotify:track:33QZZsdvxiKkAOij6saMp9'
]

var ready = function()  {
    trackList.forEach(function(track) {
      var spotTrack = spotify.createFromLink(track);
      sPlayer.queue.enqueue(spotTrack);
    });
};

sPlayer.spotify.login('username', 'password', false, false);

// set up our JSON API for later
require('./routes/api')(app, sPlayer);

// set up our socket server
require('./sockets/base')(io, sPlayer);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
