var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");
game.width = 800;
game.height = 576;
game.cardFlipped = new Rx.Subject();
game.subscriptions = [];
game.isRunning = true;

game.load = function() {

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['sound.mp3'],
		sprite: {
	    	kanonbra: [0, 1050],
		    highfive: [1400, 1000],
		    grymt: [2900, 1000],
		    hurra: [4400, 600],
		    snyggtjobbat: [5700, 1300],
		    yeah: [7500, 800],
	  	},
		onload: function() {
			game.init();
		}		  			
	});

	game.soundNames = ["kanonbra", "highfive", "grymt", "hurra", "snyggtjobbat", "yeah"];
	
}

game.init = function() {



	game.subscriptions.forEach(function (s) {
		s.dispose();
	})

	game.subscriptions = [];

	game.resize();
	game.state.init();
	game.cards.init();

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
			if(game.state.canFlip()) {
				game.cards.hit(e);	
			}
		}));

	game.subscriptions.push(game.cardFlipped.subscribe(function (cf) {
		game.state.handleFlippedCard(cf);
	}));

	game.isRunning = true;

	game.draw();
}



game.draw = function() {
	game.context.clearRect(0, 0, game.width, game.height);

	game.cards.draw();

	if(game.isRunning) {
		window.requestAnimationFrame(game.draw);	
	} else {
		game.init();
	}
}

game.state = {
	flippedCards: [],
	init: function() {
		this.flippedCards = [];
	},
	handleFlippedCard: function(card) {

		var that = this;

		if(card.scaleDir < 0) {
			this.flippedCards.push(card);
		} else {
			this.flippedCards = _.without(this.flippedCards, card);
		}

		if(this.flippedCards.length === 2) {
			if(this.flippedCards[0].cardId !== this.flippedCards[1].cardId) {
				
				setTimeout(function() {
					that.flippedCards[1].flip();
					that.flippedCards[0].flip();
				}, 1000)
				
			} else {
				this.flippedCards[1].found = true;
				this.flippedCards[0].found = true;
				var sample = _.sample(game.soundNames);
				game.sounds[0].play(sample);

				this.flippedCards = [];

				if(_.where(game.cards.items, {found: false}).length === 0) {
					setTimeout(function() {
						game.isRunning = false;
					}, 2000)
				}
			}
		}
	},
	canFlip: function() {

		var currentlyFlipping = _.where(game.cards.items, {flipping: true}).length;
		var currentlyFlipped = this.flippedCards.length;

		if(currentlyFlipped === 2) {
			return false;
		}

		if(currentlyFlipped === 1) {
			return currentlyFlipping < 1;
		}

		return currentlyFlipping < 2;
	}
}

game.cards = {
	items: [],
	init: function() {
		this.items = [];
		
		var cardHeight;
		var cardWidth;
		var cardCount = 20;

		var rows = 4;

		var cardsPerRow = 5;

		var cardPadding = 10;

		cardHeight = Math.floor( (game.canvas.height - ((rows-1)*cardPadding)) / rows );
		cardWidth = cardHeight;

		this.gradient=game.context.createLinearGradient(0,0,0,cardHeight/2);
		this.gradient.addColorStop(0,"#E2D9A5");
		this.gradient.addColorStop(1,"#FDF3B8");

		var widthPaddingLeft = (game.width - Math.floor((cardWidth + cardPadding)*cardsPerRow)) / 2;

		var id = 0;
		for(var row = 0; row < rows; row++) {
			for(var cardInRow = 0; cardInRow < cardsPerRow; cardInRow++) {
				var x = widthPaddingLeft + cardInRow*cardWidth + cardPadding*cardInRow;
				var y = row*cardHeight + cardPadding*row;

				

				this.items.push(new game.card(cardWidth, cardHeight, x, y, id))	

				id++;
			}
			
		}

		var backItems = [];

		var images = [];
		images.push(document.getElementById("i01"));
		images.push(document.getElementById("i02"));
		images.push(document.getElementById("i03"));
		images.push(document.getElementById("i04"));
		images.push(document.getElementById("i05"));
		images.push(document.getElementById("i06"));
		images.push(document.getElementById("i07"));
		images.push(document.getElementById("i08"));
		images.push(document.getElementById("i09"));
		images.push(document.getElementById("i10"));

		for(var i = 0; i < (cardCount/2); i++) {
			var back = '#'+Math.floor(Math.random()*16777215).toString(16);
			backItems.push({back: images[i], id: i});
			backItems.push({back: images[i], id: i});
		}

		backItems = _.shuffle(backItems);

		for(var i = 0; i < this.items.length; i++) {
			this.items[i].setBack(backItems[i].back, backItems[i].id);
		}

	},
	draw: function() {
		this.items.forEach(function (i) {
			i.draw();
		});
	}, 
	hit: function(pos) {

		var index = _.findIndex(this.items, function(v, i) { return v.hit(pos.x, pos.y)});

		if(index > -1) {
			this.items[index].flip();
		}
	}
}

game.card = function(width, height, x, y, id) {

	this.width = width;
	this.height = height;
	this.found = false;
	this.x = x;
	this.y = y;
	this.side = "front";
	this.flipping = false;
	this.scale = 1;
	this.scaleDir = -1;
	this.id = id;

	return this;
}

game.card.prototype.setBack = function(back, id) {
	this.back = back;
	this.cardId = id;
}

game.card.prototype.draw = function() {

	game.context.save();

	game.context.translate(this.x+this.width/2,this.y+this.height/2);

	game.context.scale(this.scale,1);

	if(this.flipping) {
		
		this.scale+= 0.05*this.scaleDir;

		if(Math.abs(this.scale) >= 1) {
			
			// if(this.scale < 0) {
			// 	this.scale = -0.99;
			// } else {
			// 	this.scale = 1;
			// }

			this.flipping = false;

			game.cardFlipped.onNext(this);

			
		}
	}

	if(this.scale >= 0) {
		this.side = "front";
	} else {
		this.side = "back";
	}


	if(this.side === "front") {
		game.context.fillStyle = game.cards.gradient;
		game.context.fillRect(-this.width/2, -this.height/2, this.width, this.height)



		game.context.font =  (this.height / 2) + "px Short Stack";

		game.context.fillStyle = "#B39DB5";
		game.context.textAlign = "center";
		game.context.textBaseline = 'middle';
		game.context.fillText("JF", 0, 0, this.width, this.height); 

	} else {
		game.context.drawImage(this.back, -this.width/2, -this.height/2, this.width, this.height);

	}

	game.context.restore();
	
}

game.card.prototype.flip = function () {

	if(this.found) {
		return;
	}

	this.flipping = true;

	if(this.scale > 0) {
		this.scaleDir = -1;
	} else {
		this.scaleDir = 1;
	}
}

game.card.prototype.hit = function(x, y) {
	return x >= this.x && x <= (this.x+this.width) && y >= this.y && y <= (this.y+this.height);
}

game.resize = function() {

    game.canvas.width = Math.floor(window.innerWidth * 0.9);
    game.canvas.height = Math.floor(window.innerHeight * 0.9);

    game.width = game.canvas.width;
    game.height = game.canvas.height;

}
