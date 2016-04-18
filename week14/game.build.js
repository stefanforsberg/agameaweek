

game.build = {
	items: [],
	init: function() {
		// this.add(new game.wall(10, 10));
		// this.add(new game.wall(10, 9));
		// this.add(new game.wall(10, 8));
		// this.add(new game.wall(10, 7));
		// this.add(new game.wall(10, 6));
		// this.add(new game.wall(10, 5));
		// this.add(new game.wall(11, 5));
		// this.add(new game.wall(12, 5));
		// this.add(new game.wall(13, 5));

		document.getElementById("wood").onclick = function () {
			game.target.current = {
				img: game.buildingBlocks.wall1,
				buildOn: "ground,water",
				type: "object",
				click: function(x, y, tileType) {
					if(tileType === "ground") {
						game.build.add(new game.wall(x, y, "wall"));	
					} else if(tileType === "water") {
						game.build.add(new game.bridge(x, y, "bridge"));
					}
					
				}
			}
		};

		document.getElementById("soil").onclick = function () {
			game.target.current = {
				img: game.buildingBlocks.soil,
				buildOn: "ground",
				type: "object",
				click: function(x, y, tileType) {
					game.build.add(new game.soil(x, y, "soil"));	
				}
			}
		};

		document.getElementById("sow").onclick = function () {
			game.target.current = {
				img: game.buildingBlocks.flower3y,
				buildOn: "soil",
				type: "object",
				click: function(x, y, tileType) {
					game.build.add(new game.flower(x, y, "flower"));	
				}
			}
		};

		document.getElementById("stone").onclick = function () {
			game.target.current = {
				img: game.buildingBlocks.stonePath,
				buildOn: "ground",
				type: "object",
				click: function(x, y, tileType) {
					game.build.add(new game.stone(x, y, "stone"));	
				}
			}
		};		
	},
	draw: function() {
		this.items.forEach(function (o) {
			o.draw();
		});
	},
	add: function(b) {
		if(b.blocks) {
			game.pathFinderGrid.setWalkableAt(b.x, b.y, false);
		} else {
			game.pathFinderGrid.setWalkableAt(b.x, b.y, true);
		}

		game.map.tileArray[b.y][b.x] = b.type;

		this.items.push(b);
	}
}

game.wall = function(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.blocks = true;

	var typeLeft = game.map.tileTypeAt(x-1,y);
	var typeRight = game.map.tileTypeAt(x-1,y);
	var typeAbove = game.map.tileTypeAt(x,y-1);
	var typeBelow = game.map.tileTypeAt(x,y+1);

	if(typeLeft === "wall" || typeRight === "wall") {
		this.img = game.buildingBlocks.wall1;
	} else {
		if(typeAbove === "wall" || typeBelow === "wall") {
			this.img = game.buildingBlocks.wallv;
		} else {
			this.img = game.buildingBlocks.wall1;	
		}
	}
	return this;
}

game.wall.prototype.draw = function() {
	game.context.drawImage(this.img, this.x*game.tileSize, this.y*game.tileSize);
}

game.bridge = function(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.blocks = false;

	this.img = game.buildingBlocks.bridge;
	return this;
}

game.bridge.prototype.draw = function() {
	game.context.drawImage(this.img, this.x*game.tileSize, this.y*game.tileSize);
}

game.soil = function(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type
	this.blocks = true;
	this.img = game.buildingBlocks.soil;
	return this;
}

game.soil.prototype.draw = function() {
	game.context.drawImage(this.img, this.x*game.tileSize, this.y*game.tileSize);
}

game.stone = function(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type
	this.blocks = false;
	this.img = game.buildingBlocks.stonePath;
	return this;
}

game.stone.prototype.draw = function() {
	game.context.drawImage(this.img, this.x*game.tileSize, this.y*game.tileSize);
}

game.flower = function(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type
	this.blocks = true;
	this.img = game.buildingBlocks.sow1;
	this.life = 0;

	var r = Math.random();

	this.rotation = Math.floor(Math.random()*360);

	if(r < 0.3) {
		this.color = "y"
	} else if(r < 0.6) {
		this.color = "p"
	} else {
		this.color = "b"
	}

	return this;
}

game.flower.prototype.draw = function() {

	if(this.life < 80) {

		this.life+=1;

		if(this.life < 20) {

		} else if(this.life < 40) {
			this.img = game.buildingBlocks.sow2;
		} else if(this.life < 60) {
			this.img = game.buildingBlocks["flower1" + this.color];
		} else if(this.life < 80) {
			this.img = game.buildingBlocks["flower2" + this.color];
		} else {
			this.img = game.buildingBlocks["flower3" + this.color];
		}
	}

	game.context.save();
	game.context.translate(this.x*game.tileSize+game.tileSize/2, this.y*game.tileSize+game.tileSize/2)
	game.context.rotate(this.rotation*Math.PI/180);
	game.context.drawImage(this.img, -game.tileSize/2,-game.tileSize/2);
	game.context.restore();
}

game.buildingBlocks = {};

(function () {

	function createCanvas() {
		var canvas = document.createElement('canvas');
		canvas.width = game.tileSize;
		canvas.height = game.tileSize;
		var ctx = canvas.getContext("2d");
		return {
			canvas: canvas,
			ctx: ctx
		};
	}

	function getImageFromCanvas(x, y) {
		var c = createCanvas();
	
		c.ctx.drawImage(game.tileset, x, y, game.tileSize, game.tileSize, 0,0 , game.tileSize, game.tileSize);
		return c.canvas;
	}

	game.buildingBlocks.bridge = getImageFromCanvas(0, 64);
	game.buildingBlocks.wall1 = getImageFromCanvas(32, 64);
	game.buildingBlocks.wall2 = getImageFromCanvas(64, 64);
	game.buildingBlocks.wall3 = getImageFromCanvas(96, 64);
	game.buildingBlocks.wall3 = getImageFromCanvas(96, 64);
	game.buildingBlocks.wallv = getImageFromCanvas(32*4, 64);
	game.buildingBlocks.soil = getImageFromCanvas(0, 96);

	game.buildingBlocks.sow1 = getImageFromCanvas(32, 96);
	game.buildingBlocks.sow2 = getImageFromCanvas(32*2, 96);
	game.buildingBlocks.flower1y = getImageFromCanvas(32*3, 96);
	game.buildingBlocks.flower2y = getImageFromCanvas(32*4, 96);
	game.buildingBlocks.flower3y = getImageFromCanvas(32*5, 96);
	game.buildingBlocks.flower1p = getImageFromCanvas(32*6, 96);
	game.buildingBlocks.flower2p = getImageFromCanvas(32*7, 96);
	game.buildingBlocks.flower3p = getImageFromCanvas(32*8, 96);
	game.buildingBlocks.flower1b = getImageFromCanvas(32*0, 32*4);
	game.buildingBlocks.flower2b = getImageFromCanvas(32*1, 32*4);
	game.buildingBlocks.flower3b = getImageFromCanvas(32*2, 32*4);

	game.buildingBlocks.stonePath = getImageFromCanvas(32*5, 32*2);

}());