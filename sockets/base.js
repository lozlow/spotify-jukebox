module.exports = function (io, sPlayer) {
  'use strict';

  io.on('connection', function (socket) {

    var track = sPlayer.player.getCurrentTrack();
    track.currSecond = sPlayer.player.getCurrentSecond();

    socket.emit('init', {
      track: track,
      playlist: sPlayer.queue.getQueue(),
      playerState: sPlayer.player.getState()
    });

    sPlayer.player.on('playerStateChange', function(state) {
      socket.emit('playerStateChange', state);
    });

    sPlayer.player.on('playerSeeking', function(time) {
      socket.emit('playerSeeking', time);
    });

    sPlayer.player.on('trackEnded', function() {
      socket.emit('trackEnded');
    });

    sPlayer.player.on('trackChanged', function(track) {
      socket.emit('trackChanged', track);
    });

    sPlayer.player.on('timeChanged', function(time) {
      socket.emit('timeChanged', time);
    });

    sPlayer.queue.on('trackEnqueued', function(track, idx) {
      socket.emit('trackEnqueued', track, idx);
    });

    sPlayer.queue.on('trackRemoved', function(track, idx) {
      socket.emit('trackRemoved', track, idx);
    });

    sPlayer.queue.on('queueCleared', function() {
      socket.emit('queueCleared');
    });

    socket.on('player:cmd:play', function () {
      sPlayer.player.resume();
    });

    socket.on('player:cmd:pause', function () {
      sPlayer.player.pause();
    });

    socket.on('player:cmd:skip', function () {
      sPlayer.skip();
    });

    socket.on('player:cmd:seek', function (time) {
      sPlayer.player.seek(time);
    });

  });

};

