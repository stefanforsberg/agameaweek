var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.colors = ["#ECB200", "#D96D3A", "#D44380", "#ADC800", "#671E46"]

game.tileSize = 32;
game.width = 650;
game.height = 650;
game.subscriptions = [];
game.offsetX = 0;
game.offsetY = 0;
game.floor1 = document.getElementById("floor1");

game.load = function() {
	game.loadMap(function (map) {
		game.map.init(map);
		game.init();
	})
	
}

game.keys = {
	l: false,
	r: false,
	u: false
}

game.init = function() {

	game.player.init();

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

	game.subscriptions.push(keyStream.subscribe(function (k) {
		if(k.keyCode === 37) {
			game.keys.l = k.pressed
		} else if(k.keyCode === 39) {
			game.keys.r = k.pressed
		}

		if(k.keyCode === 38) {
			game.keys.u = k.pressed
		}
	}));

	

	game.draw();

}

game.draw = function(t) {

	game.context.setTransform(1, 0, 0, 1, 0, 0);

	game.context.clearRect(0, 0, game.width, game.height);
	game.context.translate(- game.offsetX, - game.offsetY);
	game.player.update();
	game.context.drawImage(game.floor1, 0, 0)

	game.player.draw();		

	game.chars.draw();

	

	window.requestAnimationFrame(game.draw);
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

game.player = {
	img: document.getElementById("char"),
	rotation: 0,
	sprite: 0,
	x: 0,
	y: 0,
	width: game.tileSize,
	height: game.tileSize,
	spriteCounter: 0,
	init: function() {
		this.rotation = 0;
		this.sprite = 0;
		this.x = 10;
		this.y = 234;
		this.spriteCounter = 0;
	},
	update: function() {

		


		if(game.keys.l) {
			this.rotation-= 5;
		} else if(game.keys.r) {
			this.rotation+= 5;
		}

		if(game.keys.u) {

			if(this.sprite == 0) {
				this.sprite = 1;
			}

			this.spriteCounter++;

			var nx = this.x + 2*Math.cos(this.rotation*Math.PI/180)
			var ny = this.y + 2*Math.sin(this.rotation*Math.PI/180);

			if(this.spriteCounter % 5 === 0) {
				this.sprite++;	
			}

			if(this.sprite > 8) {
				this.sprite = 1;
			}


			if(nx < 0 ) {
				nx = this.x;
			}

			if(nx > 0 || ny > 0) {
				if(game.map.blocked({x: nx, y: this.y, width: game.tileSize, height: game.tileSize})) {
					nx = this.x;
				}

				if(game.map.blocked({x: this.x, y: ny, width: game.tileSize, height: game.tileSize})) {
					ny = this.y;
				}
			}

			var vx = nx - this.x;

			this.x = nx;
			this.y = ny;

			var relativeScreenPosition = {
				x: this.x - game.offsetX,
				y: this.y - game.offsetY,
			} 

			if(relativeScreenPosition.x > 400 && game.offsetX < (game.map.width-game.width))  {
				game.offsetX+= Math.abs(vx);
			} else if(relativeScreenPosition.x < 172 && game.offsetX >= 4) {
				game.offsetX-=Math.abs(vx);
			}

		} else {
			this.sprite = 0;
			this.spriteCounter = 0;
		}



	},
	draw: function() {
		game.context.save();
		
		game.context.translate(this.x + (game.tileSize/2), this.y + (game.tileSize/2));
		game.context.rotate(this.rotation*Math.PI/180);		
		game.context.drawImage(this.img, 
			this.sprite*game.tileSize, 0, game.tileSize, game.tileSize,
			-(game.tileSize/2), -(game.tileSize/2), game.tileSize, game.tileSize
			);

		game.context.restore();
	}
}