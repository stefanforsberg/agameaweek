var game = game || {};

game.load = function() {

	game.sounds = [];

	game.sounds[1] = new Howl({
  		urls: ['level1.mp3'],
  		loop: true,
  		onload: function() {
  			game.sounds[2] =new Howl({
		  		urls: ['level2.mp3'],
		  		loop: true,
		  		onload: function() {
		  			game.sounds[3] =new Howl({
				  		urls: ['level3.mp3'],
				  		loop: true,
				  		onload: function() {
				  			game.sounds[4] =new Howl({
						  		urls: ['level4.mp3'],
						  		loop: true,
						  		onload: function() {
						  			game.initLevel(1);
						  		}
				  			})
		  				}
		  			})
  				}
			})
		}
	})
}

game.initLevel = function(level) {

	if(game.streamSubscription) {
		game.streamSubscription.dispose();
	}

	game.level = level;

	if(game.level > 1) {
		game.sounds[(game.level-1)].fade(1, 0, 5000, function() { game.sounds[(game.level-1)].stop(); });		
		game.sounds[game.level].fade(0, 1, 5000);
		game.sounds[game.level].play();		
		game.sounds[game.level].pos(game.sounds[(game.level-1)].pos());
	} else {
		game.sounds[game.level].fade(0, 1, 5000);
		game.sounds[game.level].play();
	}

	game.container = document.querySelector('.container');
	game.container.innerHTML = "";

	game.tileSize = 16;
	game.tilePadding = 3;

	if(game.level === 1) {
		game.tileWidth = 6
		game.tileHeight = 4
	} else if(game.level === 2) {
		game.tileWidth = 10;
		game.tileHeight = 8;
	} else if(game.level === 3) {
		game.tileWidth = 16;
		game.tileHeight = 10;
	} else if(game.level === 4) {
		game.tileWidth = 24;
		game.tileHeight = 14;
	}

	game.width = game.tileSize * game.tileWidth + game.tilePadding*(game.tileWidth-1);
	game.height = game.tileSize * game.tileHeight + game.tilePadding*(game.tileHeight-1);

	var canvas = document.createElement('canvas');
    canvas.id     = "game";
    canvas.width  = game.width;
    canvas.height = game.height;
    canvas.style.zIndex   = 1;

    game.container.appendChild(canvas)

	var fog = document.createElement('canvas');
    fog.id     = "fog";
    fog.width  = game.width;
    fog.height = game.height;
    fog.style.zIndex   = 2;
    game.container.appendChild(fog)

    game.init();

    game.resize();
}

game.fog = {
	
	init: function() {
		this.r1 = 4;
		this.r2 = 40 + 6*(game.level);
		this.lastr2 = this.r2;
		this.canvas = document.getElementById("fog")	
		this.context = this.canvas.getContext("2d");
		this.activated = false;
		this.counter = 0;
	},
	draw: function() {
		if(!this.activated) {
			return;
		}

		this.counter++;

		if(this.counter % 15 === 0) {
			this.lastr2 = this.r2;
			this.r2 = 250;
		} else {
			this.r2 = this.lastr2;
		}

		this.r2-= 0.2;

	    var coords = game.tileToCoord(game.player.x - 1, game.player.y -1);

	  	var x = coords.x + (game.tileSize*1.5 + game.tilePadding);
	  	var y = coords.y + (game.tileSize*1.5 + game.tilePadding);

	    var radGrd = game.context.createRadialGradient( x, y, this.r1, x, y, this.r2 );
	    radGrd.addColorStop(0, 'rgba( 255, 0, 0,  .7 )' );
	    radGrd.addColorStop(.4, 'rgba( 255, 0, 0, .3 )' );
	    radGrd.addColorStop(1, 'rgba( 255, 0, 0,  0 )' );

	  	game.context.save();
	  	game.context.globalCompositeOperation = 'destination-out';
	   
	    game.context.fillStyle = radGrd;
	    game.context.fillRect(x - this.r2, y - this.r2, this.r2*2, this.r2*2 );

	    game.context.restore();

		this.context.globalCompositeOperation = 'source-over';
	    this.context.clearRect( 0, 0, game.width, game.height );
	    this.context.fillStyle = "rgba( 0, 0, 0, .99 )";
	    this.context.fillRect ( 0, 0, game.width, game.height );

	    var radGrd = game.fog.context.createRadialGradient( x, y, this.r1, x, y, this.r2 );
	    radGrd.addColorStop(  0, 'rgba( 0, 0, 0,  1 )' );
	    radGrd.addColorStop( .8, 'rgba( 0, 0, 0, .6 )' );
	    radGrd.addColorStop(  1, 'rgba( 0, 0, 0,  0 )' );

	    this.context.globalCompositeOperation = 'destination-out';
	    this.context.fillStyle = radGrd;
	    this.context.fillRect( x - this.r2, y - this.r2, this.r2*2, this.r2*2 );
	}
}

game.init = function() {

	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");

	game.maze.init();

	game.fog.init();

	game.player.init(game.maze.startPosition.x, game.maze.startPosition.y);

	game.update();

	Rx.Observable
		.timer(500, 1000)
		.map(function (i) {
			return (5 - i);
		})
		.take(6)
		.subscribe(function(i) {
			game.update();
	  		game.context.font = "30px Arial";
			game.context.textAlign="center"; 
			game.context.fillText(i,game.width/2,game.height/2 + 15); 
		}, 
		function (err) {
		},
		function () {
			game.fog.activated = true;

			game.update();

			game.streamSubscription = game.getStream().subscribe(function () {
				game.update();
			})
	}
);
}

game.maze = {
	startPosition: {},

	baseCanvas: {},
	playerCanvas: {},

	maze: {},
	init: function() {

		this.baseCanvas = document.createElement("canvas");
		this.baseCanvas.width = game.width;
		this.baseCanvas.height = game.height;

		this.endPosition = {
		    x: Math.floor(Math.random()*game.tileWidth),
    		y: Math.floor(Math.random()*game.tileHeight),
		}

		var context = this.baseCanvas.getContext("2d");


		this.maze = newMaze(game.tileWidth,game.tileHeight);

		this.startPosition = this.maze.startPosition;

		var colors = ["#383838", "#3b3b3b", "#3f3f3f", "#353535"]

		context.fillStyle = "#383838";
		context.fillRect(0, 0, game.width, game.height);

		for(var y = 0; y < game.tileHeight; y ++) {
			for(var x = 0; x < game.tileWidth; x++) {

				var currentCell = this.maze.cells[y][x];

				context.beginPath();

				var coords = game.tileToCoord(x, y);
				context.fillStyle = colors[Math.floor(Math.random()*colors.length)];
				context.fillRect(coords.x, coords.y, game.tileSize, game.tileSize);
				
				context.fillStyle = "#050505";

				var possibleDirections = "udlr";

				if(currentCell[0] === 0) {
					// TOP
					possibleDirections = possibleDirections.replace('u','');
					context.fillRect(coords.x, coords.y - game.tilePadding, game.tileSize, game.tilePadding);
					
				} 
				if(currentCell[1] === 0) {
					// // RIGHT
					possibleDirections = possibleDirections.replace('r','');
					context.fillRect(coords.x + game.tileSize, coords.y, game.tilePadding, game.tileSize);

				} 
				if(currentCell[2] === 0) {
					// BOTTOM
					possibleDirections = possibleDirections.replace('d','');
					context.fillRect(coords.x, coords.y + game.tileSize, game.tileSize, game.tilePadding);
					
				} 
				if(currentCell[3] === 0) {
					// LEFT
					possibleDirections = possibleDirections.replace('l','');
					context.fillRect(coords.x - game.tilePadding, coords.y, game.tilePadding, game.tileSize);
				}

				currentCell.push(possibleDirections);

				context.stroke();
			}
		}

		var coords = game.tileToCoord(this.endPosition.x, this.endPosition.y);

		context.fillStyle = "#000000";
		context.fillRect(coords.x + 2, coords.y + 2, game.tileSize - 4, game.tileSize - 4);



	},
	canGoTo: function(x, y, dir) {
		return this.maze.cells[y][x][4].indexOf(dir) > -1;
	},
	getPossibleDirectionsFrom: function(x, y) {
		return this.maze.cells[y][x][4];
	},
	getRandomDirectionFrom: function(x, y) {
		var possibleDirections = this.getPossibleDirectionsFrom(x, y);
		return possibleDirections.charAt(Math.floor(Math.random()*possibleDirections.length));
	},
	draw: function() {
		game.context.drawImage(this.baseCanvas, 0, 0);
	}
}

game.update = function(ts) {
	
	game.context.clearRect(0,0, game.width, game.height);

    var coords = game.tileToCoord(game.player.x, game.player.y);
    
    game.maze.draw();

    game.fog.draw();
    
	game.player.draw();

}

game.nextLevel = function() {
	game.initLevel((game.level + 1))
}

game.player = {
	x: 0,
	y: 0,
	visited: {},
	colors: ["rgba(120,197,214, 0.2)", "rgba(69,155,168, 0.2)", "rgba(121,194,103, 0.2)", "rgba(197,214,71, 0.2)", "rgba(245,214,61, 0.2)", "rgba(242,140,51, 0.2)", "rgba(232,104,162, 0.2)", "rgba(191,98,166, 0.2)"],
	init: function(x, y) {
		this.visited = {};
		this.newPosition(x, y);

		
	},
	updateFromStream: function(p, k) {
		if(k === 37) {
			if(game.maze.canGoTo(p.x, p.y, "l")) {
				p.newPosition(p.x-1, p.y);
			}				
		} else if (k === 39) {
			if(game.maze.canGoTo(p.x, p.y, "r")) {
				p.newPosition(p.x+1, p.y);
			}
		} else if (k === 40) {
			if(game.maze.canGoTo(p.x, p.y, "d")) {
				p.newPosition(p.x, p.y+1);
			}
		} else if (k === 38) {
			if(game.maze.canGoTo(p.x, p.y, "u")) {
				p.newPosition(p.x, p.y-1);
			}
		}

		return p;
	},
	draw: function() {
		var visited = this.visited;

		var i = 0;
		var self = this;		

		Object.keys(this.visited).forEach(function (k) {
			var cell = visited[k];
			game.context.fillStyle = self.colors[i];
			var coords = game.tileToCoord(cell.x, cell.y);
			game.context.fillRect(coords.x + 1, coords.y + 1, game.tileSize - 2, game.tileSize - 2);

			i++;

			if(i >= self.colors.length) {
				i = 0;
			}
		})

		game.context.fillStyle = "#FFFFFF";
		var coords = game.tileToCoord(this.x, this.y);
		game.context.fillRect(coords.x + 3, coords.y + 3, game.tileSize - 6, game.tileSize - 6);
	},
	newPosition: function(x, y) {

		this.x = x;
		this.y = y;

		if(this.x === game.maze.endPosition.x && this.y === game.maze.endPosition.y) {
			game.nextLevel();
			return;
		}

		var key = "k-" + x + "-" + y;

		if(!this.visited[key]) {
			this.visited[key] = {x: x, y: y};	
		}
	}
}

game.tileToCoord = function (x, y) {
	return {
		x: x*(game.tileSize + game.tilePadding),
		y: y*(game.tileSize + game.tilePadding)
	}
}

game.getStream = function() {

	var keyStream = Rx.Observable.fromEvent(document, 'keydown')
		.filter(function (k) {
			return (k.keyCode === 37 || k.keyCode === 39 || k.keyCode === 38 || k.keyCode === 40)
		})
		.map(function (k) {
			return k.keyCode
		})

	var touchStream = Rx.Observable.fromEvent(game.fog.canvas, 'touchstart')
		.map(function (e) {
			 e.preventDefault();
		    var touch = e.touches[0];

		    var boundingRect = game.canvas.getBoundingClientRect()

		    var localX = (touch.pageX - boundingRect.left);
		    var localY = (touch.pageY - boundingRect.top);

		    var coords = game.tileToCoord(game.player.x, game.player.y);
		    var position = {
		    	left: coords.x*(game.canvas.scaledWidth/game.canvas.width),
		    	right: (coords.x+game.tileSize)*(game.canvas.scaledWidth/game.canvas.width),
		    	top: coords.y*(game.canvas.scaledHeight/game.canvas.height),
		    	bottom: (coords.y+game.tileSize)*(game.canvas.scaledHeight/game.canvas.height),
		    }

		    if(localX < position.left) {
		    	return 37
		    } else if(localX > position.right) {
		    	return 39
		    } else if(localY < position.top) {
		    	return 38
		    } else if(localY > position.bottom) {
		    	return 40
		    }

		    return "";
		})
		.filter(function (k) {
			return k !== ""
		});

	return Rx.Observable.merge(touchStream, keyStream)
		.scan(game.player.updateFromStream, game.player)		
}

game.resize = function() {
	
	var maxHeight = 0;
	var maxWidth = 0;

	var widthHeightRatio = game.canvas.width/game.canvas.height;
	var heightWidthRatio = game.canvas.height/game.canvas.width;


	maxWidth = window.innerWidth * .8;
	maxHeight = window.innerHeight * .8

	var width = 0;
	var height = 0;

	console.log(maxWidth + " - " + maxHeight);
	console.log(maxHeight * widthHeightRatio);

	if(maxHeight * widthHeightRatio < maxWidth) {
		height = maxHeight;
		width = maxHeight * widthHeightRatio;
	} else {
		height = maxWidth * heightWidthRatio;
		width = maxWidth;
	}

	game.canvas.scaledWidth = width;
	game.canvas.scaledHeight = height;

	game.canvas.style.width = width+'px';
	game.canvas.style.height = height+'px';
    game.canvas.style.marginLeft = "-" +  width /2 +  "px";

    game.fog.canvas.style.width = width+'px';
	game.fog.canvas.style.height = height+'px';
    game.fog.canvas.style.marginLeft = "-" +  width /2 +  "px";
}
