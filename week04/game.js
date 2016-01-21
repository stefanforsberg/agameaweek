var game = game || {};

game.init = function() {

	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");

	game.fog = {
		canvas: document.getElementById("fog")
	}

	game.fog.context = game.fog.canvas.getContext("2d");

	game.tileSize = 16;
	game.tileWidth = 32;
	game.tileHeight = 24;
	game.tilePadding = 3;

	game.width = game.tileSize * game.tileWidth + game.tilePadding*(game.tileWidth-1);
	game.height = game.tileSize * game.tileHeight + game.tilePadding*(game.tileWidth-1);

	game.maze.init();

	game.player.init(game.maze.startPosition.x, game.maze.startPosition.y);

	game.update();

	game.player.playerStream.subscribe(function () {
		game.update();
	})
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
		var context = this.baseCanvas.getContext("2d");



		this.maze = newMaze(game.tileWidth,game.tileHeight);

		this.startPosition = this.maze.startPosition;

		var colors = ["#454545", "#414141", "#484848", "#494949"]

		context.fillStyle = "#454545";
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

    var coords = game.tileToCoord(game.player.x - 1, game.player.y -1);

    var r1 = 4
  	var r2 = 40


  	var x = coords.x + (game.tileSize*1.5 + game.tilePadding);
  	var y = coords.y + (game.tileSize*1.5 + game.tilePadding);

    var radGrd = game.context.createRadialGradient( x, y, r1, x, y, r2 );
    radGrd.addColorStop(0, 'rgba( 255, 0, 0,  .7 )' );
    radGrd.addColorStop(.4, 'rgba( 255, 0, 0, .3 )' );
    radGrd.addColorStop(1, 'rgba( 255, 0, 0,  0 )' );

  	game.context.save();
  	game.context.globalCompositeOperation = 'destination-out';
   
    game.context.fillStyle = radGrd;
    game.context.fillRect(x - r2, y - r2, r2*2, r2*2 );

    game.context.restore();

	// game.fog.context.globalCompositeOperation = 'source-over';
 //    game.fog.context.clearRect( 0, 0, game.width, game.height );
 //    game.fog.context.fillStyle = "rgba( 0, 0, 0, .99 )";
 //    game.fog.context.fillRect ( 0, 0, game.width, game.height );

 //    var radGrd = game.fog.context.createRadialGradient( x, y, r1, x, y, r2 );
 //    radGrd.addColorStop(  0, 'rgba( 0, 0, 0,  1 )' );
 //    radGrd.addColorStop( .8, 'rgba( 0, 0, 0, .6 )' );
 //    radGrd.addColorStop(  1, 'rgba( 0, 0, 0,  0 )' );

 //    game.fog.context.globalCompositeOperation = 'destination-out';
 //    game.fog.context.fillStyle = radGrd;
 //    game.fog.context.fillRect( x - r2, y - r2, r2*2, r2*2 );
    
	game.player.draw();

}

game.player = {
	x: 0,
	y: 0,
	visited: {},
	playerStream: {},
	init: function(x, y) {
		this.newPosition(x,y);
		this.playerStream = Rx.Observable.fromEvent(document, 'keydown')
		.filter(function (k) {
			return (k.keyCode === 37 || k.keyCode === 39 || k.keyCode === 38 || k.keyCode === 40)
		})
		.map(function (k) {
			return k.keyCode
		})
		.scan(function (p, k) {
			
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
		}, this);
	},
	draw: function() {
		var visited = this.visited;

		// Object.keys(this.visited).forEach(function (k) {
		// 	var cell = visited[k];
		// 	console.log(cell);
		// 	game.context.fillStyle = cell.color;
		// 	var coords = game.tileToCoord(cell.x, cell.y);
		// 	game.context.fillRect(coords.x, coords.y, game.tileSize, game.tileSize);
		// })

		game.context.fillStyle = "#ff7700";
		var coords = game.tileToCoord(this.x, this.y);
		game.context.fillRect(coords.x, coords.y, game.tileSize, game.tileSize);
	},
	newPosition: function(x, y) {
		this.x = x;
		this.y = y;

		var colors = ["rgba(200,50,120, 0.2)", "rgba(200,189,130, 0.2)", "rgba(87,50,120, 0.2)", "rgba(23,50,233, 0.2)"]

		var key = "k-" + x + "-" + y;

		if(this.visited[key]) {
			console.log("yes");
		} else {
			this.visited[key] = {x: x, y: y, color: colors[Math.floor(Math.random()*colors.length)]};	
		}
	}
}

game.tileToCoord = function (x, y) {
	return {
		x: x*(game.tileSize + game.tilePadding),
		y: y*(game.tileSize + game.tilePadding)
	}
}


function resize() {
	// Our canvas must cover full height of screen
	// regardless of the resolution
	var height = window.innerHeight * 0.8;
	
	// So we need to calculate the proper scaled width
	// that should work well with every resolution
	var ratio = game.canvas.width/game.canvas.height;
	var width = height * ratio;
	
	game.canvas.style.width = width+'px';
	game.canvas.style.height = height+'px';
}

// window.addEventListener('load', resize, false);
// window.addEventListener('resize', resize, false);
