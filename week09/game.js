var game = game || {};

game.x = 0;
game.y = 0;

game.load = function() {
	game.input = document.getElementById("input");
	game.input.focus();

	game.init();
}

game.init = function() {
	game.x = 0;
	game.y = 0;
	game.scene.init();
	game.commandInput = document.getElementById("input");
	game.lastAction = document.getElementById("lastAction");
	game.reaction = document.getElementById("reaction");
	game.qteContainer = document.getElementById("qteContainer");

	game.qteContainer.style.display = "none"; 

	Rx.Observable
		.fromEvent(document, "click")
		.subscribe(function() {
			game.input.focus();
		});

	Rx.Observable
	  	.fromEvent(game.commandInput, 'keyup')
		.filter(function (k) {
			return (k.keyCode === 13 && game.commandInput.value.length > 0)
		})
		.map(function () {
			return game.commandInput.value.toLowerCase();
		})
		.subscribe(game.command)


	game.start();
}

game.start = function() {

	game.scene.look();
}

game.scene = {
	text: document.getElementById("scene"),
	rooms: [],
	init: function() {
		this.rooms.push(game.scene.room00x00);
		this.rooms.push(game.scene.room00x01);

		this.rooms.push(game.scene.room01x01);
	},
	current: function() {
		return _.find(this.rooms, function (r) { return r.x === game.x && r.y === game.y });
	},
	look: function() {
		this.text.innerHTML = this.current().look();
	},
	move: function(x, y) {
		game.x = x;
		game.y = y;
		this.look();
		game.reaction.innerHTML = "";
		game.reaction.value = "";
		game.input.value = "";
		game.input.focus();
		game.lastAction.innerHTML = "";

		return "--m";
	}
}

game.qte =  {
	element: document.getElementById("qte"),
	start: function(cb) {
		game.lastAction.style.display = "none";
		game.reaction.style.display = "none";
		game.qteContainer.style.display = "block";
		var that = this;
		Rx.Observable
			.timer(2000, 50)
			.map(function(i) { return 100-i;})
			.take(101)
			.subscribe(function(i) {
				that.element.style.width = i + "%";
			}, 
			function (err) {
			},
			function () {
				console.log("cb")
				cb();
			});
	},
	end: function() {
		game.lastAction.style.display = "block";
		game.reaction.style.display = "block";
		game.qteContainer.style.display = "none";
	}
}

game.end = function(t) {
	game.lastAction.style.display = "none";
	game.reaction.style.display = "none";
	game.qteContainer.style.display = "none";

	game.scene.text.innerHTML = t;
}

game.command = function(c) {

	var reaction;

	game.input.value = "";
	game.input.focus();

	if(c.match(/look/gi)) {
		game.scene.look();
		return;
	} else if(c.match(/help/gi)) {
		reaction = "go (west/north/east/south), talk to, touch, take, use and so on"
	} else {
		reaction = game.scene.current().command(c)	
	}

	

	if(!reaction) {

		if(c.match(/talk/gi)) {
			reaction = "There is no one to talk to.";
		} else {
			reaction = "?"	
		}
	} else if(reaction.match(/--m/gi)) {
		return;
	}

	game.lastAction.innerHTML = c;

	game.reaction.innerHTML = reaction;
	
	
}

game.scene.room00x00 = {
	x: 0,
	y: 0,
	look: function() {
		return "You are standing at the edge of the known world. A bonfire is gently sparkling nearby. Did it really have to end like this?"
	},
	command: function(c) {

		if(c.match(/go west/gi)) {
			return "You cannot go west"
		} else if(c.match(/go north/gi)) {
			return "You cannot go north"
		} else if(c.match(/go south/gi)) {
			return game.scene.move(game.x, game.y+1);
		} else if(c.match(/touch (bon)?fire/gi)) {
			return "Ouch, that hurt. The fire is warm. Not sure what you were expecting"
		}
	}
}

game.scene.room00x01 = {
	x: 0,
	y: 1,
	look: function() {
		return "The warmth of the fire to the north can still be felt. A wild river rages to the south."
	},
	command: function(c) {
		if(c.match(/go west/gi)) {
			return "You cannot go west"
		} else if(c.match(/go north/gi)) {
			return game.scene.move(game.x, game.y-1);
		} else if(c.match(/go south/gi)) {
			return "For some reason it does not seem like a good idea to try to swim at this particular part of the river"
		} else if(c.match(/go east/gi)) {
			return game.scene.move(game.x+1, game.y);
		}
	}
}

game.scene.room01x01 = {
	x: 1,
	y: 1,
	qte: true,
	look: function() {
		if(this.qte) {
			game.qte.start(function() {game.command("2")});
			return "Oh no! You can see a girl about to drown in the river. Do you want to try and rescue here? Decide quickly!<br /><br />1 = Rescue, 2 = Don't rescue"	
		}

		return "You are standing near the river where you decided not to rescue the girl who turned out to be a mermaid"
		
	},
	command: function(c) {


		if(this.qte) {
			this.endQte();
			if(c.match(/1/gi)) {
				game.end("You jump into the river to rescue the girl. As you get close her ability to swim seem to improve drastically and before you get a chance to react she drags you to down to a waterfilled grave. Never, ever, never trust a mermaid.")
				return; 
			} else if(c.match(/2/gi)) {
				return "When the girl realise that you will not try to save her her ability to swim seem to improve drastically and as she dives back into the river you can see a mermaids tail."
			}			
		}

		if(c.match(/go west/gi)) {
			return "You cannot go west"
		} else if(c.match(/go north/gi)) {
			return game.scene.move(game.x, game.y-1);
		} else if(c.match(/go south/gi)) {
			return "Remember the mermaid?"
		} else if(c.match(/go east/gi)) {
			return game.scene.move(game.x+1, game.y);
		}
	},
	endQte: function() {
		game.qte.end();
		this.qte = false;
		game.scene.look();
	}
}

