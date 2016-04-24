game.pyramids = {
	items: [],
	init: function(map) {

		this.items = [];

		map.objects.forEach(function (o) {
			this.items.push(new game.pyramid(o.id, o.x.toTileX()+1, o.y.toTileY()));
		}, this);
	},
	draw: function() {
		this.items.forEach(function (o) {
			o.draw();
		}, this);
	}
}

game.pyramid = function(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.img = game.tiles.pyramid;
	return this;
}

game.pyramid.prototype.draw = function() {
	game.context.drawImage(this.img, this.x*game.tileSize, this.y*game.tileSize);
};