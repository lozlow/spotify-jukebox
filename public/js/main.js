var sJukebox = angular.module("SpotifyJukebox", ['btford.socket-io']);

sJukebox.factory("cntrlSocket", function (socketFactory) {
	return socketFactory();
});


sJukebox.controller("playerController", function($scope, $http, cntrlSocket) {

	$scope.trackList = [
		'spotify:track:4RM6f8gr2l6g18Do8yApco',
		'spotify:track:3yEiuajmeXMom3LtiX9BDB',
		'spotify:track:71IYtyDFjNqK8oE5JJhvF1',
		'spotify:track:2i1lpQBfu0FXQPKDwWSXLu',
		'spotify:track:2Jvs6I32wFa9EjYeWUQTnQ',
		'spotify:track:4QhcExcZ2rhtVUAvh1bbf2',
		'spotify:track:6U0Lp3wyzHFwW3V5guqoNk',
		'spotify:track:3aO2gYv32s35NZm2IkEQ1J'
	];

	var PLAYER_STATE_STOPPED = $scope.PLAYER_STATE_STOPPED = -1,
        PLAYER_STATE_PAUSED = $scope.PLAYER_STATE_PAUSED = 0,
        PLAYER_STATE_PLAYING = $scope.PLAYER_STATE_PLAYING = 1;

    $scope.currTrack = {};
    $scope.currTrack.currSecond = 0;
	$scope.playerState = PLAYER_STATE_STOPPED;
	$scope.playlist = [];

	cntrlSocket.on('playerStateChange', function(state) {
		$scope.playerState = state;
	});

	cntrlSocket.on('trackChanged', function(track) {
		$scope.currTrack = track;
    	$scope.currTrack.currSecond = 0;
	});

	cntrlSocket.on('trackEnded', function() {
    	$scope.currTrack.currSecond = 0;
	});

	cntrlSocket.on('timeChanged', function(time) {
    	$scope.currTrack.currSecond = time;
	});

	cntrlSocket.on('playerSeeking', function(time) {
    	$scope.currTrack.currSecond = time;
	});

	cntrlSocket.on('trackEnqueued', function(track, idx) {
    	$scope.playlist.splice(idx, 0, track);
	});

	cntrlSocket.on('trackRemoved', function(track, idx) {
    	$scope.playlist.splice(idx, 1);
	});

	cntrlSocket.on('queueCleared', function() {
    	$scope.playlist.splice(idx, $scope.playlist.length);
	});

	cntrlSocket.on('init', function(data) {
		$scope.currTrack = data.track;
		$scope.playerState = data.playerState;
		$scope.playlist = data.playlist;
	});

	$scope.play = function() {
		cntrlSocket.emit('player:cmd:play');
	}

	$scope.pause = function() {
		cntrlSocket.emit('player:cmd:pause');
	}

	$scope.skip = function() {
		cntrlSocket.emit('player:cmd:skip');
	}

	$scope.seek = function(time) {
		cntrlSocket.emit('player:cmd:seek', time);
	}

	$scope.queueTrack = function(track, pos) {
		$http({
            method: 'POST',
            url: '/api/queue',
            data: {
            	track: track,
            	pos: pos
            },
            headers: {'Content-Type': 'application/json'},
            timeout: 2000
        });
	}

	// http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-with-format-hhmmss
	$scope.formatTime = function (seconds) {
	    var minutes = Math.floor(seconds / 60);
	    var seconds = seconds - (minutes * 60);

	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    var time    = minutes+':'+seconds;
	    return time;
	}

});