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

game.clouds = {
	items: [],
	init: function() {
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
		this.items.push(this.getCloud());
	},
	update: function(t) {
		this.items.forEach(function (i) {
			game.context.drawImage(i.image, i.x, i.y);	
			i.y += i.vy;
			i.x += Math.cos(Math.PI*(t + i.tDelta)*2/180) / 10;

			if(i.y > (game.settings.height + 40)) {
				i.x = game.randomNumber(0, game.settings.width);
				i.y = -1*game.randomNumber(i.height*2, i.height*4);
			}
		})
		
	},
	getCloud: function() {
		var baseCanvas = document.createElement("canvas");
		var width = game.randomNumber(90, 300);
		var height = width*1.33;
		baseCanvas.width = width;
		baseCanvas.height = height;
		var context = baseCanvas.getContext("2d");

		for(var i = 0; i < 50; i++) {
			context.beginPath();
			context.fillStyle = "rgba(255,255,255," + Math.random()/10 + ")";
			
			var ry = 1.2*game.randomNumber(height/8,height/4)
			var rx = game.randomNumber(width/8,width/4);

			context.ellipse(width/2 - (width/6) + game.randomNumber(0,width/3), height / 2 - height/6 + game.randomNumber(0,height/3), rx, ry, 0, 0, Math.PI*2)
			context.fill();
		}

		return {
			x: game.randomNumber(0, game.settings.width),
			y: -1*game.randomNumber(height*2, height*4),
			vy: 0.3 + Math.random()*Math.random(),
			tDelta: game.randomNumber(0,360),
			width: width,
			height: height,
			image: baseCanvas
		}
	}
}

game.start = function() {

	game.speed = 1;

	game.player.init();
	game.terrain.init();
	game.diamond.init();
	game.bird.init();
	game.clouds.init();

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
				if(p.x > 32) {
					p.x-= 64;
				}
			} else {
				if(p.x < 288) {
					p.x+= 64;	
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
	game.diamond.update(t);
	game.bird.update(t);
	game.clouds.update(t);
}

game.bird = {
	x: 1,
	y: 15,
	width: 32,
	height: 32,	
	sprites: [document.getElementById("bird01"), document.getElementById("bird02"),document.getElementById("bird03"),document.getElementById("bird02")],
	currentSprite: 0,	
	
	init: function() {
		this.x = 48 + game.randomNumber(0,4)*64;
		this.y = -game.randomNumber(10, 50);
		this.vy = 1+Math.random();
		this.xdeltaSize = 1 + 25*Math.random();
		this.ydeltaSize = 1 + 5*Math.random();

		console.log(this.xdeltaSize);
	},
	update: function(t) {

		if(game.collides(this,game.player)) {
			this.init();
		} else if(this.y > (game.settings.height + 20)) {
			this.init();
		}

		var xdelta = this.xdeltaSize*Math.cos(Math.PI*t*2/180);
		var ydelta = this.ydeltaSize*Math.sin(Math.PI*t*4/180);

		game.context.drawImage(this.sprites[this.currentSprite],this.x + xdelta, this.y + ydelta);

		game.context.save();
		game.context.globalAlpha=0.2;
		game.context.drawImage(this.sprites[this.currentSprite], this.x + xdelta - 10, this.y + ydelta + 30, 20, 24);
		game.context.restore();		

		if(t % 15 === 0) {
			this.currentSprite++;
			if(this.currentSprite > (this.sprites.length-1)) {
				this.currentSprite = 0;
			}	
		}

		this.y += this.vy;
	}
}

game.diamond = {
	x: 1,
	y: 15,
	width: 32,
	height: 32,
	sprites: [document.getElementById("diamond01"),document.getElementById("diamond02"),document.getElementById("diamond03"),document.getElementById("diamond04")],
	currentSprite: 0,
	init: function() {
		this.x = 48 + game.randomNumber(0,4)*64;
		this.y = 15;
		this.vy = 1 + Math.random();
	},
	update: function(t) {

		game.context.save();
		game.context.translate(this.x + (this.width/2), this.y + (this.height/2));
		game.context.rotate(t*Math.PI/180);		
		game.context.drawImage(this.sprites[this.currentSprite],-(this.width/2), -(this.height/2), 24, 24);
		game.context.restore();

		game.context.save();
		game.context.translate(this.x + (this.width/2) - 14, this.y + (this.height/2) + 30);
		game.context.rotate(t*Math.PI/180);		
		game.context.globalAlpha=0.2;
		game.context.drawImage(this.sprites[this.currentSprite],-(this.width/2), -(this.height/2), 16, 22);		
		game.context.restore();

		if(game.collides(this,game.player)) {
			this.init();
		} else if(this.y > (game.settings.height + 20)) {
			this.init();
		}

		if(t % 30 === 0) {
			this.currentSprite++;
			if(this.currentSprite > (this.sprites.length-1)) {
				this.currentSprite = 0;
			}	
		}

		this.y += this.vy;
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
	y: 384,
	width: 64,
	height: 64,
	currentSprite: 0,
	sprites: [document.getElementById("witch01"), document.getElementById("witch02")],
	init: function() {
		this.x = 160;
		this.y = 384
	},
	update: function(t) {

		var xdelta = 5*Math.cos(Math.PI*t*2/180);
		var ydelta = 5*Math.sin(Math.PI*t*4/180);

		game.context.save();
		game.context.imageSmoothingEnabled = false;
		game.context.drawImage(this.sprites[this.currentSprite], this.x + xdelta, this.y + ydelta, 64, 64);
		game.context.restore();

		game.context.save();
		game.context.globalAlpha=0.2;
		game.context.drawImage(this.sprites[this.currentSprite], this.x + xdelta - 10, this.y + ydelta + 64, 34, 34);
		game.context.restore();

		if(t % 15 === 0) {
			this.currentSprite++;
			if(this.currentSprite > (this.sprites.length-1)) {
				this.currentSprite = 0;
			}	
		}
	}
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

game.randomNumber = function(low, high) {
	return Math.floor(Math.random()*(1+high-low))+low;
}