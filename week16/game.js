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

	game.sounds = {
		current: "left"
	}

	game.sounds.left = new Howl({
		urls: ['left.mp3'],
		loop: true,
		onload: function() {
			game.sounds.right = new Howl({
				urls: ['right.mp3'],
				loop: true,
				onload: function() {
					game.loadMap(function (m) {
						game.parseMap(m);
						game.init();
					})
				}		  			
			})
		}		  			
	})

	game.sounds.left.fadeIn(0.5, 3000);
}

game.init = function() {
	
	game.player.init();
	game.target.init();
	game.tasks.init();
	game.build.init();
	game.scroll.init();
	
	game.tasks.setTaskText("Controlling wizard");

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

	game.pyramids.draw();

	game.tasks.draw(t);

	game.target.draw()
	game.context.restore();

}

game.tiles = {};

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

	game.tiles.bridge = getImageFromCanvas(0, 64);
	game.tiles.wall1 = getImageFromCanvas(32, 64);
	game.tiles.wall2 = getImageFromCanvas(64, 64);
	game.tiles.wall3 = getImageFromCanvas(96, 64);
	game.tiles.wall3 = getImageFromCanvas(96, 64);
	game.tiles.wallv = getImageFromCanvas(32*4, 64);
	game.tiles.soil = getImageFromCanvas(0, 96);



	game.tiles.flower1p = getImageFromCanvas(32*2, 96);
	game.tiles.flower2p = getImageFromCanvas(32*3, 96);
	game.tiles.flower3p = getImageFromCanvas(32*4, 96);
	game.tiles.flower4p = getImageFromCanvas(32*5, 96);
	
	game.tiles.flower1o = getImageFromCanvas(32*6, 96);
	game.tiles.flower2o = getImageFromCanvas(32*7, 96);
	game.tiles.flower3o = getImageFromCanvas(32*8, 96);
	game.tiles.flower4o = getImageFromCanvas(32*9, 96);
	
	game.tiles.flower1b = getImageFromCanvas(32*0, 4*32);
	game.tiles.flower2b = getImageFromCanvas(32*1, 4*32);
	game.tiles.flower3b = getImageFromCanvas(32*2, 4*32);
	game.tiles.flower4b = getImageFromCanvas(32*3, 4*32);	

	game.tiles.stonePath = getImageFromCanvas(32*5, 32*2);

	game.tiles.tree1 = getImageFromCanvas(32*5, 0);
	game.tiles.tree2 = getImageFromCanvas(32*6, 0);
	game.tiles.tree3 = getImageFromCanvas(32*7, 0);
	game.tiles.tree4 = getImageFromCanvas(32*8, 0);
	game.tiles.tree5 = getImageFromCanvas(32*9, 0);

	game.tiles.sow1 = getImageFromCanvas(32, 96);

	game.tiles.pyramid = getImageFromCanvas(32*2, 32*6);

}());