var game = game || {};

game.container = document.getElementById("letters");

game.words2 = ["me","ep","he","ok","go","dj","id","at","ka","ai","we","up","io","my","ar","ol","am","as","ml","to"];
game.words3 = ["len","ray","dpt","ese","mmf","gag","yaw","com","dib","jar","psi","pru","olm","eft","skr","low","tsp","rid","poi","zed"];
game.words4 = ["bohr","eisk","mtif","kohl","leap","lend","thir","yalu","gill","walk","loco","geld","effy","teem","ulna","kush","lier","acol","amin","were","vela","raec","edge","moho","soak","rime","cong","camp","thin","cana","heli","putt","nunu","pear","riel","staw","slay","logo","stob","bush","fars","babi","mony","gari","tele","bute","kepi","marc","toot","merl","snow","dell","dele","puck","nork","dill","lzen","tufa","pers","fogy","calk","rack","best","dook","bist","robe","amen","herb","fino","curn","agee","kurt","kain","malm","exod","pood","told","doss","phot","reef","gyro","blah","edna","aura","type","jube","cure","plug","geum","baud","bema","cans","tyro","loth","aloe","pigg","danu","bind","tire","axon"];
game.words5 = ["cohan","miter","stoup","kyack","right","armor","golem","welch","zarga","evatt","kadar","stupe","befit","middy","ricin","capua","kicva","their","knoll","muffy","phono","kaiak","holst","burke","norge","kokka","serif","amory","guige","start","fluff","ovule","sprue","bound","elver","impel","skivy","ratan","woman","looky","godet","galea","borak","faker","lento","caleb","carma","stomp"];


game.load = function() {

	game.innerWidth = window.innerWidth * .8;
	game.innerHeight = window.innerHeight * .8;

	game.sizeToBaseOn = game.innerWidth > game.innerHeight ? game.innerHeight : game.innerWidth;

	game.letters = [];

	game.wordsText = document.getElementById("wordsText");

	game.currentLevel = 1;

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['sfx.mp3'],
		sprite: {
	    	no: [0, 600],
		    yes: [1000, 5000],
	  	},
		onload: function() {
			game.sounds[1] = new Howl({
				urls: ['solve.mp3'], 
				sprite: {
			    	s2: [0, 1900],
				    s3: [1920, 1900],
				    s4: [3840, 1900],
				    s5: [5756, 1900]
			  	},
				onload: function() {
					game.init();	
				}
			})
		}		  			
	});
}

game.newGame = function(lettersOnRow, words) {
	var size = game.sizeToBaseOn / lettersOnRow;

	game.words = words.slice();

	game.letterArray = [];

	game.allLetters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","R","S","T","U","V","Y"]

	for(var y = 0; y < lettersOnRow; y++) {

		var rowArray = [];

		for(var x = 0; x < lettersOnRow; x++) {
			var s = new game.letter(size, y, x);
			game.letters.push(s);
			rowArray.push(s);
			game.container.appendChild(s.e);
		}	

		game.letterArray.push(rowArray);

		var divider = document.createElement('div');
		divider.style.clear = "both";
		divider.style.width = "1px";
		divider.style.height = "1px";

		game.container.appendChild(divider);
	}

	var wordsToPlace = words;



	game.findPlaceForWord(lettersOnRow, wordsToPlace);


	for(var y = 0; y < lettersOnRow; y++) {
		for(var x = 0; x < lettersOnRow; x++) {
			game.letterArray[y][x].set(_.sample(game.allLetters))
		}	
	}	

	game.wordsText.style.fontSize = Math.round((size / 2)) + "px";

	game.words.forEach(function (w) {
		var e = document.createElement("p");
		e.className = w;
		e.innerText = w;
		game.wordsText.appendChild(e);
	});
	
}

game.findPlaceForWord = function(lettersOnRow, wordsToPlace) {



	if(wordsToPlace.length === 0) {
		return;
	}

	var word = wordsToPlace[0];

	var length = word.length;

	var x = Math.floor(Math.random()*lettersOnRow);
	var y = Math.floor(Math.random()*lettersOnRow);

	var xPos = x;
	var yPos = y;

	var dir = _.sample([[1,0],[0,1]])

	var maxX = xPos + (length-1) * dir[0];
	var maxY = yPos + (length-1)* dir[1];

	if( (maxX >= lettersOnRow || maxX < 0) || (maxY >= lettersOnRow || maxY < 0)) {
		game.findPlaceForWord(lettersOnRow, wordsToPlace);
	} else {

		var collidesWithWord = false;

		for(var i = 0; i < length; i++) {
			if(game.letterArray[yPos][xPos].char !== "") {
				
				collidesWithWord = true;
				break;
			}

			xPos += dir[0];
			yPos += dir[1]
			
		}	

		if(collidesWithWord) {
			game.findPlaceForWord(lettersOnRow, wordsToPlace);
		} else {
			xPos = x;
			yPos = y;

			for(var i = 0; i < length; i++) {
				game.letterArray[yPos][xPos].set(word[i])
				xPos += dir[0];
				yPos += dir[1]
			}	
			wordsToPlace.shift();
		
			game.findPlaceForWord(lettersOnRow, wordsToPlace);
		}
		

	}
}

game.letter = function(size, x, y) {
	this.char = "";
	this.e = document.createElement('div');
	this.e.style.width = Math.floor(size) + "px";
	this.e.style.height = Math.floor(size) + "px";
	this.e.style.display = "inline-block"
	this.e.style.backgroundColor = this.color + "0.2)";
	this.e.style.textAlign = "center";
	this.e.style.lineHeight = Math.floor(size) + "px";
	this.e.style.fontSize = Math.floor(size) + "px";
	this.e.style.textTransform = "uppercase";
	this.e.style.textShadow = "1px 1px rgba(0,0,0,0.3)"
	this.e.style.color = "rgba(255,255,255,1)"
	this.x = x;
	this.y = y;
	this.clicked = false;
	this.solved = false;
	
	this.e.addEventListener("click", this.click.bind(this), false);
	return this;
}

game.letter.prototype.set = function(t, color) {

	if(this.char !== "") {
		return;
	}

	if(color) {
		this.e.style.color = color;
	}

	this.char = t.toLowerCase();
	this.e.textContent = t.toLowerCase();

}

game.letter.prototype.click = function() {

	if(this.solved) {
		return;
	}

	this.clicked = true;

	this.e.style.color = "#bcbcbc"
	this.e.style.textShadow = "1px 1px rgba(0,0,0,0.3)"

	if(game.lastClicked) {
		if((Math.abs(game.lastClicked.x - this.x) > 1) || (Math.abs(game.lastClicked.y - this.y) > 1)) {
			game.clickedLetters.reset(true);
		} 
	}


	game.clickedLetters.add(this);

	
	
}

game.clickedLetters = {
	items: [],
	letters: "",
	reset: function(failed) {

		if(failed && this.letters.length > 1) {
			game.sounds[0].play("no");
		}

		if(this.items.length > 0 ) {
			var notSolvedLetters = _.filter(this.items, function (l) {
				return !l.solved;
			});

			notSolvedLetters.forEach(function (l) {
				l.e.style.color = "rgba(255,255,255,1)" 
				l.e.style.textShadow = "1px 1px rgba(0,0,0,0.3)"
			});
		}

		this.items = [];
		this.letters = ""
	},
	add: function(l) {
		this.items.push(l);
		this.letters += l.char;

		game.lastClicked = l;
	
		var matchesWord = _.some(game.words, function(w) {
			return w.startsWith(this.letters)
		}, this);

		if(!matchesWord) {
			this.reset(true);
		}

		var solvedWord = _.some(game.words, function(w) {
			return w === this.letters;
		}, this);

		if(solvedWord) {

			game.wordsText.getElementsByClassName(this.letters)[0].style.textDecoration = "line-through";

			game.timer.solved();

			game.sounds[1].play("s" + this.letters.length);

			this.items.forEach(function (l) {
				l.e.style.color = "rgba(150,150,150,1)" 
				l.e.style.textShadow = "1px 1px rgba(0,0,0,0.4)"
				l.solved = true;
				l.e.style.animationName = "solved"
				l.e.style.animationDuration = "7s";
				l.e.style.animationIterationCount = "1";
				l.e.style.animationFillMode = "forwards";
			});
				
			game.words = _.reject(game.words, function(w) { 
				return this.letters === w
			}, this);

			this.reset();

			if(game.words.length === 0) {
				game.currentLevel++;
				game.generateNewGame();	
			}
		}
		
	}
}

game.generateNewGame = function() {

	game.clickedLetters.reset();


	game.container.innerHTML = "";
	game.wordsText.innerHTML = "";

	game.squares = [];

	var lettersOnRow;
	var words = [];

	switch(game.currentLevel) {

		case 1:
			lettersOnRow = 4;
			words = ["find", "word"];
			break;		
		case 2: 
			lettersOnRow = 4;
			words.push(_.sample(game.words3));
			words.push(_.sample(game.words4));
			break;
		case 3: 
			lettersOnRow = 4;
			words = words.concat(_.sample(game.words3,3));
			break;
		case 4: 
			lettersOnRow = 4;
			words = words.concat(_.sample(game.words2,3));
			break;		
		case 5: 
			lettersOnRow = 5;
			words = words.concat(_.sample(game.words2,3));
			words = words.concat(_.sample(game.words3,1));
			words = words.concat(_.sample(game.words5,1));
			break;		
		case 6: 
			lettersOnRow = 5;
			words = words.concat(_.sample(game.words2,2));
			words = words.concat(_.sample(game.words5,1));
			break;								
		case 7: 
			lettersOnRow = 6;
			words = words.concat(_.sample(game.words2,1));
			words = words.concat(_.sample(game.words3,2));
			words = words.concat(_.sample(game.words5,2));
			break;		
		case 8: 
			lettersOnRow = 6;
			words = words.concat(_.sample(game.words2,2));
			words = words.concat(_.sample(game.words3,1));
			words = words.concat(_.sample(game.words5,2));
			break;		
		case 9: 
			lettersOnRow = 7;
			words = words.concat(_.sample(game.words2,2));
			words = words.concat(_.sample(game.words3,1));
			words = words.concat(_.sample(game.words4,1));
			words = words.concat(_.sample(game.words5,3));
			break;		
		case 10: 
			lettersOnRow = 8;
			words = words.concat(_.sample(game.words5,1));
			break;	
		case 11: 
			lettersOnRow = 8;
			words = words.concat(_.sample(game.words2,3));
			words = words.concat(_.sample(game.words3,3));			
			words = words.concat(_.sample(game.words5,1));
			break;		
		case 12: 
			lettersOnRow = 8;
			words = words.concat(_.sample(game.words2,3));
			words = words.concat(_.sample(game.words3,3));			
			words = words.concat(_.sample(game.words5,1));
			break;					
	}

	game.newGame(lettersOnRow, words);		
	

}

game.init = function() {
	game.generateNewGame();
	setTimeout(game.timer.update.bind(game.timer), 2000);
}

game.timer = {
	status: 100,
	interval: 500,
	update: function() {
		this.status--;

		if(this.status <= 0) {
			var body = document.getElementsByTagName("body")[0]
			body.innerHTML = "";
			

			var html = document.getElementsByTagName("html")[0]
			html.style.background = "#000";
			
		} else {
			var statusToUse = this.status > 100 ? 100 : this.status;
			game.wordsText.style.background = "linear-gradient(0deg, rgba(255,255,255,0.3) " + statusToUse + "%, transparent 0%)";
			setTimeout(game.timer.update.bind(game.timer), game.timer.interval);	
		}

		
	},
	solved: function() {
		if(this.status < 130) {
			this.status += 10;	
		}

		this.interval-= 3;
	}
}

