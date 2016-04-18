game.trees = {
	items: [],
	init: function(map) {

		console.log(map);

		this.items = [];

		map.objects.forEach(function (o) {
			this.items.push(new game.tree(o.id, o.x.toTileX()+1, o.y.toTileY()));
		}, this);


	},
	draw: function() {
		this.items.forEach(function (o) {
			o.draw();
		}, this);
	},
	clickedTree: function(x, y) {
		return _.find(this.items, function (o) { return o.x === x && o.y === y });
	}
}

game.tree = function(id, x, y) {

	this.id = id;
	this.life = 100;
	this.x = x;
	this.y = y;
	return this;
}

game.tree.prototype.draw = function() {
	var tileCoord = {
		x: 64,
		y: 0
	};

	if(this.life <= 75 && this.life > 50) {
		tileCoord.x = 96;
	} else if(this.life <= 50 && this.life > 25) {
		tileCoord.x = 128;
	} else if(this.life <= 25 && this.life > 0) {
		tileCoord.x = 160;
	} else if(this.life == 0) {
		tileCoord.x = 192;
	}

	game.context.drawImage(game.tileset, tileCoord.x, tileCoord.y, game.tileSize, game.tileSize, this.x*game.tileSize, this.y*game.tileSize, game.tileSize, game.tileSize);
};