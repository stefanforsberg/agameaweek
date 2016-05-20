game.walls = {
	items: [],
	init: function(w) {
		this.items = [];

		w.forEach(function(wp) {
			this.items.push(new game.wall(wp));
		}, this)
	},
	canSee: function(o1, o2) {
		var charsThatSeePlayer = _.filter(this.items, function(w) {

			if(!o1.canTarget()) {
				return false;
			}

			var o1Fixed = {x: o1.x+game.tileSize/2, y: o1.y+game.tileSize/2};
			var o2Fixed = {x: o2.x+game.tileSize/2, y: o2.y+game.tileSize/2};

			var canSee = !isIntersect(o1Fixed, o2Fixed, {x: w.x1, y: w.y1}, {x: w.x2, y: w.y2})

			if(canSee) {
				o1.target(o1Fixed.x, o1Fixed.y, o2Fixed.x, o2Fixed.y);	
			}
			
		});
	}
}

game.wall = function(p) {
	this.x1 = p.x;
	this.x2 = p.x + p.width;
	this.y1 = p.y;
	this.y2 = p.y + p.height;
	return this;
}

game.wall.prototype.isOnScreen = function() {

}