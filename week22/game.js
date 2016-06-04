var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.colors = ["#ECB200", "#D96D3A", "#D44380", "#ADC800", "#671E46"]

game.tileSize = 32;
game.width = 650;
game.height = 480;
game.subscriptions = [];
game.offsetX = 0;
game.offsetY = 0;
game.floor1 = document.getElementById("floor1");
game.isRunning = false;

game.load = function() {

	game.song = new Howl({
		urls: ['song.mp3'],
		loop: true,
		onload: function() {
			game.loadMap(function (map) {
				game.map.init(map);
				game.init();
			})
		}		  			
	});


	
}

game.keys = {
	l: false,
	r: false,
	u: false
}

game.init = function() {

	game.player.init();
	game.state.init();

	var keyDownStream = Rx.Observable.fromEvent(document, 'keydown')
		.map(function (k) {
			return { 
				keyCode: k.keyCode,
				pressed: true
			}
		});

	var keyUpStream = Rx.Observable.fromEvent(document, 'keyup')
		.map(function (k) {
			return { 
				keyCode: k.keyCode,
				pressed: false
			}
		});	

	var keyStream = Rx.Observable.merge(keyDownStream, keyUpStream);

	game.subscriptions.push(keyStream.subscribe(function (k) {

		if(k.keyCode === 13 && !game.isRunning) {
			game.isRunning = true;
			game.state.start();
			game.song.play();
			game.draw()
		}

		if(k.keyCode === 37) {
			game.keys.l = k.pressed
		} else if(k.keyCode === 39) {
			game.keys.r = k.pressed
		}

		if(k.keyCode === 38) {
			game.keys.u = k.pressed
		}
	}));

	game.context.drawImage(document.getElementById("title"), 0, 0)
	game.context.font="10px 'Press Start 2P'";

	var x = 80;
	var y = 308;

	game.context.fillStyle="rgba(255,255,255,0.7)"
	game.context.strokeStyle="rgba(0,0,0,0.6)"
	game.context.fillRect(x-20,y-20, 530, 170);
	game.context.strokeRect(x-20,y-20, 530, 170);

	game.context.fillStyle="rgba(0,0,0,1)"
	game.context.fillText("You just received a phone call from day care",x, y);
	game.context.fillText("and you need to head back and pick up your kids.",x, y+14*1);
	game.context.fillText("On the way you need to find all your stuff",x, y+14*2);
	game.context.fillText("that for some reason is scattared around the ",x, y+14*3);
	game.context.fillText("office. You suspect that poor imagination was",x, y+14*4);
	game.context.fillText("involved. Also, there are five hidden secrets.",x, y+14*5);

	game.context.fillText("You don't have time to deal with jira tickets",x, y+14*7);
	game.context.fillText("or xml files so avoid them.",x, y+14*8);

	game.context.fillText("Press enter to start.",x, y+14*10);
	
}

game.draw = function(t) {

	game.context.setTransform(1, 0, 0, 1, 0, 0);

	game.context.clearRect(0, 0, game.width, game.height);
	game.context.translate(- game.offsetX, - game.offsetY);
	game.player.update();
	game.context.drawImage(game.floor1, 0, 0)

	game.player.draw();		

	game.chars.draw();

	game.stuff.draw();
	
	if(game.isRunning) {
		window.requestAnimationFrame(game.draw);
	} else {
		var x = 5850;
		var y = 100;

		game.context.font="14px 'Press Start 2P'";

		game.context.fillStyle="rgba(255,255,255,0.7)"
		game.context.strokeStyle="rgba(0,0,0,0.6)"
		game.context.fillRect(x-10,y-30, 450, 170);
		game.context.strokeRect(x-10,y-30, 450, 170);

		game.context.fillStyle="rgba(0,0,0,1)"
		game.context.fillText("Good job!",x, y);
		game.context.fillText("Items fetched: " + game.state.items + " of 4." ,x, y+18*2);
		game.context.fillText("Secrets found: " + game.state.secrets + " of 5.",x, y+18*3);

		game.context.fillText("Tickets assigned to you: " + game.state.tickets,x, y+18*5);

		game.context.fillText("Total time: " + game.state.totalTime() + " seconds.",x, y+18*7);
	}
	
}

game.isOnScreen = function(i) {
	return ((i.x + game.tileSize) >= game.offsetX && i.x < (game.offsetX + game.width - game.tileSize))
}

game.isOnScreenFull = function(i) {
	return game.collides(i, {x: game.offsetX, y: 0, width: game.width, height: game.height});
}

game.collides = function colCheck(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));
    var vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));
    var hWidths = (shapeA.width / 2) + (shapeB.width / 2);
    var hHeights = (shapeA.height / 2) + (shapeB.height / 2);

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        return true;
    }
    return false;
};

game.state = {
	startTime: null,
	endTime: null,
	items: 0,
	secrets: 0,
	tickets: 0,
	init: function() {
		this.startTime = null;
		this.endTime = null;
		this.items = 0;
		this.secrets = 0;
		this.tickets = 0;
	},
	start: function() {
		this.startTime = Date.now();
	},
	stop: function() {
		this.endTime = Date.now();	
	},
	totalTime: function() {
		return Math.abs(Math.round((this.startTime - this.endTime) / 1000));
	},
}

game.player = {
	img: document.getElementById("char"),
	rotation: 0,
	sprite: 0,
	x: 0,
	y: 0,
	width: game.tileSize,
	height: game.tileSize,
	spriteCounter: 0,
	init: function() {
		this.rotation = 0;
		this.sprite = 0;
		this.x = 10;
		this.y = 234;
		this.spriteCounter = 0;
	},
	update: function() {

		


		if(game.keys.l) {
			this.rotation-= 5;
		} else if(game.keys.r) {
			this.rotation+= 5;
		}

		if(game.keys.u) {

			if(this.sprite == 0) {
				this.sprite = 1;
			}

			this.spriteCounter++;

			var nx = this.x + 2*Math.cos(this.rotation*Math.PI/180)
			var ny = this.y + 2*Math.sin(this.rotation*Math.PI/180);

			if(this.spriteCounter % 5 === 0) {
				this.sprite++;	
			}

			if(this.sprite > 8) {
				this.sprite = 1;
			}


			if(nx < 0 ) {
				nx = this.x;
			}

			if(nx > 0 || ny > 0) {
				if(game.map.blocked({x: nx, y: this.y, width: game.tileSize - 4, height: game.tileSize - 4})) {
					nx = this.x;
				}

				if(game.map.blocked({x: this.x, y: ny, width: game.tileSize - 4, height: game.tileSize - 4})) {
					ny = this.y;
				}
			}

			var vx = nx - this.x;

			this.x = nx;
			this.y = ny;

			var relativeScreenPosition = {
				x: this.x - game.offsetX,
				y: this.y - game.offsetY,
			} 

			if( (relativeScreenPosition.x > 340 && game.offsetX < (game.map.width-game.width)) 
				||
				(relativeScreenPosition.x < 300 && game.offsetX >= 4) 
				)  {
				game.offsetX+= Math.round(vx);
			}

			if(game.offsetX < 0) {
				game.offsetX = 0;
			}

			if(this.x > 6304) {

				game.isRunning = false;

				game.state.stop();




				
			}

		} else {
			this.sprite = 0;
			this.spriteCounter = 0;
		}



	},
	draw: function() {
		game.context.save();
		
		game.context.translate(this.x + (game.tileSize/2), this.y + (game.tileSize/2));
		game.context.rotate(this.rotation*Math.PI/180);		
		game.context.drawImage(this.img, 
			this.sprite*game.tileSize, 0, game.tileSize, game.tileSize,
			-(game.tileSize/2), -(game.tileSize/2), game.tileSize, game.tileSize
			);

		game.context.restore();
	}
}