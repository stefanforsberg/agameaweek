

game.build = {
	items: [],
	init: function() {

		document.getElementById("wood").onclick = function () {
			game.tasks.setTaskText("Build walls/bridges");
			game.target.current = {
				img: game.tiles.wall1,
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
			game.tasks.setTaskText("Create fertile soil");
			game.target.current = {
				img: game.tiles.soil,
				buildOn: "ground",
				type: "object",
				click: function(x, y, tileType) {
					game.build.add(new game.soil(x, y, "soil"));	
				}
			}
		};

		document.getElementById("sow").onclick = function () {
			game.tasks.setTaskText("Plant flowers on soil");
			game.target.current = {
				img: game.tiles.flower3p,
				buildOn: "soil",
				type: "object",
				click: function(x, y, tileType) {
					game.build.add(new game.flower(x, y, "flower"));	
				}
			}
		};

		document.getElementById("stone").onclick = function () {
			game.tasks.setTaskText("Build stone path");
			game.target.current = {
				img: game.tiles.stonePath,
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
		this.img = game.tiles.wall1;
	} else {
		if(typeAbove === "wall" || typeBelow === "wall") {
			this.img = game.tiles.wallv;
		} else {
			this.img = game.tiles.wall1;	
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

	this.img = game.tiles.bridge;
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
	this.img = game.tiles.soil;
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
	this.img = game.tiles.stonePath;
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
	this.img = game.tiles.sow1;
	this.life = 0;

	var r = Math.random();

	if(r < 0.3) {
		this.color = "p"
	} else if(r < 0.6) {
		this.color = "o"
	} else {
		this.color = "b"
	}

	return this;
}

game.flower.prototype.draw = function() {

	if(this.life < 80) {

		this.life+=0.1;

		if(this.life < 20) {

		} else if(this.life < 40) {
			this.img = game.tiles["flower1" + this.color];
		} else if(this.life < 60) {
			this.img = game.tiles["flower2" + this.color];
		} else if(this.life < 80) {
			this.img = game.tiles["flower3" + this.color];
		} else {
			this.img = game.tiles["flower4" + this.color];
		}
	}

	game.context.save();
	game.context.translate(this.x*game.tileSize+game.tileSize/2, this.y*game.tileSize+game.tileSize/2)
	game.context.rotate(this.rotation*Math.PI/180);
	game.context.drawImage(this.img, -game.tileSize/2,-game.tileSize/2);
	game.context.restore();
}