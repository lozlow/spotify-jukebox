module.exports = function(app, sPlayer) {
    'use strict';

  app.get('/api/queue/', function(req, res) {
    res.send(sPlayer.queue.getQueue());
  });

  app.post('/api/queue/next', function(req, res) {
  	var track = sPlayer.spotify.createFromLink(req.param('track'));
  	sPlayer.queue.queueNext(track);
  	res.send(200);
  });

  app.post('/api/queue/:pos?', function(req, res) {
  	var track = sPlayer.spotify.createFromLink(req.param('track'));
  	var pos = req.param('pos') || null;
  	if (req.param('pos') === 0)
  		pos = 0;
  	sPlayer.queue.enqueue(track, pos);
  	res.send(200);
  });

};


