var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");
game.width = (26*32);
game.height = (20*32);
game.canvas.width = game.width;
game.canvas.height = game.height;
game.canvas.style.width = game.width + "px";
game.canvas.style.height = game.height + "px";
game.subscriptions = [];
game.isRunning = true;
game.tileSize = 32;
game.offsetX = 0;
game.offsetY = 0;
game.tileset = document.getElementById("tileset");


Number.prototype.toTileX = function(relative) {
	var value = this.valueOf();
	if(relative) {value = this.valueOf() + game.offsetX }
    return Math.ceil((value / game.tileSize)) - 1;
};

Number.prototype.toTileY = function(relative) {
    var value = this.valueOf();
	if(relative) {value = this.valueOf() + game.offsetY }
    return Math.ceil((value / game.tileSize)) - 1;
};

Number.prototype.tileToPos = function(relative) {
	return this.valueOf()*game.tileSize;
};

game.load = function() {
	game.loadMap(function (m) {
		game.parseMap(m);
		game.init();
	})
}

game.init = function() {
	
	game.player.init();
	game.target.init();
	game.tasks.init();
	game.build.init();
	game.scroll.init();
	

	game.subscriptions.push(Rx.Observable.interval(33).subscribe(function(t) {
		game.draw(t);
	}));
}

game.draw = function(t) {
	game.context.save();
	game.context.clearRect(0, 0, game.width, game.height);
	game.context.translate(- game.offsetX, - game.offsetY);
	
	game.map.draw();

	game.build.draw();

	game.player.draw(t);

	game.trees.draw();

	game.tasks.draw(t);

	game.target.draw()
	game.context.restore();

}
