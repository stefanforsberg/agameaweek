game.trees = {
	items: [],
	init: function(map) {

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
	this.img = game.tiles.tree1;
	return this;
}

game.tree.prototype.draw = function() {
	
	if(this.life <= 75 && this.life > 50) {
		this.img = game.tiles.tree2;
	} else if(this.life <= 50 && this.life > 25) {
		this.img = game.tiles.tree3;
	} else if(this.life <= 25 && this.life > 0) {
		this.img = game.tiles.tree4;
	} else if(this.life == 0) {
		this.img = game.tiles.tree5;
	}

	game.context.drawImage(this.img, this.x*game.tileSize, this.y*game.tileSize);
};