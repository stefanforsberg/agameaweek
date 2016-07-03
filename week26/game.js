var game = game || {};

game.container = document.getElementById("squares");

game.load = function() {

	game.innerWidth = window.innerWidth * .8;
	game.innerHeight = window.innerHeight * .8;

	game.sizeToBaseOn = game.innerWidth > game.innerHeight ? game.innerHeight : game.innerWidth;

	game.squares = [];

	game.currentLevel = 1;

	game.canClick = false;

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['sfx.mp3'],
		sprite: {
	    	no: [0, 600],
		    yes: [1000, 5000],
	  	},
		onload: function() {
			game.sounds[1] = new Howl({
				urls: ['song.mp3'], 
				loop: true,
				onload: function() {
					game.init();	
				}
			})
		}		  			
	});
}

game.go = {
	init: function() {
		this.button = document.getElementById("go");
		this.button.addEventListener("click", this.click.bind(this), false);

		this.text = document.getElementById("text");

		game.go.start();
	},
	start: function() {
		this.text.style.display = "none";
		this.button.innerHTML = "L" + game.currentLevel + " GO"
		this.button.style.display = "inline-block";
	},
	click: function() {
		this.button.style.display = "none";
		this.setText("MEMORIZE");

		window.setTimeout(function() { 
			game.go.setText("");
			game.startNewGame();
		}, 4000);
	},
	setText: function(text) {
		if(text.length > 0) {
			this.text.innerHTML = text
			this.text.style.display = "inline";
		} else {
			this.text.innerHTML = ""
			this.text.style.display = "none";
		}
	}
}

game.showSolution = function(i) {

	if(i >= game.numberLit) {

		game.canClick = true;

		game.go.setText("REPEAT")

		window.setTimeout(function() { 
			game.go.setText("");
		}, 2000);

		return;
	}

	game.squaresOrder[i].addGlow();

	window.setTimeout(function() { game.squaresOrder[i].removeGlow(); }, game.delay / 2);
	window.setTimeout(function() { game.showSolution(i+1); }, game.delay);
}

game.newGame = function(numberOfSquaresOnRow, numberLit, delay) {
	var size = game.sizeToBaseOn / numberOfSquaresOnRow;

	game.delay = delay;
	game.clickCounter = 0;
	game.numberLit = numberLit;

	for(var y = 0; y < numberOfSquaresOnRow; y++) {
		for(var x = 0; x < numberOfSquaresOnRow; x++) {
			var s = new game.square(size, y, x);
			game.squares.push(s);
			game.container.appendChild(s.e);
		}	

		var divider = document.createElement('div');
		divider.style.clear = "both";
		divider.style.width = "1px";
		divider.style.height = "1px";

		game.container.appendChild(divider);
	
	}
}

game.square = function(size, x, y) {
	this.color = "rgba(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ",";
	this.e = document.createElement('div');
	this.e.style.width = Math.floor(size) + "px";
	this.e.style.height = Math.floor(size) + "px";
	this.e.style.margin = "10px";
	this.e.style.display = "inline-block"
	this.e.style.backgroundColor = this.color + "0.2)";
	this.glow = "0px 0px " + Math.round(size/10) + "px " + this.color + "0.3)" + "," + "0px 0px " + Math.round(size/5) + "px #fff";
	this.x = x;
	this.y = y;
	this.e.addEventListener("click", this.click.bind(this), false);
	return this;
}

game.square.prototype.click = function() {

	if(!game.canClick) {
		return;
	}

	this.addGlow();

	var correctSquare = game.squaresOrder[game.clickCounter];

	game.clickCounter++;

	if(correctSquare.x === this.x && correctSquare.y === this.y) {

		if(game.clickCounter === game.numberLit) {
			game.sounds[0].play("yes");
			game.go.setText("<3");

			window.setTimeout(function() { 
				game.currentLevel++;
				game.go.start();
				game.generateNewGame(); 
			}, 2000);
		}

	} else {
		game.sounds[0].play("no");
		game.go.setText("NO");

		window.setTimeout(function() { 
			game.go.start();
			game.generateNewGame(); 
		}, 2000);
	}
	
	
}

game.square.prototype.addGlow = function() {
	this.e.style.boxShadow = "0px 0px 40px #fff" + "," + this.glow
}

game.square.prototype.removeGlow = function() {
	
	this.e.style.boxShadow = "none";	
}

game.generateNewGame = function() {

	game.canClick = false;

	game.container.innerHTML = "";

	game.squares = [];

	if(game.currentLevel === 10) {
		game.newGame(1, 1, 2000);
		game.go.button.style.display = "none";
		game.go.setText("Done");
		return;
	}

	switch(game.currentLevel) {
		case 1: 
			game.newGame(2, 2, 2000);		
			break;
		case 2:
			game.newGame(2, 4, 2000);
			break;
		case 3:
			game.newGame(3, 4, 2000);
			break;			
		case 4:
			game.newGame(3, 6, 2000);
			break;		
		case 5:
			game.newGame(3, 9, 2000);
			break;		
		case 6:
			game.newGame(4, 4, 3000);
			break;		
		case 7:
			game.newGame(4, 6, 3000);
			break;			
		case 8:
			game.newGame(4, 8, 3000);
			break;													
		case 9:
			game.newGame(4, 16, 3000);
			break;							
	}
	

}

game.startNewGame = function() {
	game.squaresOrder = _.shuffle(game.squares);

	window.setTimeout(function() { game.showSolution(0); }, 2000);
	
}

game.init = function() {
	game.sounds[1].play();
	game.go.init();
	game.generateNewGame();
}

