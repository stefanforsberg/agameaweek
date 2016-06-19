var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.tileSize = 32;
game.width = 960;
game.height = 640;
game.subscriptions = [];
game.offsetX = 0;
game.offsetY = 0;
game.floor1 = document.getElementById("floor1");
game.isRunning = false;
game.debug = false;

game.load = function() {

	game.song = new Howl({
		urls: ['01.mp3'],
		loop: true,
		onload: function() {
			game.song.play();
			game.init();
		}		  			
	});


}

game.keys = {
	l: false,
	r: false,
	u: false,
	d: false,
	space: false
}

game.init = function() {

	game.map.init();

	var gamePadStream = Rx.Observable.interval(1000/66).subscribe(function () {
		var gp = navigator.getGamepads()[0];
		
		game.keys.space = gp.buttons[0].pressed;

		game.keys.r = (gp.axes[0] >= 0.5);
		game.keys.l = (gp.axes[0] <= -0.5);
		game.keys.u = (gp.axes[1] <= -0.5);
		game.keys.d = (gp.axes[1] >= 0.5);
	})

	var keyDownStream = Rx.Observable.fromEvent(document, 'keydown')
		.map(function (k) {
			return { 
				keyCode: k.keyCode,
				pressed: true
			}
		});

	var keyUpStream = Rx.Observable.fromEvent(document, 'keyup')
		.map(function (k) {
			return { 
				keyCode: k.keyCode,
				pressed: false
			}
		});	

	var keyStream = Rx.Observable.merge(keyDownStream, keyUpStream);

	keyStream.subscribe(function (k) {

		console.log(k.keyCode);

		if(k.keyCode === 32) {
			game.keys.space = k.pressed
		} else if(k.keyCode === 37) {
			game.keys.l = k.pressed
		} else if(k.keyCode === 39) {
			game.keys.r = k.pressed
		} else if(k.keyCode === 38) {
			game.keys.u = k.pressed
		} else if(k.keyCode === 40) {
			game.keys.d = k.pressed
		}
	});

	game.player.init();

    game.isRunning = true;
	game.draw();
	
}

game.draw = function(t) {

	game.context.setTransform(1, 0, 0, 1, 0, 0);

	game.context.clearRect(0, 0, game.width, game.height);

	var my_gradient = game.context.createLinearGradient(0,0,0,game.height);
	my_gradient.addColorStop(0,"#cbcbcb");
	my_gradient.addColorStop(1,"#676767");
	game.context.fillStyle=my_gradient;
	game.context.fillRect(0,0,game.width,game.height);
	
	game.context.translate(- game.offsetX, - game.offsetY);
	
	game.map.draw();

	game.explosions.draw();

	game.player.draw();


		
	if(game.isRunning) {
		window.requestAnimationFrame(game.draw);
	} else {
	}
	
}


game.isOnScreenFull = function(i) {
	return game.collides(i, {x: game.offsetX, y: 0, width: game.width, height: game.height});
}

