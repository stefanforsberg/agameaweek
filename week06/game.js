var game = game || {};

game.width = 640;
game.height = 480;

game.offsetX = 0;
game.offsetY = 0;

game.tileSize = 32;

game.mapData = {};

game.loadMap = function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
		if ((request.readyState == 4))
		{
			game.mapData = JSON.parse(request.responseText);

			

			game.setup();
		}
    }
    request.open("GET", "map.json", true);
    request.send();
}

game.setupTileData = function() {
	game.tiles = [];

	var tiledDataCounter = 0;

	var mapLayerData = game.mapData.layers[0];

	for (var y = 0; y < mapLayerData.height; y++) {

		var xArray = [];

		for (var x = 0; x < mapLayerData.width; x++) {
			xArray.push(mapLayerData.data[tiledDataCounter])

			tiledDataCounter++;
		}

		game.tiles.push(xArray);
	}
}

game.setupObjects = function() {

	var objectLayer = game.mapData.layers[1];

	objectLayer.objects.forEach(function (o) {
		if(o.type === "monster") {
			game.monsters.items.push(new game.monster(o.x, o.y, parseFloat(o.properties.vx), parseFloat(o.properties.vy), parseInt(o.properties.minY), parseInt(o.properties.maxY)));
		} else if(o.type === "key") {
			game.pickableItems.items.push(new game.key(o.x, o.y));			
		}

	});
}

game.background = {

	init: function() {
		game.background.mountains1 = document.createElement('canvas');
	    game.background.mountains1.width = 1200;
	    game.background.mountains1.height = 480;

		game.background.mountains2 = document.createElement('canvas');
	    game.background.mountains2.width = 700;
	    game.background.mountains2.height = 450;	    

		game.background.trees = document.createElement('canvas');
	    game.background.trees.width = 1500;
	    game.background.trees.height = 450;	

	    var canvas = game.background.mountains1.getContext("2d")
	    canvas.fillStyle = "rgba(180, 180, 180, 1)"
	    var distance = game.background.mountains1.width / 8;
	    for(var i = 0; i < 8; i++) {
	    	canvas.beginPath();
	    	var width = 200 + Math.random()*distance
	    	canvas.moveTo(i*distance, 480)
	    	canvas.lineTo(i*distance + width, 480)
	    	canvas.lineTo(i*distance + width / 2, 50 + Math.random()*200)
	    	canvas.lineTo(i*distance, 480)
	    	canvas.fill();
	    }

	    canvas = game.background.mountains2.getContext("2d")
	    canvas.fillStyle = "rgba(240, 240, 240, 1)"
	    distance = game.background.mountains2.width / 8;
	    for(var i = 0; i < 8; i++) {
	    	canvas.beginPath();
	    	var width = 100+ Math.random()*145
	    	canvas.moveTo(i*distance, 425)
	    	canvas.lineTo(i*distance + width, 425)
	    	canvas.lineTo(i*distance + width / 2, Math.random()*80)
	    	canvas.lineTo(i*distance, 425)
	    	canvas.fill();
	    }	 

	    canvas = game.background.trees.getContext("2d")
	    distance = game.background.trees.width / 40;
	    for(var i = 0; i < 40; i++) {
	    	canvas.beginPath();
	    	var color = Math.round(65 + Math.random()*50);
	    	canvas.fillStyle = "rgba(" + color + ", " + color + ", " + color + ", 1)"
	    	var width = 5 + Math.random(5);
	    	var height = 85+95*Math.random();


	    	if(Math.random() < 0.5) {
	    		canvas.fillRect(i*distance, 480 , width, -height)
				canvas.arc(i*distance + width/2, 480-height, 10+Math.random()*40, 0, 2 * Math.PI, false);	
	    	} else {
	    		canvas.arc(i*distance, 480, 20+Math.random()*40, 0, 2 * Math.PI, false);	
	    		canvas.arc(i*distance + width/2, 480, 20+Math.random()*40, 0, 2 * Math.PI, false);	
	    		canvas.arc(i*distance + width, 480, 20+Math.random()*40, 0, 2 * Math.PI, false);	
	    	}
	    	canvas.fill();
	    }		       
	},
	draw: function() {

		var relativePosition = (game.background.mountains2.width - game.width) * (game.offsetX / map.naturalWidth)
		game.context.drawImage(game.background.mountains2, -relativePosition, 0)

		relativePosition = (game.background.mountains1.width - game.width) * (game.offsetX / map.naturalWidth)
		game.context.drawImage(game.background.mountains1, -relativePosition, 0)

		relativePosition = (game.background.trees.width - game.width) * (game.offsetX / map.naturalWidth)
		game.context.drawImage(game.background.trees, -relativePosition, 0)
	}
}

game.setup = function() {


	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");

	var map = document.getElementById("map");

	game.map = document.createElement('canvas');
    game.map.id     = "mapCanvas";
    game.map.width  = map.naturalWidth;
    game.map.height = map.naturalHeight;

    game.background.init();
    game.pickableItems.init();
    game.monsters.init();

    game.setupTileData();
    game.setupObjects();

    var context = game.map.getContext("2d");

    context.drawImage(map, 0, 0);

	var keyDownStream = Rx.Observable.fromEvent(document, 'keydown')
	.filter(function (k) {
		return (k.keyCode === 37 || k.keyCode === 39 || k.keyCode === 38 || k.keyCode === 40)
	})
	.map(function (k) {
		return { keyCode: k.keyCode, pressed: true };
	})

	var keyUpStream = Rx.Observable.fromEvent(document, 'keyup')
	.filter(function (k) {
		return (k.keyCode === 37 || k.keyCode === 39 || k.keyCode === 38 || k.keyCode === 40)
	})
	.map(function (k) {
		return { keyCode: k.keyCode, pressed: false };
	})

	Rx.Observable.merge(keyUpStream, keyDownStream)
		.subscribe(function (k) {


			// If player is already moving in one direction ignore keyup events for other direction
			if(game.player.vx > 0 && !k.pressed && k.keyCode === 37)  {
				return;
			}

			if(game.player.vx < 0 && !k.pressed && k.keyCode === 39)  {
				return;
			}


			switch(k.keyCode) {
				case 38:
					if(k.pressed) { game.player.jump(); }
					break;
				case 39:
					k.pressed ? game.player.vx = 4 : game.player.vx = 0;
					break;
				case 37:
					k.pressed ? game.player.vx = -4 : game.player.vx = 0;
					break;					
			}
		});

	Rx.Observable.interval(33).subscribe(function (t) {

		if(!game.player.isAlive) {
			return;
		}

		game.context.setTransform(1,0,0,1,0,0);

		game.context.clearRect(0, 0, game.width, game.height);

		game.background.draw();

		game.context.translate(- game.offsetX, - game.offsetY);

		game.context.drawImage(game.map, 0, 0)

		game.monsters.draw();

		game.pickableItems.draw();

		game.player.update(t);

		game.player.draw();



	})

	// game.sounds = [];

	// game.sounds[1] = new Howl({
 //  		urls: ['level1.mp3'],
 //  		loop: true,
 //  		onload: function() {
 //  			game.sounds[2] =new Howl({
	// 	  		urls: ['level2.mp3'],
	// 	  		loop: true,
	// 	  		onload: function() {
	// 	  			game.sounds[3] =new Howl({
	// 			  		urls: ['level3.mp3'],
	// 			  		loop: true,
	// 			  		onload: function() {
	// 			  			game.sounds[4] =new Howl({
	// 					  		urls: ['level4.mp3'],
	// 					  		loop: true,
	// 					  		onload: function() {
	// 					  			game.initLevel(1);
	// 					  		}
	// 			  			})
	// 	  				}
	// 	  			})
 	//  				}
	// 		})
	// 	}
	// })
}

game.load = function() {

	game.loadMap();

	
}

game.monsters = {
	items: [],
	init: function() {
		this.items = [];
	},
	draw: function() {
		this.items.forEach(function (i) {
			i.draw();
		});
	},
	hit: function() {
		var isHit = false;
		
		for(var i = 0; i < this.items.length; i++) {
			if(game.collides(this.items[i], game.player)) {
				isHit = true;
				break;
			}
		}

		return isHit;
	}

}

game.pickableItems = {
	items: [],
	init: function() {
		this.items = [];
	},
	draw: function() {
		this.items.forEach(function (i) {
			i.draw();
		})
	}
}

game.key = function(x,y) {
	this.x = x;
	this.y = y;
	this.w = game.tileSize;
	this.h = game.tileSize;
	this.sprite = document.getElementById("key");

	return this;
}

game.isOnScreen = function(i) {
	return game.collides(i, {x: game.offsetX, y: 0, w: game.width, h: game.height});
}

game.key.prototype.draw = function() {
	if(game.isOnScreen(this)) {
		game.context.drawImage(this.sprite, this.x, this.y);	
	}
}

game.monster = function(x, y, vx, vy, minY, maxY) {

	this.x = x;
	this.y = y;
	this.w = game.tileSize,
	this.h = game.tileSize,
	this.vx = vx;
	this.vy = vy;
	this.minY = minY;
	this.maxY = maxY;
	this.w = game.tileSize;
	this.h = game.tileSize;

	if(this.vx !== 0) {
		this.updator = this.updateVx;
	} else if(this.vy !== 0) {
		this.updator = this.updateVy;
	}
	return this;
}

game.monster.prototype.updateVy = function() {

	var tYmin = Math.floor(this.y / game.tileSize);
	var tYmax = Math.ceil(this.y / game.tileSize);

	if(this.vy > 0 && this.y > this.maxY) {
		this.vy = -1*this.vy;
	}  else if(this.vy < 0 && this.y < this.minY) {
		this.vy = -1*this.vy;
	}

	this.y += this.vy;
}

game.monster.prototype.updateVx = function() {

	var tX = Math.floor(this.x / game.tileSize);
	var tY = Math.floor(this.y / game.tileSize);

	if(game.tiles[tY+1][tX+1] == 0) {
		this.vx = this.vx * -1;
	} else if(game.tiles[tY+1][tX] == 0) {
		this.vx = this.vx * -1;
	}

	this.x += this.vx;
}

game.monster.prototype.draw = function() {

	this.updator();

	if(game.isOnScreen(this)) {
		game.context.fillStyle = "rgba(0,0,0,0.9)"
		game.context.fillRect(this.x, this.y, game.tileSize, game.tileSize);
	}


}
		
game.player = {
	vy: 0,
	vx: 0,
	x: 10,
	y: 250,
	w: game.tileSize,
	h: game.tileSize,
	isJumping: false,
	isGrounded: false,
	currentSprite: 0,
	runSprites: 8,
	sprite: document.getElementById("player"),
	previous: [],
	isAlive: true,

	init: function() {

	},
	jump: function() {

		console.log("jump")

		if(this.isGrounded) {
			this.vy = -15;
			this.isJumping = true;
			this.isGrounded = false;
		}
		
	},
	update: function(t) {

		if(!this.isAlive) {
			return;
		}

		this.vy += 0.98;

		if(this.vy > 16) {
			this.vy = 16;
		}

		if(this.vy > 0) {
			this.isJumping = false;
		}

		var tX = Math.floor(game.player.x / game.tileSize);
		var tY = Math.floor(game.player.y / game.tileSize);

		var minY = (tY)*game.tileSize;
		var maxY = (tY)*game.tileSize;

		var isHittingGround = false;

		// Allow jumping "above" screen
		if(!game.tiles[tY-1]) {

		} else {
			if(!this.isJumping)
			{
				if(this.isGrounded) {

					if(this.isHittingGround(this.y)) {
						this.vy = 0;
					} else {
						this.isGrounded = false;
					}
				}
				else if(!this.isGrounded && this.isHittingGround(this.y + this.vy)) {
					this.y = (tY+1)*game.tileSize;
					this.vy = 0;
					this.isGrounded = true;
				}	
			} else {

				if(this.isHittingCeiling(this.y + this.vy)) {
					console.log("hits roof");
					this.y = tY*game.tileSize;
					this.vy = 0.98;
				}		

				
			}

			if(this.isHittingWallLeft( (this.x+this.vx) )) {
				this.vx = 0;
				this.x = tX*game.tileSize
			}

			if(this.isHittingWallRight(this.x+this.vx)) {

				if(this.x % game.tileSize !== 0) {
					this.x = Math.floor((this.x+this.vx)/game.tileSize)*game.tileSize
				}

				this.vx = 0;
			}
		}

		this.previous.push({x: this.x, y: this.y})
		if(this.previous.length > 8) {
			this.previous.shift();
		}

		this.y += this.vy;
		this.x += this.vx;

		if(game.monsters.hit() || this.isHittingSea()) {
			this.die();
			return;
		}

		var relativeScreenPosition = {
			x: this.x - game.offsetX,
			y: this.y - game.offsetY,
		} 

		if(relativeScreenPosition.x > 400) {
			game.offsetX+=4;
		} else if(relativeScreenPosition.x < 172 && game.offsetX >= 4) {
			game.offsetX-=4;
		}

		if(this.vy !== 0) {
			this.currentSprite = this.runSprites;
		}
		else if(this.vx > 0 || this.vy > 0) {
			if(t % 4 === 0) {
				this.currentSprite++;
				if(this.currentSprite > (this.runSprites-1)) {
					this.currentSprite = 0;
				}	
			}
		} else {
			this.currentSprite = 0;
		}
	},
	isHittingGround: function(y) {
		var tX = Math.floor(this.x / game.tileSize);
		var tY = Math.floor(y / game.tileSize);

		// Does the player occupy one square or two?
		if(game.player.x % game.tileSize === 0) {
			return (game.tiles[tY+1][tX] != 0);
		} else {
			return (game.tiles[tY+1][tX] != 0 || game.tiles[tY+1][tX+1] != 0)	
		}
	},
	isHittingCeiling: function(y) {
		var tX = Math.floor(this.x / game.tileSize);
		var tY = Math.floor(y / game.tileSize);

		// Does the player occupy one square or two?
		if(game.player.x % game.tileSize === 0) {
			return (game.tiles[tY][tX] != 0);
		} else {
			return (game.tiles[tY][tX] != 0 || game.tiles[tY][tX+1] != 0)	
		}
	},	
	isHittingWallLeft: function(x) {
		var tX = Math.floor(x / game.tileSize);
		var tY = Math.floor(this.y / game.tileSize);

		// Does the player occupy one square or two?
		if(game.player.y % game.tileSize === 0) {
			return (game.tiles[tY][tX] != 0);
		} else {
			return (game.tiles[tY][tX] != 0 || game.tiles[tY+1][tX] != 0)	
		}
	},
	isHittingWallRight: function(x) {
		var tX = Math.floor((x + game.tileSize-1)  / game.tileSize);
		var tY = Math.floor(this.y / game.tileSize);

		// Does the player occupy one square or two?
		if(game.player.y % game.tileSize === 0) {
			return (game.tiles[tY][tX] != 0);
		} else {
			return (game.tiles[tY][tX] != 0 || game.tiles[tY+1][tX] != 0)	
		}
	},	
	isHittingSea: function() {
		var tX = Math.floor(game.player.x / game.tileSize);
		var tY = Math.floor((game.player.y + game.tileSize + 1) / game.tileSize);

		return game.tiles[tY] && game.tiles[tY][tX] === 4;
	},
	die: function() {
		this.isAlive = false;
		this.currentSprite = 9;

		game.context.font="50px Arial";
		game.context.textAlign="center"; 
		game.context.fillStyle="#000000";
		game.context.fillText("You are dead.",game.offsetX + 320, 220);
	},
	draw: function() {

		if(this.vx !== 0 || this.vy !== 0)
		{
			for(var i = this.previous.length-1; i >= 0; i--) {
				game.context.save();
				game.context.fillStyle = "rgba(255,255,255," + 0.5*i/30 + ")";
				game.context.fillRect(this.previous[i].x, this.previous[i].y, game.tileSize, game.tileSize);			
				game.context.restore();
			}
		}

		game.context.drawImage(this.sprite, [this.currentSprite*game.tileSize], 0, game.tileSize, game.tileSize, this.x, this.y, game.tileSize, game.tileSize);
	}
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
