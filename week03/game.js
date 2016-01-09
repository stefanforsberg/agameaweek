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
	
}

game.start = function() {

	game.speed = 1;

	game.terrain.init();

	game.loop = Rx.Observable.interval(1000/66).subscribe(function (t) {
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
				if(p.x > 0) {
					p.x--;
				}
			} else {
				if(p.x < 4) {
					p.x++;	
				}
				
			}
			return p;
		}, game.player)
		.subscribe();
}

game.update = function(t) {
	game.context.clearRect(0,0,game.settings.width,game.settings.height);
	game.terrain.update(t);
	game.player.update(t);
	game.potion.update(t);
}

game.potion = {
	x: 1,
	y: 15,
	image: document.getElementById("mountain"),
	init: function() {

	},
	update: function(t) {

		game.context.drawImage(this.image,game.settings.tileSize + game.settings.tileSize/2 + this.x*game.settings.tileSize*2, this.y);

		this.y++;

	}
}

game.terrain = {
	y: -64,
	image: document.getElementById("grass"),
	baseCanvas: document.createElement("canvas"),
	context: {},
	init: function() {
		this.y = -64;
		this.baseCanvas.width = game.settings.width;
		this.baseCanvas.height = game.settings.height + game.settings.tileSize*2;
		this.context = this.baseCanvas.getContext("2d");

		var waterPattern = this.context.createPattern(document.getElementById("water") ,"repeat");
		this.context.rect(0,0,this.baseCanvas.width,this.baseCanvas.height);
		this.context.fillStyle = waterPattern;
		this.context.fill();

		for(i = 0; i < 17; i++) {
			this.context.drawImage(this.image, 0, 32*i);
		}

		this.context.save();
		this.context.translate(game.settings.width, 0);
		this.context.scale(-1, 1);

		for(i = 0; i < 17; i++) {
			this.context.drawImage(this.image, 0, 32*i);
		}
		
		this.context.restore();

		
	},
	update: function() {

		game.context.fillStyle = "#A5E1FF";
		game.context.fillRect(0,0,game.settings.width, game.settings.height);

		game.context.drawImage(this.baseCanvas, 0, this.y);

		this.y += game.speed;
		if(this.y > -32) {
			this.y = -64;
		}
	}
}

game.player = {
	x: 2,
	y: 12,
	currentSprite: 0,
	sprites: [document.getElementById("witch01"), document.getElementById("witch02")],
	update: function(t) {

		var xdelta = 5*Math.cos(Math.PI*t*2/180);
		var ydelta = 5*Math.sin(Math.PI*t*4/180);

		game.context.save();
		//game.context.imageSmoothingEnabled = false;
		game.context.drawImage(this.sprites[this.currentSprite], game.settings.tileSize + this.x*game.settings.tileSize*2 + xdelta, this.y*game.settings.tileSize + ydelta, 64, 64);
		game.context.restore();

		if(t % 10 === 0) {
			this.currentSprite++;
			if(this.currentSprite > (this.sprites.length-1)) {
				this.currentSprite = 0;
			}	
		}
		
	}
}