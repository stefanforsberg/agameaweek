var game = game || {};

game.x = 0;
game.y = 0;
game.dead = false;

game.load = function() {
	game.init();
}

game.init = function() {

	game.input = document.getElementById("input");
	game.input.focus();

	game.commandInput = document.getElementById("input");

	game.lastAction = document.getElementById("lastAction");
	game.reaction = document.getElementById("reaction");
	game.qteContainer = document.getElementById("qteContainer");

	Rx.Observable
		.fromEvent(document, "click")
		.subscribe(function() {
			game.input.focus();
		});

	Rx.Observable
	  	.fromEvent(game.commandInput, 'keyup')
		.filter(function (k) {
			return (k.keyCode === 13 && game.commandInput.value && game.commandInput.value.length > 0)
		})
		.map(function () {
			return game.commandInput.value.toLowerCase();
		})
		.subscribe(game.command.handle)

	game.commandInput.value = "help";

	game.start();
}

game.start = function() {
	game.x = 0;
	game.y = 0;
	game.dead = false;
	game.inventory.init();
	game.scene.init();


	game.qteContainer.style.display = "none"; 

	game.scene.look();

}

game.scene = {
	text: document.getElementById("scene"),
	rooms: [],
	init: function() {
		this.rooms = [];
		this.rooms.push(game.scene.room00x00);
		this.rooms.push(game.scene.room01x00);
		this.rooms.push(game.scene.room02x00);
		this.rooms.push(game.scene.room00x01);
		this.rooms.push(game.scene.room01x01);
		this.rooms.push(game.scene.room02x01);
		this.rooms.push(game.scene.room03x01);
		this.rooms.push(game.scene.room03x02);
		this.rooms.push(game.scene.room02x02);
		this.rooms.push(game.scene.room02x03);
		this.rooms.push(game.scene.room02x04);
	},
	current: function() {
		return _.find(this.rooms, function (r) { return r.x === game.x && r.y === game.y });
	},
	look: function(t) {
		if(t) {
			this.text.innerHTML = t;
		} else {
			this.text.innerHTML = this.current().look();	
		}
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
	qteActive: false,
	start: function(cb) {
		game.lastAction.style.display = "none";
		game.reaction.style.display = "none";
		game.qteContainer.style.display = "block";
		this.element.style.width = "100%";

		this.qteActive = true;

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
				if(that.qteActive) {
					cb();	
				}
			});
	},
	end: function() {
		this.qteActive = false;

		game.lastAction.style.display = "block";
		game.reaction.style.display = "block";
		game.qteContainer.style.display = "none";
	}
}

game.end = function(t) {
	game.dead = true;
	game.lastAction.style.display = "none";
	game.reaction.style.display = "none";
	game.qteContainer.style.display = "none";
	game.commandInput.value = "restart";
	game.scene.text.innerHTML = t;
}

game.inventory = {
	branch: false,
	torch: false,
	dog: false,
	coin: false,
	bribe: false,
	init: function() {
		this.branch = false;
		this.torch = false;
		this.dog = false;
		this.coin = false;
		this.bribe = false;
	}
}

game.command = {

	handle: function(c) {
		var reaction;

		game.input.value = "";
		game.input.focus();

		if(game.dead) {
			game.start();
		}

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
				if(game.inventory.dog) {
					reaction = "You say hi to your dog friend. She seemes to enjoy it."
				} else {
					reaction = "There is no one to talk to.";	
				}
			} else {
				reaction = "?"	
			}
		} else if(reaction.match(/--m/gi) || reaction.match(/--qte/gi)) {
			return;
		}

		game.lastAction.innerHTML = c;

		game.reaction.innerHTML = reaction;
	},
	west: function(c) {
		return c.match(/^go (w|west)$/gi);
	},
	north: function(c) {
		return c.match(/^go (n|north)$/gi);
	},
	east: function(c) {
		return c.match(/^go (e|east)$/gi);
	},
	south: function(c) {
		return c.match(/^go (s|south)$/gi);
	},

	
}

game.scene.room00x00 = {
	x: 0,
	y: 0,
	look: function() {
		return "You are standing at the edge of the known world. A bonfire is gently sparkling nearby."
	},
	command: function(c) {

		if(game.command.west(c)) {
			return "You cannot go west"
		} else if(game.command.north(c)) {
			return "You cannot go north"
		} else if(game.command.south(c)) {
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return game.scene.move(game.x+1, game.y);
		} else if(c.match(/^touch (bon)?fire$/gi)) {
			return "Ouch, that hurt. The fire is warm. Not sure what you were expecting?"
		} else if(c.match(/^use branch with (bon)?fire$/gi)) {
			return this.lightTorch();
		} else if(c.match(/^use (bon)?fire with branch$/gi)) {
			return this.lightTorch();
		}
	},
	lightTorch: function() {
		if(!game.inventory.branch) {
			return "You don't have a branch."
		}

		game.inventory.branch = false;
		game.inventory.torch = true;

		return "You light the branch which can now function as a torch!"
	}
}

game.scene.room01x00 = {
	x: 1,
	y: 0,
	look: function() {

		if(game.inventory.dog) {
			game.inventory.coin = true;
			return "Your dog picks up a scent of something and starts to dig. After a few moments she brings you a golden coin! Good dog!<br /><br /> The entrance to a grand forest can be seen to the east."
		}

		return "The entrance to a grand forest can be seen to the east."
	},
	command: function(c) {

		if(game.command.west(c)) {
			return game.scene.move(game.x-1, game.y);
		} else if(game.command.north(c)) {
			return "You cannot go north"
		} else if(game.command.south(c)) {
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return game.scene.move(game.x+1, game.y);
		} 
	}
}



game.scene.room02x00 = {
	x: 2,
	y: 0,
	branchTaken: false,
	look: function() {
		if(!this.branchTaken) {
			return "The forest is thick and hard to move through. You notice a small branch that seems to have fallen of one of the trees."	
		}

		return "The forest is thick and hard to move through.";
		
	},
	command: function(c) {

		if(game.command.west(c)) {
			return game.scene.move(game.x-1, game.y);
		} else if(game.command.north(c)) {
			return "The thickness of the forest prevents you from moving in that direction";
		} else if(game.command.south(c)) {
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return "The thickness of the forest prevents you from moving in that direction";
		} else if(c.match(/^take branch$/gi) || c.match(/^pick up branch$/gi)) {
			this.branchTaken = true;
			game.inventory.branch = true;
			game.scene.look();
			return "You pick up the branch hoping it will come in handy later.";
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
		if(game.command.west(c)) {
			return "You cannot go west"
		} else if(game.command.north(c)) {
			return game.scene.move(game.x, game.y-1);
		} else if(game.command.south(c)) {
			return "For some reason it does not seem like a good idea to try to swim at this particular part of the river."
		} else if(game.command.east(c)) {
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
			game.qte.start(function() {game.command.handle("2")});
			return "Oh no! You can see a girl about to drown in the river. Do you want to try and rescue here? Decide quickly!<br /><br />1 = Rescue, 2 = Don't rescue"	
		}
		return "You are standing near the river where you decided not to rescue the girl who turned out to be a mermaid."
	},
	command: function(c) {
		if(this.qte) {
			
			if(c.match(/1/gi)) {
				this.endQte();
				game.end("You jump into the river to rescue the girl. As you get close her ability to swim seem to improve drastically and before you get a chance to react she drags you to down to a waterfilled grave. Never, ever, never trust a mermaid.")
				return; 
			} else if(c.match(/2/gi)) {
				this.endQte();
				game.scene.look("When the girl realise that you will not try to save her her ability to swim seem to improve drastically and as she dives back into the river you can see a mermaids tail.");
				return "--qte";
				
			} else {
				return "1 or 2.";
			}		
		} else {
			if(game.command.west(c)) {
				return game.scene.move(game.x-1, game.y);
			} else if(game.command.north(c)) {
				return game.scene.move(game.x, game.y-1);
			} else if(game.command.south(c)) {
				return "Remember the mermaid?"
			} else if(game.command.east(c)) {
				return game.scene.move(game.x+1, game.y);
			}
		}


	},
	endQte: function() {
		game.qte.end();
		this.qte = false;
		game.scene.look();
	}
}

game.scene.room02x01 = {
	x: 2,
	y: 1,
	look: function() {
		return "A bridge can take you over the river to the south."
	},
	command: function(c) {
		if(game.command.west(c)) {
			return game.scene.move(game.x-1, game.y);
		} else if(game.command.north(c)) {
			return game.scene.move(game.x, game.y-1);
		} else if(game.command.south(c)) {
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return game.scene.move(game.x+1, game.y);
		} else if(c.match(/^cross bridge$/gi)) {
			return game.scene.move(game.x, game.y+1);
		}
	}
}

game.scene.room03x01 = {
	x: 3,
	y: 1,
	look: function() {
		return "Standing in front of the bridge to the south is a sour looking guard in expensive looking armor."
	},
	command: function(c) {
		if(game.command.west(c)) {
			return game.scene.move(game.x-1, game.y);
		} else if(game.command.north(c)) {
			return "You can not go north."
		} else if(game.command.south(c)) {
			if(!game.inventory.bribe) {
				return "As you attempt to go south the guard unsheathes her sword and says: 'You will not pass here unless you make it worth my while'."	
			}
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return "You can not go east."
		} else if(c.match(/^give coin$/gi) || c.match(/^give coin to guard$/gi) || c.match(/^use coin on guard$/gi) || c.match(/^use guard on coin$/gi)) {
			if(game.inventory.coin) {
				game.inventory.coin = false;
				game.inventory.bribe = true;
				return "The guard looks pleased and makes a motion that seems to mean that you can pass.";
			}
		} else if(c.match(/talk/gi)) {
			return "The guard does not seem to be interested in chit chatting with you."
		}
	}
}

game.scene.room03x02 = {
	x: 3,
	y: 2,
	look: function() {
		return "You have finished part 1!"
	},
	command: function(c) {
		
	}
}

game.scene.room02x02 = {
	x: 2,
	y: 2,
	look: function() {
		return "You are standing in the chasm between two high cliffs. To the south you can see an entrance to a cave."
	},
	command: function(c) {
		if(game.command.west(c)) {
			return "You can not climb the steep mountain walls.";
		} else if(game.command.north(c)) {
			return game.scene.move(game.x, game.y-1);
		} else if(game.command.south(c)) {
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return "You can not climb the steep mountain walls.";
		}
	}
}

game.scene.room02x03 = {
	x: 2,
	y: 3,
	look: function() {
		if(!game.inventory.torch) {
			return "The cave is damp and very dark. Without some sort of light source it will be very dangerous to try to navigate in here. The bouncing echoes of what sounds like a barking dog can be heard."
		}

		return "Using the torch to spread light reveals that the cave continues further to the south. To the east and west there is is a steep chasm and you can not even see the bottom."
	},
	command: function(c) {

		if(!game.inventory.torch) {
			if(game.command.west(c)) {
				return "It's too dark to dare to take a chance going that direction";
			} else if(game.command.north(c)) {
				return game.scene.move(game.x, game.y-1);
			} else if(game.command.south(c)) {
				return "It's too dark to dare to take a chance going that direction";
			} else if(game.command.east(c)) {
				return "It's too dark to dare to take a chance going that direction";
			}
		}

		if(game.command.west(c)) {
			return "You can not go in that direction.";
		} else if(game.command.north(c)) {
			return game.scene.move(game.x, game.y-1);
		} else if(game.command.south(c)) {
			return game.scene.move(game.x, game.y+1);
		} else if(game.command.east(c)) {
			return "You can not go in that direction.";
		}
	}
}



game.scene.room02x04 = {
	x: 2,
	y: 4,
	qte: true,
	look: function() {
		if(this.qte) {
			game.qte.start(function() {game.command.handle("XXX")});
			return "A huge bear comes running towards you!<br /><br />1 = Sprint left, 2 = Play dead"	
		}
		
		if(!game.inventory.dog) {
			game.inventory.dog = true;
			return "Your quick sprint to the left causes the bear to just miss you. Before it has a chance to slow down it tumbles over the edge and falls to its death.<br /><br />After the commotion with the bear you notice a small dog that is happyly wagging it's tail. Looks like it will follow you."	
		}

		return "You are standing at the end of cave"
		
	},
	command: function(c) {

		if(this.qte) {
			
			if(c.match(/1/gi)) {
				this.endQte();
				return "--qte"; 
			} else if(c.match(/2/gi)) {
				this.endQte();
				game.end("The bear doesn't fall for your simple trick, instead of just playing dead - you are dead.")
			} else if(c.match(/XXX/gi)) {
				this.endQte();
				game.end("Your inability to act makes it easy for the bear to devour you.");
			} else {
				return "1 or 2";
			}		
		} else {
			if(game.command.west(c)) {
				return "You can not go that way."
			} else if(game.command.north(c)) {
				return game.scene.move(game.x, game.y-1);
			} else if(game.command.south(c)) {
				return "You can not go that way."
			} else if(game.command.east(c)) {
				return "You can not go that way."
			}
		}
	},
	endQte: function() {
		game.qte.end();
		this.qte = false;
		game.scene.look();
	}
}

