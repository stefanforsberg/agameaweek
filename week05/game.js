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
		return k.keyCode
	}).subscribe(function (keyCode) {

		if(keyCode === 38) {
			game.keys.u = true;
		} else if(keyCode === 39) {
			game.keys.r = true;
		}
	});

	var keyUpStream = Rx.Observable.fromEvent(document, 'keyup')
	.filter(function (k) {
		return (k.keyCode === 37 || k.keyCode === 39 || k.keyCode === 38 || k.keyCode === 40)
	})
	.map(function (k) {
		return k.keyCode
	}).subscribe(function (keyCode) {

		if(keyCode === 38) {
			game.keys.u = false;
		} else if(keyCode === 39) {
			game.keys.r = false;
		}

		// if(keyCode === 38) {
		// 	game.player.vy = -15;
		// } 

		// game.player.x++;
		// game.offsetX++;
	});	

	Rx.Observable.interval(33).subscribe(function () {

		if(game.keys.u) {
			game.player.jump();
		} 
		if(game.keys.r) {
			game.offsetX+=4;
			game.player.vx = 4;
		}

		

		

		;

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

	init: function() {

	},
	jump: function() {
		this.vy = -20;
		this.isJumping = true;
		console.log("jump");
	},
	update: function() {
		this.vy += 0.98;

		if(this.vy > 0) {
			this.isJumping = false;
		}

		// var currentXtile = Math.floor(game.player.x / 32);
		// if(game.player.x % 32 !== 0) {
		// 	console.log("not");
		// 	currentXtile = currentXtile + " - " + (currentXtile + 1);
		// }

		// console.log(currentXtile);
		
		var tX = Math.floor(game.player.x / game.tileSize);
		var tY = Math.floor(game.player.y / game.tileSize);

		game.context.fillRect(tX*game.tileSize, tY*game.tileSize, game.tileSize, game.tileSize);

		if(!this.isJumping)
		{
			if(game.tiles[tY+1][tX] != 0 || game.tiles[tY+1][tX+1] != 0) {
				this.y = tY*game.tileSize;
				this.vy = 0;
			}	
		}

		if(game.tiles[tY][tX+1] != 0) {
			this.x = tX*game.tileSize;
			this.vx = 0;
		}		

		
		


		// if(this.y > 310) {
		// 	this.vy = 0;
		// }

		this.y += this.vy;
		this.x += this.vx;
	},
	draw: function() {

var tX = Math.floor(game.player.x / game.tileSize);
		var tY = Math.floor(game.player.y / game.tileSize);

		game.context.fillRect(tX*game.tileSize, (tY+1)*game.tileSize, game.tileSize, game.tileSize);

		game.context.drawImage(document.getElementById("player"), this.x, this.y)
	}
}

