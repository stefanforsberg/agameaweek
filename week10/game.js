var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");
game.width = 800;
game.height = 576;
game.currentBoss = {};
game.bossStopped = new Rx.Subject();
game.bossDead = new Rx.Subject();
game.bossHealthDisplay = document.getElementById("bossHealth");
game.PI2 = 2*Math.PI;

game.load = function() {
	game.init();
}

game.init = function() {
	game.currentBoss = {};	
	game.subscriptions = [];

	var gameEnded = new Rx.Subject();

	game.sources = {
		gameEnded: gameEnded,
		keyDown: Rx.Observable.fromEvent(document, 'keydown').takeUntil(gameEnded),
		keyUp: Rx.Observable.fromEvent(document, 'keyup').takeUntil(gameEnded),
		tick: Rx.Observable.interval(33).takeUntil(gameEnded)
	}
	game.controller.init();

	game.shots.init();

	game.setNewBoss(game.boss1)

	game.minions.init();

	game.player.init();

	

	game.draw();
}



game.controller = {
	init: function() {
		game.subscriptions.push(game.sources.keyDown.scan(function (p, k) {
			console.log(k.keyCode);

			

			if(k.keyCode === 37) {
				p.vx = -p.speed;
			} else if(k.keyCode === 39) {
				p.vx = p.speed;
			} else if(k.keyCode === 38) {
				p.vy = -p.speed
			} else if(k.keyCode === 40) {
				p.vy = p.speed
			} else if(k.keyCode === 49) {
				p.fireBall();
			} else if(k.keyCode === 9) {
				k.preventDefault();
				p.target();
			}

			return p;
		}, game.player).subscribe());

		game.subscriptions.push(game.sources.keyUp.scan(function (p, k) {

			if(k.keyCode === 37) {
				if(p.vx < 0) p.vx = 0;
			} else if(k.keyCode === 39) {
				if(p.vx > 0) p.vx = 0;
			} else if(k.keyCode === 38) {
				if(p.vy < 0) p.vy = 0;
			} else if(k.keyCode === 40) {
				if(p.vy > 0) p.vy = 0;
			}

			return p;
		}, game.player).subscribe());	
	}
}

game.shots = {
	items: [],
	init: function() {
		this.items = [];
	},
	add: function(s) {
		this.items.push(s);
	},
	draw: function() {
		for(var i = this.items.length-1; i >= 0; i--) {
			var s = this.items[i];

			game.context.beginPath();
			game.context.fillStyle = "rgba(137,233,255,0.3)";
			game.context.arc(s.x - s.vx*5,s.y - s.vy*5,s.radius+3,0,game.PI2);
			game.context.fill();


			game.context.beginPath();
			game.context.fillStyle = "rgba(50,210,255,0.5)";
			game.context.arc(s.x - s.vx*2,s.y - s.vy*2,s.radius+2,0,game.PI2);
			game.context.fill();

			game.context.beginPath();
			game.context.fillStyle = "rgba(0,161,255,0.6)";
			game.context.arc(s.x,s.y,s.radius,0,game.PI2);
			game.context.fill();

			s.x += s.vx;
			s.y += s.vy;
		}
	}
}

game.draw = function() {

	game.context.clearRect(0,0, game.width, game.height);

	game.currentBoss.draw();

	game.player.draw();

	game.shots.draw();

	game.fireBall.draw();

	game.minions.draw();

	window.requestAnimationFrame(game.draw);
}

game.player = {
	x: 300,
	y: 400,
	vx: 0,
	vy: 0,
	speed: 2,
	currentTarget: {},
	init: function() {
		this.x = 300;
		this.y = 400;
		this.vx = 0;
		this.vy = 0;
		this.speed = 2;
		this.currentTarget = game.currentBoss;
	},
	draw: function() {
		game.context.beginPath();
		game.context.fillStyle = "#ff00ff";
		game.context.arc(this.x,this.y,20,0,game.PI2);
		game.context.fill();

			game.context.beginPath();
			game.context.strokeStyle = "#ff00ff";
			game.context.lineWidth=5;
			game.context.arc(this.currentTarget.x,this.currentTarget.y,this.currentTarget.radius,0,game.PI2);
			game.context.stroke();

		// if(this.currentTarget === game.currentBoss) {
		// 	game.context.beginPath();
		// 	game.context.strokeStyle = "#ff00ff";
		// 	game.context.lineWidth=5;
		// 	game.context.arc(game.currentBoss.x,game.currentBoss.y,game.currentBoss.radius,0,game.PI2);
		// 	game.context.stroke();
		// } else if(this.currentTarget) {
		// 	game.context.beginPath();
		// 	game.context.strokeStyle = "#ff00ff";
		// 	game.context.lineWidth=5;
		// 	game.context.arc(game.currentBoss.x,game.currentBoss.y,game.currentBoss.radius,0,game.PI2);
		// 	game.context.stroke();
		// }

		this.x += this.vx;
		this.y += this.vy;
	},
	fireBall: function() {
		game.fireBall.add();
	},
	target: function() {

		if(game.minions.items.length === 0 || this.currentTarget !== game.currentBoss) {
			this.currentTarget = game.currentBoss;
		} else {
			this.currentTarget = game.minions.items[0]
		}

		
	}
}

game.fireBall = {
	active: false,
	x: 0,
	y: 0,
	k: 0,
	m: 0,
	radius: 4,
	add: function() {

  		var pointToPoint = game.pointToPoint(game.player, game.player.currentTarget, 4);
		this.vx = pointToPoint.vx;
        this.vy = pointToPoint.vy;
        this.x = game.player.x;
		this.y = game.player.y;

		this.active = true;
	},
	draw: function() {
		var that = this;

		if(!this.active) {
			return;
		}

		if(game.collides(this, game.currentBoss)) {
			game.currentBoss.fireBallHit();
			game.updateBossHealth();
			this.active = false;
			return;
		}

		game.context.beginPath();
		game.context.fillStyle = "rgba(255,21,0,0.4)";
		game.context.arc(this.x - this.vx*2,this.y - this.vy*2,this.radius*3,0,game.PI2);
		game.context.fill();


		game.context.beginPath();
		game.context.fillStyle = "rgba(255,123,0,0.6)";
		game.context.arc(this.x - this.vx,this.y - this.vy,this.radius*1.5,0,game.PI2);
		game.context.fill();


		game.context.beginPath();
		game.context.fillStyle = "rgba(255,216,0,0.8)";
		game.context.arc(this.x,this.y,this.radius,0,game.PI2);
		game.context.fill();

		this.x += this.vx;
		this.y += this.vy;

	}
}

game.updateBossHealth = function() {
	game.bossHealthDisplay.style.width = (game.currentBoss.health + "%");
	if(game.currentBoss.health <= 0) {
		game.bossDead.onNext("dead");
	}
}

game.setNewBoss = function(boss) {
	boss.init();
	game.bossHealthDisplay.style.width = "100%";
	game.currentBoss = boss;

}

game.boss1 = {
	x: 300,
	y: 100,
	radius: 30,
	health: 100,
	isMoving: false,
	level: 0,
	behaviors: [],
	init: function() {
		this.x = 300,
		this.y = 100;
		this.health = 100;
		this.isMoving = false;
		this.behaviors = [];

		var that = this;

		game.bossDead.subscribe(function() {
			that.ding();
		});
	},
	draw: function() {
		this.behaviors.forEach(function (b) {
			b.update();
		})

		game.context.beginPath();
		game.context.fillStyle = "#ffffff";
		game.context.arc(this.x,this.y,this.radius,0,game.PI2);
		game.context.fill();
	},
	ding: function() {
		this.level++;
		this.health = 100;
		game.updateBossHealth();


		if(this.level === 1) {
			this.behaviors.push(new game.behaviorMove())
		} else if(this.level === 2) {
			this.behaviors.push(new game.behaviorStopShot1())
		} else if(this.level === 3) {
			this.behaviors.push(new game.behaviorStopShot2())
		}
	},
	fireBallHit: function() {
		this.health -= 20;
	},
}

game.behaviorStopShot1 = function() {
	this.shots = [];
	this.speed = 1;
	var that = this;
	game.bossStopped.subscribe(function (data) {
		game.shots.add({x: data.x, y: data.y, vx: that.speed, vy: 0, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: -that.speed, vy: 0, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: 0, vy: that.speed, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: 0, vy: -that.speed, radius: 5});
	});
}

game.behaviorStopShot1.prototype.init = function(x, y) {

}

game.behaviorStopShot1.prototype.update = function() {

}

game.behaviorStopShot2 = function() {
	this.shots = [];
	this.speed = 1;
	var that = this;
	game.bossStopped.subscribe(function (data) {
		game.shots.add({x: data.x, y: data.y, vx: -that.speed, vy: -that.speed, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: -that.speed, vy: that.speed, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: that.speed, vy: -that.speed, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: that.speed, vy: that.speed, radius: 5});
	});
}

game.behaviorStopShot2.prototype.init = function(x, y) {

}

game.behaviorStopShot2.prototype.update = function() {

}

game.behaviorMove = function() {
	this.radius = 30;
	this.isMoving = false;
	this.isWaiting = true;
	this.speed = 1;

	var that = this;

	game.bossDead.subscribe(function() {
		that.speed++;
	});
}

game.behaviorMove.prototype.init = function() {
	this.x = 40 + (Math.random()*game.width-40);
	this.y = 40 + (Math.random()*game.height);
	var pointToPoint = game.pointToPoint(game.currentBoss, this, this.speed);
	this.vx = pointToPoint.vx;
    this.vy = pointToPoint.vy;

    var that = this;



	setTimeout(function() { 
		console.log(this);
		that.isMoving = true; 
	}, 3000);    
}

game.behaviorMove.prototype.update = function() {

	if(this.isWaiting) {
		this.init();
		this.isWaiting = false;
	}

	if(!this.isMoving) {

	} else {

		game.context.beginPath();
		game.context.strokeStyle = "rgba(255,255,255,0.5)";
		game.context.arc(this.x,this.y,this.radius,0,game.PI2);
		game.context.stroke();

		game.currentBoss.x += this.vx;
		game.currentBoss.y += this.vy;

		if(Math.abs(game.currentBoss.x - this.x) < 5 &&  Math.abs(game.currentBoss.y - this.y) < 5) {
			game.bossStopped.onNext({x: game.currentBoss.x, y: game.currentBoss.y});
			this.isMoving = false;
			this.isWaiting = true;
		}
	}
}

game.pointToPoint = function(p1, p2, acceleration) {


	var dX = p1.x - p2.x;
	var dY = p1.y - p2.y;

	console.log("p1: " + p1.x);
	console.log("p2: " + p2.x);

	var dist = Math.sqrt(dX*dX+dY*dY);
	return {
		vx: -1*(dX/dist)*acceleration,
    	vy: -1*(dY/dist)*acceleration	
	};
}

game.distance = function(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	
	return Math.sqrt(dx * dx + dy * dy);
}

game.collides = function(s1, s2) {
	var distance = game.distance(s1, s2);
	return (distance < (s1.radius + s2.radius));
}