var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");
game.width = 800;
game.height = 576;
game.cardFlipped = new Rx.Subject();

game.load = function() {
	game.init();
}

game.init = function() {
	game.resize();
	game.state.init();
	game.cards.init();

	var source = Rx.Observable.fromEvent(game.canvas, 'click')
		.map(function(e) {
			return {
				x: e.pageX - game.canvas.offsetLeft,
				y: e.pageY - game.canvas.offsetTop
			}
		})
		.subscribe(function(e) {
			if(game.state.canFlip()) {
				game.cards.hit(e);	
			}
		});

	game.cardFlipped.subscribe(function (cf) {
		game.state.handleFlippedCard(cf);
	});

	game.draw();
}

game.draw = function() {
	game.context.clearRect(0, 0, game.width, game.height);

	game.cards.draw();

	window.requestAnimationFrame(game.draw);


}

game.state = {
	flippedCards: [],
	init: function() {
		this.flippedCards = [];
	},
	handleFlippedCard: function(card) {
		if(card.scaleDir < 0) {
			this.flippedCards.push(card);
		} else {
			this.flippedCards = _.without(this.flippedCards, card);
		}

		if(this.flippedCards.length === 2) {
			if(this.flippedCards[0].cardId !== this.flippedCards[1].cardId) {
				var that = this;
				setTimeout(function() {
					that.flippedCards[1].flip();
					that.flippedCards[0].flip();
				}, 1000)
				
			} else {
				this.flippedCards[1].found = true;
				this.flippedCards[0].found = true;
				this.flippedCards = [];
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

	if(this.flipping) {
		game.context.scale(this.scale,1);
		this.scale+= 0.05*this.scaleDir;

		if(Math.abs(this.scale) >= 1) {
			
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
		game.context.fillStyle = "#ffffff";
		game.context.fillRect(-this.width/2, -this.height/2, this.width, this.height)
	} else {
		game.context.drawImage(this.back, -this.width/2, -this.height/2, this.width, this.height);
		//game.context.fillStyle = this.backColor;
		//game.context.fillRect(-this.width/2, -this.height/2, this.width, this.height)
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
