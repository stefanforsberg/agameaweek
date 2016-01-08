var game = game || {};

game.init = function() {
	game.settings = {
		width: 384,
		height: 480,
		isRunning: false,
		tileSize: 32
	}
	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");
	game.context.imageSmoothingEnabled = false;
}

game.start = function() {

	game.speed = 33;

	game.terrain.init();

	game.loop = Rx.Observable.interval(game.speed).subscribe(function (t) {
		game.update(t);
	})

	Rx.Observable.fromEvent(document, 'keydown')
		.filter(function (k) {
			return (k.keyCode === 37 || k.keyCode === 39)
		})
		.map(function (k) {
			return k.keyCode
		})
		.scan(function (p, k) {
			if(k === 37) {
				p.x--;
			} else {
				p.x++;
			}
			return p;
		}, game.player)
		.subscribe();
}

game.update = function(t) {
	game.context.clearRect(0,0,game.settings.width,game.settings.height);
	game.player.update(t);
	game.terrain.update(t);
}

game.terrain = {
	y: -64,
	image: document.getElementById("grass"),
	baseCanvas: document.createElement("canvas"),
	context: {},
	init: function() {
		this.y = -64;
		this.baseCanvas.width = "32";
		this.baseCanvas.height = "544";
		this.context = this.baseCanvas.getContext("2d");

		for(i = 0; i < 17; i++) {
			this.context.drawImage(this.image, 0, 32*i);
		}
	},
	update: function() {
		game.context.drawImage(this.baseCanvas, 0, this.y);

		game.context.save();
		game.context.translate(game.settings.width, 0);
		game.context.scale(-1, 1);
		game.context.drawImage(this.baseCanvas, 0, this.y);
		game.context.restore();

		this.y += 4;
		if(this.y > -32) {
			this.y = -64;
		}
	}
}

game.player = {
	x: 0,
	y: 12,
	currentSprite: 0,
	sprites: [document.getElementById("witch01"), document.getElementById("witch02")],
	update: function(t) {
		game.context.drawImage(this.sprites[this.currentSprite], game.settings.tileSize + this.x*game.settings.tileSize*2, this.y*game.settings.tileSize, 64, 64);

		if(t % 10 === 0) {
			this.currentSprite++;
			if(this.currentSprite > (this.sprites.length-1)) {
				this.currentSprite = 0;
			}	
		}
		
	}
}