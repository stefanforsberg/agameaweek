var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

// , 
game.colors = ["#ECB200", "#D96D3A", "#D44380", "#ADC800", "#671E46"]

game.tileSize = 64;
game.width = 650;
game.height = 650;
game.smiles = [];

game.load = function() {
	game.init();
}

game.animating = false;

game.init = function() {
	for(var y = 0; y < 10; y++) {
		for(var x = 0; x < 10; x++) {
			game.smiles.push(new game.smile(x, y));
		}
	}

	game.context.globalAlpha=0.9;

	game.draw();

	//game.findMatches();
}

game.draw = function(t) {

	if(!game.animating) {
		game.context.clearRect(0,0,game.width, game.height)

		game.context.save();
		game.context.translate(0.5, 0.5);
		game.smiles.forEach(function (o) {
			o.update();
			o.draw();
		});
		game.context.restore();

	
		if(_.every(game.smiles, function (s) { return s.dy === 0 })) {
			game.findMatches();
		} 
	}


	window.requestAnimationFrame(game.draw);
}

game.smile = function(x, y) {
	this.x = x;
	this.y = y;
	this.dy = 0;
	this.py = y.toPixel();
	this.color = game.colors[Math.floor(Math.random()*game.colors.length)];
	return this;
}

Number.prototype.toPixel= function() {
	var value = this.valueOf();
	return value * game.tileSize + 1*value;
};

game.smile.prototype.update = function() {
	if(this.py < this.dy.toPixel()) {
		this.py+=8

		if(this.py >= this.dy.toPixel()) {
			this.y = this.dy;
			this.py = this.y.toPixel();
			this.dy = 0;
			

		}
	}

}

game.smile.prototype.draw = function() {
	game.context.fillStyle = this.color;
	game.context.fillRect(this.x.toPixel(), this.py, game.tileSize, game.tileSize);
};

game.findMatches = function() {

	mainLoop:
	for(var y = 9; y > 0; y--) {
		for(var x = 9; x > 0; x--) {

		    var y1 = _.first(_.where(game.smiles, {x: x, y: y}));	
			var y2 = _.first(_.where(game.smiles, {x: x, y: (y-1), color: y1.color}));	
			var y3 = _.first(_.where(game.smiles, {x: x, y: (y-2), color: y1.color}));	

			if(y2 && y3) {
				console.log("y matches at " + x + ", " + y);
				game.removeAndAddY(y1,y2,y3);
				break mainLoop;
			}			
			
			var x1 = _.first(_.where(game.smiles, {x: x, y: y}));	
			var x2 = _.first(_.where(game.smiles, {x: (x-1), y: y, color: x1.color}));	
			var x3 = _.first(_.where(game.smiles, {x: (x-2), y: y, color: x1.color}));	

			if(x2 && x3) {
				console.log("x matches at " + x + ", " + y);
				game.removeAndAddX(x1,x2,x3);
				break mainLoop;
			}

		}
	}
}

game.removeAndAddY = function(s1,s2,s3) {
	console.log(s1);

	var x = s1.x;
	var y = s3.y;

	game.context.lineWidth=10;

	game.context.strokeRect(s3.x.toPixel(), s3.y.toPixel(), Number(1).toPixel(),Number(3).toPixel())

	game.animating = true;

	setTimeout(function() {

		game.animating = false;

		game.smiles = _.without(game.smiles, s1,s2,s3);

		game.smiles.push(new game.smile(x, -1));
		game.smiles.push(new game.smile(x, -2));
		game.smiles.push(new game.smile(x, -3));

		_.each(_.filter(game.smiles, function(s) {return s.x === x && s.y < y}), function(s) { s.dy = s.y + 3 });
	}, 1000)
}

game.removeAndAddX = function(s1,s2,s3) {
	console.log(s1);

	var x = s1.x;
	var y = s3.y;

	game.context.lineWidth=10;

	game.context.strokeRect(s3.x.toPixel(), s3.y.toPixel(), Number(3).toPixel(),Number(1).toPixel())

	game.animating = true;

	setTimeout(function() {

		game.animating = false;

		game.smiles = _.without(game.smiles, s1,s2,s3);

		game.smiles.push(new game.smile(s1.x, -1));
		game.smiles.push(new game.smile(s2.x, -1));
		game.smiles.push(new game.smile(s3.x, -1));

		_.each(_.filter(game.smiles, function(s) {return s.x === s1.x && s.y < y}), function(s) { s.dy = s.y + 1 });
		_.each(_.filter(game.smiles, function(s) {return s.x === s2.x && s.y < y}), function(s) { s.dy = s.y + 1 });
		_.each(_.filter(game.smiles, function(s) {return s.x === s3.x && s.y < y}), function(s) { s.dy = s.y + 1 });
	}, 1000)
}