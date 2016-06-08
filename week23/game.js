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

game.load = function() {
	game.init();
}

game.keys = {
	l: false,
	r: false,
	u: false,
	d: false
}

game.init = function() {

	game.map.init();

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

		if(k.keyCode === 37) {
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

// var my_gradient = game.context.createLinearGradient(0,0,0,game.height);
// 		my_gradient.addColorStop(0,"#cbcbcb");
// 		my_gradient.addColorStop(1,"#676767");
// 		game.context.fillStyle=my_gradient;
// 		game.context.fillRect(0,0,game.width,game.height);
		game.context.fillStyle="#676767";
		game.context.fillRect(0,0,game.width, game.height);
	
	game.context.translate(- game.offsetX, - game.offsetY);
	
	game.map.draw();

	game.player.draw();
		
	if(game.isRunning) {
		window.requestAnimationFrame(game.draw);
	} else {
	}
	
}


game.isOnScreenFull = function(i) {
	return game.collides(i, {x: game.offsetX, y: 0, width: game.width, height: game.height});
}

game.collides = function colCheck(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));
    var vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));
    var hWidths = (shapeA.width / 2) + (shapeB.width / 2);
    var hHeights = (shapeA.height / 2) + (shapeB.height / 2);

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        return true;
    }
    return false;
};