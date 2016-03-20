var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");
game.width = 800;
game.height = 576;
game.currentBoss = {};
game.bossStopped = new Rx.Subject();
game.bossDead = new Rx.Subject();
game.bossHealthDisplay = document.getElementById("bossHealth");
game.bossLevelDisplay = document.getElementById("bossLevel");
game.bossLevel = 0;
game.PI2 = 2*Math.PI;
game.isRunning = false;

game.load = function() {

	game.context.font = "30px Arial";
	game.context.fillStyle = "#ffffff";
	game.context.textAlign="center"; 
	game.context.fillText("Loading...",game.width/2,500);

	game.subscriptions = [];

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['song.mp3'],
		loop: true,
		onload: function() {
			game.init();
		}		  			
	});

	
}

game.init = function() {



	if(game.subscriptions) {
		game.subscriptions.forEach(function (s) {
			s.dispose();
		})
	}

	game.sounds[0].stop(); 
	game.sounds[0].play();

	game.canvas.style.backgroundImage = "url(bg.png)";
	game.currentBoss = {};	
	game.subscriptions = [];

	game.sources = {
		keyDown: Rx.Observable.fromEvent(document, 'keydown'),
		keyUp: Rx.Observable.fromEvent(document, 'keyup'),
	}

	game.fireBall.init();
	game.controller.init();

	game.shots.init();

	game.setNewBoss(game.boss1)

	game.minions.init();

	game.player.init();

	game.isRunning = true;

	game.draw();
}



game.controller = {
	init: function() {
		game.subscriptions.push(game.sources.keyDown.scan(function (p, k) {
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

			if(game.collides(s, game.player)) {
				game.player.hit(20);
				this.items.splice(i, 1);
			}

			if(s.x < 10 || s.x > (game.width+15) || s.y < 10 || s.y > (game.height+15)) {
				this.items.splice(i, 1);
			}

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

	game.minions.draw();

	game.player.draw();



	

	game.shots.draw();

	game.fireBall.draw();

	
	if(game.isRunning) {
		window.requestAnimationFrame(game.draw);	
	} else {
		game.init();
	}
	
}

game.player = {
	x: 300,
	y: 400,
	vx: 0,
	vy: 0,
	speed: 2,
	health: 100,
	radius: 20,
	currentTarget: {},
	image: document.getElementById("player"),
	healthBar: document.getElementById("playerHealth"),
	init: function() {
		this.x = 300;
		this.y = 400;
		this.radius = 20;
		this.vx = 0;
		this.vy = 0;
		this.speed = 2;
		this.currentTarget = game.currentBoss;
		this.health = 100;
		this.healthBar.style.width = this.health + "%";
	},
	draw: function() {

		game.context.drawImage(this.image, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);

		game.context.beginPath();
		game.context.strokeStyle = "rgba(255,123,0,0.8)";
		game.context.lineWidth=2;
		game.context.setLineDash([5, 3]);
		game.context.arc(this.currentTarget.x, this.currentTarget.y,this.currentTarget.radius+2,0,game.PI2);
		game.context.stroke();

		game.context.save();
		game.context.beginPath();
		game.context.strokeStyle = "rgba(255,255,255,0.2)";
		game.context.setLineDash([5, 15]);
		
		game.context.moveTo(this.x, this.y);
		game.context.lineTo(this.currentTarget.x, this.currentTarget.y);
		game.context.stroke();
		game.context.restore();

		this.x += this.vx;
		this.y += this.vy;

		if(this.x <this.radius) {
			this.x = this.radius;
		}

		if(this.x > game.width - this.radius) {
			this.x = game.width - this.radius;
		}

		if(this.y < this.radius) {
			this.y = this.radius;
		}

		if(this.y > game.height - this.radius) {
			this.y = game.height - this.radius;
		}

	},
	fireBall: function() {
		game.fireBall.add();
	},
	hit: function(damage) {
		this.health -= damage;

		if(this.health <= 0) {
			game.isRunning = false;
		}

		this.healthBar.style.width = this.health + "%";
	},
	target: function() {

		var minionTarget = game.minions.nextTarget();

		if(minionTarget) {
			this.currentTarget = minionTarget;
		} else {
			this.currentTarget = game.currentBoss;
		}
	}
}

game.fireBall = {
	balls: [],
	init: function() {
		this.balls = [];
	},
	add: function() {

		if(this.balls.length >= 3) {
			return;
		}

  		var pointToPoint = game.pointToPoint(game.player, game.player.currentTarget, 4);

		this.balls.push({
			vx: pointToPoint.vx,
	        vy: pointToPoint.vy,
	        x: game.player.x,
			y: game.player.y,
			radius: 4
		})
	},
	draw: function() {
		var that = this;

		for(var i = this.balls.length-1; i >= 0; i--) {
			var ball = this.balls[i];
			var remove = false;

			if(game.collides(ball, game.currentBoss)) {
				game.currentBoss.fireBallHit();
				game.updateBossHealth();
				remove = true;
			} 

			if(game.minions.hit(ball)) {
				remove = true;
			};

			if(ball.x < 20 || ball.x > (game.width+20) || ball.y < 20 || ball.y > (game.height+20)) {
				remove = true;
			}

			if(remove) {
				this.balls.splice(i, 1);
				continue;
			}

			game.context.beginPath();
			game.context.fillStyle = "rgba(255,21,0,0.4)";
			game.context.arc(ball.x - ball.vx*2,ball.y - ball.vy*2,ball.radius*3,0,game.PI2);
			game.context.fill();


			game.context.beginPath();
			game.context.fillStyle = "rgba(255,123,0,0.6)";
			game.context.arc(ball.x - ball.vx,ball.y - ball.vy,ball.radius*1.5,0,game.PI2);
			game.context.fill();


			game.context.beginPath();
			game.context.fillStyle = "rgba(255,216,0,0.8)";
			game.context.arc(ball.x,ball.y,ball.radius,0,game.PI2);
			game.context.fill();

			ball.x += ball.vx;
			ball.y += ball.vy;
		}
	}
}

game.updateBossHealth = function() {
	game.bossHealthDisplay.style.width = (game.currentBoss.health + "%");
	game.bossLevelDisplay.innerHTML = game.bossLevel;
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
	behaviors: [],
	img: document.getElementById("boss"),
	init: function() {
		this.x = 300,
		this.y = 100;
		this.health = 100;
		this.isMoving = false;
		this.behaviors = [];
		game.bossLevel = 0;
		this.radius = 30;

		var that = this;

		game.subscriptions.push(game.bossDead.subscribe(function() {
			that.ding();
			that.radius+=2;
		}));

		game.updateBossHealth();
	},
	draw: function() {
		this.behaviors.forEach(function (b) {
			b.update();
		})

		if(game.collides(this, game.player)) {
			game.player.hit(0.5);
		}

		game.context.drawImage(this.img, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2);
	},
	ding: function() {
		this.health = 100;
		game.bossLevel++;
		game.updateBossHealth();

		if(game.bossLevel === 1) {
			this.behaviors.push(new game.behaviorMove())
		} else if(game.bossLevel === 3) {
			this.behaviors.push(new game.behaviorStopShot1())
		} else if(game.bossLevel === 6) {
			this.behaviors.push(new game.behaviorStopShot2())
		}
	},
	fireBallHit: function() {
		if(game.bossLevel >= 5) {
			this.health -= 10;
		} else {
			this.health -= 20;	
		}
		
	},
}

game.behaviorStopShot1 = function() {
	this.speed = 1;
	this.speedRand = 0;
	var that = this;

	game.subscriptions.push(game.bossDead.subscribe(function() {
		that.speedRand++;
	}));

	game.subscriptions.push(game.bossStopped.subscribe(function (data) {
		game.shots.add({x: data.x, y: data.y, vx: that.speed + Math.random()*that.speedRand, vy: 0, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: -(that.speed+ Math.random()*that.speedRand), vy: 0, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: 0, vy: that.speed + Math.random()*that.speedRand, radius: 5});
		game.shots.add({x: data.x, y: data.y, vx: 0, vy: -(that.speed + Math.random()*that.speedRand), radius: 5});
	}));
}

game.behaviorStopShot1.prototype.init = function(x, y) {
	
}

game.behaviorStopShot1.prototype.update = function() {

}

game.behaviorStopShot2 = function() {
	this.shots = [];
	this.speed = 1;
	this.radiusDeltha = 0;
	var that = this;

	game.subscriptions.push(game.bossDead.subscribe(function() {
		that.radiusDeltha++;
	}));

	game.subscriptions.push(game.bossStopped.subscribe(function (data) {
		game.shots.add({x: data.x, y: data.y, vx: -that.speed, vy: -that.speed, radius: 5 + that.radiusDeltha});
		game.shots.add({x: data.x, y: data.y, vx: -that.speed, vy: that.speed, radius: 5 + that.radiusDeltha});
		game.shots.add({x: data.x, y: data.y, vx: that.speed, vy: -that.speed, radius: 5 + that.radiusDeltha});
		game.shots.add({x: data.x, y: data.y, vx: that.speed, vy: that.speed, radius: 5 + that.radiusDeltha});
	}));
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

	game.subscriptions.push(game.bossDead.subscribe(function() {
		that.speed++;
	}));
}

game.behaviorMove.prototype.init = function() {
	this.x = 100 + (Math.random()*(game.width-200));
	this.y = 100 + (Math.random()*(game.height-200));
	var pointToPoint = game.pointToPoint(game.currentBoss, this, this.speed);
	this.vx = pointToPoint.vx;
    this.vy = pointToPoint.vy;

    var that = this;



	setTimeout(function() { 
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