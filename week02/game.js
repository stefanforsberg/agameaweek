var game = game || {};

game.init = function() {
	game.settings = {
		width: 640,
		height: 480,
		isRunning: false
	}
	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");
}

game.start = function() {
	if(game.settings.isRunning) {
		game.sources.gameEnded.onNext(true);
	}

	game.settings.isRunning = true;

	game.subscriptions = [];

	var gameEnded = new Rx.Subject();

	game.sources = {
		gameEnded: gameEnded,
		mouseMove: Rx.Observable.fromEvent(game.canvas, 'mousemove').takeUntil(gameEnded).map(game.mapForMouseCoords),
		mouseClick: Rx.Observable.fromEvent(game.canvas, 'click').takeUntil(gameEnded).map(game.mapForMouseCoords),
		keyDown: Rx.Observable.fromEvent(document, 'keydown').takeUntil(gameEnded),
		keyUp: Rx.Observable.fromEvent(document, 'keyup').takeUntil(gameEnded),
		tick: Rx.Observable.interval(33).takeUntil(gameEnded)
	}

	game.score.reset();

	game.subscriptions.push(game.sources.gameEnded.subscribe(function (x) {
		game.dispose();
		game.sounds.song.pause();
		game.settings.isRunning = false;
	}));

	game.sounds.song.loop = true;
	game.sounds.song.currentTime = 0;
	game.sounds.song.play();

	game.player.init();
	game.asteroids.init();
	game.stars.init();
	game.gun.init();

	game.subscriptions.push(game.sources.tick.subscribe(function () {
		game.context.fillStyle = "#000012";
		game.context.fillRect(0,0,game.settings.width,game.settings.height);
		
		game.stars.draw();
		game.asteroids.draw();
		game.gun.draw();
		game.player.draw();
	}));	
}

game.collides = function colCheck(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.w / 2)) - (shapeB.x + (shapeB.w / 2));
    var vY = (shapeA.y + (shapeA.h / 2)) - (shapeB.y + (shapeB.h / 2));
    var hWidths = (shapeA.w / 2) + (shapeB.w / 2);
    var hHeights = (shapeA.h / 2) + (shapeB.h / 2);

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        return true;
    }
    return false;
};

game.mapForMouseCoords = function(m) {
	return {
		x: (m.pageX - game.canvas.offsetLeft),
		y: (m.pageY - game.canvas.offsetTop)
	};
}

game.score = {
	score: 0,
	scoreElement: document.querySelector(".score span"),
	reset: function() {
		this.score = 0;
		this.scoreElement.innerHTML = this.score;
	},
	update: function() {
		this.score++;
		this.scoreElement.innerHTML = this.score;
	}
}	

game.sounds = {
	explode: new Audio('explode.mp3'),
	song: new Audio('song.ogg')
}

game.dispose = function () {
	game.player.dispose();
	game.asteroids.dispose();
	game.gun.dispose();

	game.subscriptions.forEach(function (i) {
		i.dispose();
	})
}	