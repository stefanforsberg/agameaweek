var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.colors = ["#ECB200", "#D96D3A", "#D44380", "#ADC800", "#671E46"]

game.tileSize = 64;
game.width = 650;
game.height = 650;
game.smiles = [];
game.subscriptions = [];
game.backupCanvas = document.createElement('canvas');
game.backupCanvas.width  = game.width;
game.backupCanvas.height = game.height;
game.backupCanvasContext = game.backupCanvas.getContext("2d");

game.load = function() {

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['solve.mp3'],
		sprite: {
	    	one: [0, 2000],
		    two: [2115, 2000],
		    three: [4300, 2000],
		    four: [6450, 2000],
	  	},
		onload: function() {
			game.sounds[1] = new Howl({
				urls: ['bg.mp3'], 
				loop: true,
				onload: function() {
					game.init();	
				}
			})
		}		  			
	});

	game.soundNames = ["one", "two", "three", "four"];
}

game.animating = false;

game.init = function() {

	game.sounds[1].play();

	for(var y = 0; y < 10; y++) {
		for(var x = 0; x < 10; x++) {
			game.smiles.push(new game.smile(x, y));
		}
	}


		
	game.score.init();
	game.click.init();

	var touchStream = Rx.Observable.fromEvent(game.canvas, 'touchstart')
		.map(function (e) {
			e.preventDefault();
		    var touch = e.touches[0];

		    var boundingRect = game.canvas.getBoundingClientRect()

			return {
				x: (touch.pageX - boundingRect.left),
				y:  (touch.pageY - boundingRect.top)
			}
		});	

	var keyStream = Rx.Observable.fromEvent(game.canvas, 'click')
		.map(function(e) {
			return {
				x: e.pageX - game.canvas.offsetLeft,
				y: e.pageY - game.canvas.offsetTop
			}
		})
		

	game.subscriptions.push(Rx.Observable.merge(touchStream, keyStream).subscribe(function(e) {
		game.click.handle(e);
	}));

	game.context.globalAlpha=0.9;



	game.draw();

}
game.draw = function(t) {

	game.context.clearRect(0,0,game.width, game.height)	

	if(!game.animating) {

		game.context.save();
		game.context.translate(0.5, 0.5);
		game.smiles.forEach(function (o) {
			o.update();
			o.draw();
		});
		
		game.context.restore();

		game.backupCanvasContext.clearRect(0,0,game.width, game.height)	
		game.backupCanvasContext.drawImage(game.canvas, 0, 0);

		if(_.every(game.smiles, function (s) { return s.dy === -1 })) {
			if(!game.findMatches()) {
				game.score.combo = 0;
			} else {
				game.sounds[0].play(_.sample(game.soundNames));
			}
		} 
	} else {
		game.context.globalAlpha=1;
		game.context.drawImage(game.backupCanvas, 0, 0);
		game.context.globalAlpha=0.9;
	}

	game.click.draw();

	game.score.draw();

	window.requestAnimationFrame(game.draw);
}

game.smile = function(x, y) {
	this.x = x;
	this.y = y;
	this.dy = -1;
	this.py = y.toPixel();
	this.color = _.sample(game.colors);;
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
			this.dy = -1;
			

		}
	}
}

game.smile.prototype.click = function(cx, cy) {
	var x = this.x.toPixel();
	var y = this.y.toPixel();
	return cx >= x && cx <= (x+game.tileSize) && cy >= y && cy <= (y+game.tileSize);
}



game.smile.prototype.draw = function() {
	game.context.fillStyle = this.color;
	game.context.fillRect(this.x.toPixel(), this.py, game.tileSize, game.tileSize);
};

game.click = {
	current: [],
	init: function() {
		this.current = [];
	},
	handle: function(pos) {

		if(game.animating) {
			return;
		}

		var index = _.findIndex(game.smiles, function(v, i) { return v.click(pos.x, pos.y)});
		if(index > -1) {
			if(this.current.length === 1) {
				if(!this.legalClick(game.smiles[index])) {
					this.current = [];
					return;
				}
			}
			
			this.current.push(game.smiles[index]);	
		}

		if(this.current.length > 1) {

			var tx = this.current[0].x;
			var ty = this.current[0].y;
			var tpy = this.current[0].py;

			this.current[0].x = this.current[1].x;
			this.current[0].y = this.current[1].y;
			this.current[0].py = this.current[1].py;

			this.current[1].x = tx;
			this.current[1].y = ty;
			this.current[1].py = tpy;

			this.current = [];
		}
	}, 
	draw: function() {

		if(this.current.length > 0) {
			game.context.strokeRect(this.current[0].x.toPixel(), this.current[0].y.toPixel(), Number(1).toPixel(), Number(1).toPixel());
		}
	},
	legalClick: function(candidate) {
		var current = this.current[0];

		var validClicks = [{x: current.x-1, y: current.y}, {x: current.x+1, y: current.y}, {x: current.x, y: current.y-1}, {x: current.x, y: current.y+1}]

		return _.some(validClicks, {x: candidate.x, y: candidate.y})
	}
}

game.findMatches = function() {

	for(var y = 9; y > -1; y--) {
		for(var x = 9; x > -1; x--) {

		    var y1 = _.first(_.where(game.smiles, {x: x, y: y}));	

		    var yCandidates = [y1]

		    for (var yci = y1.y-1;yci > -1; yci--) {
		    	var yciCandidate = _.first(_.where(game.smiles, {x: x, y: yci, color: y1.color}));
		    	if(yciCandidate) {
		    		yCandidates.push(yciCandidate);
		    	} else {
		    		break;
		    	}
		    }

		    if(yCandidates.length > 2) {
		    	game.removeAndAddY(yCandidates);
				return true;
		    }




		    var x1 = _.first(_.where(game.smiles, {x: x, y: y}));	

		    var xCandidates = [x1]

		    for (var xci = x1.x-1;xci > -1; xci--) {
		    	var xciCandidate = _.first(_.where(game.smiles, {x: xci, y: x1.y, color: x1.color}));
		    	if(xciCandidate) {
		    		xCandidates.push(xciCandidate);
		    	} else {
		    		break;
		    	}
		    }

		    if(xCandidates.length > 2) {
		    	game.removeAndAddX(xCandidates);
				return true;
		    }
		}
	}

	return false;
}

game.removeAndAddY = function(yCandidates) {

	var first = _.first(yCandidates);
	var last = _.last(yCandidates);

	game.currentSolved = {
		x: last.x.toPixel(),
		y: last.y.toPixel(),
		w: Number(1).toPixel(),
		h: Number(yCandidates.length).toPixel()
	}

	game.animating = true;

	game.score.add(yCandidates.length, first.x.toPixel() + Number(1).toPixel()/2, last.py + Number(yCandidates.length).toPixel() / 2, _.sample(game.colors));

	setTimeout(function() {

		game.animating = false;

		game.smiles = _.without.apply(_, [game.smiles].concat(yCandidates));

		for(var i = 1; i <= yCandidates.length; i++) {
			game.smiles.push(new game.smile(first.x, -i));
		}

		_.each(_.filter(game.smiles, function(s) {return s.x === first.x && s.y < first.y}), function(s) { s.dy = s.y + yCandidates.length });

		game.currentSolved = null;
	}, 800)
}

game.removeAndAddX = function(xCandidates) {

	var first = _.first(xCandidates);
	var last = _.last(xCandidates);

	game.currentSolved = {
		x: last.x.toPixel(),
		y: last.y.toPixel(),
		w: Number(xCandidates.length).toPixel(),
		h: Number(1).toPixel()
	}

	game.context.strokeRect(last.x.toPixel(), last.y.toPixel(), Number(xCandidates.length).toPixel(),Number(1).toPixel())

	game.animating = true;

	game.score.add(xCandidates.length, last.x.toPixel() + Number(xCandidates.length).toPixel()/2, last.py + Number(1).toPixel() / 2, _.sample(game.colors));

	setTimeout(function() {

		game.animating = false;

		game.smiles = _.without.apply(_, [game.smiles].concat(xCandidates));

		for(var i = 1; i <= xCandidates.length; i++) {
			game.smiles.push(new game.smile(xCandidates[i-1].x, -1));
			_.each(_.filter(game.smiles, function(s) {return s.x === xCandidates[i-1].x && s.y < first.y}), function(s) { s.dy = s.y + 1 });
		}

		game.currentSolved = null;
	}, 800)
}

game.score = {
	points: 0,
	animations: [],
	combo: 0,
	init: function() {
		this.points = 0;
		this.animations = [];
		this.combo = 0;
	},
	add: function(size,x,y, color) {
		this.combo++;

		if(this.combo > 1) {
			var combo = this.combo + " COMBO!"
			this.animations.push(new game.scoreAnimation(combo, x, y, color, 10))
		}

		this.animations.push(new game.scoreAnimation(size, x, y, color, 40))
	},
	draw: function() {

		if(game.currentSolved) {
			game.context.lineWidth=6;
			game.context.strokeStyle = "rgba(255,255,255,0.6)";
			game.context.strokeRect(game.currentSolved.x, game.currentSolved.y, game.currentSolved.w,game.currentSolved.h)
		}

		this.animations.forEach(function (a) {
			a.draw();
		});

		var finishedAnimations = _.filter(this.animations, function(a) { return a.alpha <= 0; })
		this.animations = _.without.apply(_, [this.animations].concat(finishedAnimations))
	}
}

game.scoreAnimation = function(text,x,y,color, size) {
	this.alpha = 100;
	this.x = x;
	this.y = y;
	this.text = text;
	this.size = size;

	color = color.replace("#", "");

	r = parseInt(color.substring(0,2), 16);
    g = parseInt(color.substring(2,4), 16);
    b = parseInt(color.substring(4,6), 16);
 
 	this.color = r + "," + g + "," + b;

	return this;
}

game.scoreAnimation.prototype.draw = function() {

	game.context.save();
	game.context.lineWidth=1;
	game.context.strokeStyle = "rgba(0,0, 0, " + (this.alpha / 100) + ")";
	game.context.fillStyle = "rgba(" + this.color + ", " + (this.alpha / 100) + ")";
	game.context.font = this.size + "px 'Droid Serif'";
	game.context.textAlign = "center";
	game.context.textBaseline = 'middle';
	game.context.strokeText(this.text,this.x,this.y);
	game.context.fillText(this.text,this.x,this.y);
	game.context.restore();

	this.alpha -= 1;
	this.size += 0.5;
}