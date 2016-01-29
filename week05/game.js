var game = game || {};

game.loadMap = function(callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    	console.log(request.status);
		if ((request.readyState == 4))
		{
			var parsedMapData = JSON.parse(request.responseText).layers[0];
			console.log(parsedMapData);

			game.tiles = [];

			var tiledDataCounter = 0;

			for (var y = 0; y < parsedMapData.height; y++) {

				var xArray = [];

				for (var x = 0; x < parsedMapData.width; x++) {
					xArray.push(parsedMapData.data[tiledDataCounter])

					tiledDataCounter++;
				}

				game.tiles.push(xArray);
			}

			console.log(game.tiles);
			
			game.setup();
		}
    }
    request.open("GET", "map.json", true);
    request.send();
}

game.setup = function() {
	game.width = 640;
	game.height = 480;

	game.offsetX = 0;
	game.offsetY = 0;

	game.tileSize = 32;

	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");

	var map = document.getElementById("map");

	console.log(map);

	game.map = document.createElement('canvas');
    game.map.id     = "mapCanvas";
    game.map.width  = map.naturalWidth;
    game.map.height = map.naturalHeight;

    var context = game.map.getContext("2d");

    context.drawImage(map, 0, 0);

    context.beginPath();
    for(var y = 0; y < game.tiles.length; y++) {
    	context.moveTo(0, y*game.tileSize);
    	context.lineTo(game.tiles[0].length*game.tileSize, y*game.tileSize)
    }

	for(var x = 0; x < game.tiles[0].length; x++) {
    	context.moveTo(x*game.tileSize, 0);
    	context.lineTo(x*game.tileSize, game.tiles.length*game.tileSize)
    }

    context.stroke()

	game.keys = {
		u: false,
		d: false,
		l: false,
		r: false
	}

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

	Rx.Observable.interval(33).subscribe(function () {

		game.player.update();

		game.player.draw();

		game.context.setTransform(1,0,0,1,0,0);

		game.context.clearRect(0, 0, game.width, game.height);

		game.context.translate(- game.offsetX, - game.offsetY);

		game.context.drawImage(game.map, 0, 0)

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

game.player = {
	vy: 0,
	vx: 0,
	x: 10,
	y: 200,
	isJumping: false,
	isGrounded: false,

	init: function() {

	},
	jump: function() {
		if(this.isGrounded) {
			this.vy = -15;
			this.isJumping = true;
			this.isGrounded = false;
			console.log("jump");	
		}
		
	},
	update: function() {
		this.vy += 0.98;

		if(this.vy > 0) {
			this.isJumping = false;
		}

		var tX = Math.floor(game.player.x / game.tileSize);
		var tY = Math.floor(game.player.y / game.tileSize);

		game.context.fillRect(tX*game.tileSize, tY*game.tileSize, game.tileSize, game.tileSize);

		if(!this.isJumping)
		{
			if(game.tiles[tY+1][tX] != 0 || game.tiles[tY+1][tX+1] != 0) {
				this.y = tY*game.tileSize;
				this.vy = 0;
				this.isGrounded = true;
			}	
		} else {

			// hits "roof"
			if(!game.tiles[tY-1]) {
				this.y = tY*game.tileSize;
				this.vy = 0.98;
			} else {
				if(game.tiles[tY-1][tX] != 0 || game.tiles[tY-1][tX+1] != 0) {
					this.y = tY*game.tileSize;
					this.vy = 0.98;
				}		
			}

			
		}

		if(this.vx > 0 && game.tiles[tY][tX+1] != 0) {
			this.x = tX*game.tileSize;
			this.vx = 0;
		}		

		if(this.vx < 0 && game.tiles[tY][tX-1] != 0) {
			this.x = tX*game.tileSize;
			this.vx = 0;
		}		

		this.y += this.vy;
		this.x += this.vx;

		var relativeScreenPosition = {
			x: this.x - game.offsetX,
			y: this.y - game.offsetY,
		} 

		console.log(relativeScreenPosition);

		if(relativeScreenPosition.x > 448) {
			game.offsetX+=4;
		} else if(relativeScreenPosition.x < 120 && game.offsetX >= 4) {
			game.offsetX-=4;
		}

	},
	draw: function() {

var tX = Math.floor(game.player.x / game.tileSize);
		var tY = Math.floor(game.player.y / game.tileSize);

		game.context.fillRect(tX*game.tileSize, (tY+1)*game.tileSize, game.tileSize, game.tileSize);

		game.context.drawImage(document.getElementById("player"), this.x, this.y)
	}
}

