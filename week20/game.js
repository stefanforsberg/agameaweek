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

game.load = function() {
	game.init();
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

	game.player.update();

	game.context.clearRect(0, 0, game.width, game.height);
	game.context.translate(- game.offsetX, - game.offsetY);

	game.context.drawImage(document.getElementById("floor1"), 0, 0)

	game.player.draw();		



	window.requestAnimationFrame(game.draw);
}

game.player = {
	img: document.getElementById("char"),
	rotation: 0,
	sprite: 0,
	x: 0,
	y: 0,
	spriteCounter: 0,
	init: function() {
		this.rotation = 0;
		this.sprite = 0;
		this.x = 100;
		this.y = 100;
		this.spriteCounter = 0;
	},
	update: function() {

		if(game.keys.l) {
			this.rotation-= 3;
		} else if(game.keys.r) {
			this.rotation+= 3;
		}

		if(game.keys.u) {

			if(this.sprite == 0) {
				this.sprite = 1;
			}

			this.spriteCounter++;

			this.x += 2*Math.cos(this.rotation*Math.PI/180);
			this.y += 2*Math.sin(this.rotation*Math.PI/180);

			if(this.spriteCounter % 5 === 0) {
				this.sprite++;	
			}
			

			if(this.sprite > 8) {
				this.sprite = 1;
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