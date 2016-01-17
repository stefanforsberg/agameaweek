var game = game || {};

game.init = function() {

	game.canvas = document.getElementById("game");
	game.context = game.canvas.getContext("2d");

	game.tileSize = 16;
	game.tileWidth = 32;
	game.tileHeight = 24;
	game.tilePadding = 3;

	game.width = game.tileSize * game.tileWidth + game.tilePadding*(game.tileWidth-1);
	game.height = game.tileSize * game.tileHeight + game.tilePadding*(game.tileWidth-1);

	game.maze.init();

	game.player.init(game.maze.startPosition.x, game.maze.startPosition.y);

	game.maze.canGoTo(game.player.x, game.player.y);

	game.player.playerStream.subscribe(function () {
		game.player.update();
	})
}

game.maze = {
	startPosition: {},
	maze: {},
	init: function() {
		this.maze = newMaze(game.tileWidth,game.tileHeight);

		this.startPosition = this.maze.startPosition;

		var colors = ["#454545", "#414141", "#484848", "#494949"]

		game.context.fillStyle = "#454545";
		game.context.fillRect(0, 0, game.width, game.height);

		for(var y = 0; y < game.tileHeight; y ++) {
			for(var x = 0; x < game.tileWidth; x++) {

				var currentCell = this.maze.cells[y][x];

				game.context.beginPath();

				var coords = game.tileToCoord(x, y);
				game.context.fillStyle = colors[Math.floor(Math.random()*colors.length)];;
				game.context.fillRect(coords.x, coords.y, game.tileSize, game.tileSize);
				
				
				game.context.fillStyle = "#050505";

				var possibleDirections = "udlr";

				if(currentCell[0] === 0) {
					// TOP
					possibleDirections = possibleDirections.replace('u','');
					game.context.fillRect(coords.x, coords.y - game.tilePadding, game.tileSize, game.tilePadding);
					
				} 
				if(currentCell[1] === 0) {
					// // RIGHT
					possibleDirections = possibleDirections.replace('r','');
					game.context.fillRect(coords.x + game.tileSize, coords.y, game.tilePadding, game.tileSize);

				} 
				if(currentCell[2] === 0) {
					// BOTTOM
					possibleDirections = possibleDirections.replace('d','');
					game.context.fillRect(coords.x, coords.y + game.tileSize, game.tileSize, game.tilePadding);
					
				} 
				if(currentCell[3] === 0) {
					// LEFT
					possibleDirections = possibleDirections.replace('l','');
					game.context.fillRect(coords.x - game.tilePadding, coords.y, game.tilePadding, game.tileSize);
				}

				currentCell.push(possibleDirections);

				game.context.stroke();
			}
		}
	},
	canGoTo: function(x, y, dir) {

		console.log(this.maze.cells[y][x][4]);
		return this.maze.cells[y][x][4].indexOf(dir) > -1;
	}
}

game.update = function(ts) {
	game.player.draw();
}

game.player = {
	x: 0,
	y: 0,
	playerStream: {},
	init: function(x, y) {
		this.x = x;
		this.y = y;
		this.playerStream = Rx.Observable.fromEvent(document, 'keydown')
		.filter(function (k) {
			return (k.keyCode === 37 || k.keyCode === 39 || k.keyCode === 38 || k.keyCode === 40)
		})
		.map(function (k) {
			return k.keyCode
		})
		.scan(function (p, k) {
			console.log(k);
			if(k === 37) {
				if(game.maze.canGoTo(p.x, p.y, "l")) {
					p.x--;	
				}				
			} else if (k === 39) {
				if(game.maze.canGoTo(p.x, p.y, "r")) {
					p.x++;	
				}
			} else if (k === 40) {
				if(game.maze.canGoTo(p.x, p.y, "d")) {
					p.y++;	
				}
			} else if (k === 38) {
				if(game.maze.canGoTo(p.x, p.y, "u")) {
					p.y--;	
				}
			}

			return p;
		}, this);

		this.update();
	},
	update: function() {
		console.log(this.x + " - " + this.y);
		game.context.fillStyle = "#ff7700";
		var coords = game.tileToCoord(this.x, this.y);
		game.context.fillRect(coords.x, coords.y, game.tileSize, game.tileSize);
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

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
