game.player = {
	x: 100,
	y: 100,
	speed: 2,
	smoke: [],
	angle: 0,
	dir: "r",
	img: document.getElementById("ship"),
	imgRight: document.getElementById("ship"),
	imgLeft: document.getElementById("ship_l"),
	width: 32,
	height: 32,
	shots: [],
	shotCooldown: 0,
	showCooldownMax: 10,
	init: function() {
		for(var i = 0; i < 120; i++)	{
			this.smoke.push(new game.player.smokeItem(this.x, this.y));	
		}
		this.shots = [];
	},
	handleShots: function() {

		if(this.shotCooldown > 0) {
			this.shotCooldown--;
		} else {
			if(game.keys.space) {
				console.log("shoooting");
				this.shots.push(new game.player.shot(this.x, this.y, this.dir));

				this.shotCooldown = this.showCooldownMax;

			}
		}

		this.shots.forEach(function (s) {
			s.draw();
		})

		this.shots = _.reject(this.shots, function(t) { return t.remove; })

	},
	draw: function() {

		this.smoke.forEach(function (s) {
			s.draw();
		})

		

		var vx = 0, vy = 0;

		if(game.keys.r) {
			this.img = this.imgRight;
			this.dir = "r";
			vx = this.speed;
		}

		if(game.keys.l) {
			this.img = this.imgLeft;
			this.dir = "l";
			vx = -this.speed;
		}

		if(game.keys.d) {
			vy = this.speed;
		}

		if(game.keys.u) {
			vy = -this.speed;
		}

		this.handleShots();

		if(game.collision.playerBlocked(this.x, (this.y+vy))) {
			vy = 0;
		}

		if(game.collision.playerBlocked((this.x+vx), this.y)) {
			vx = 0;
		}


		this.x += vx;
		this.y += vy;

		this.angle+=2

		game.context.drawImage(this.img, this.x, this.y);


		var relativeScreenPosition = {
			x: this.x - game.offsetX,
			y: this.y - game.offsetY,
		} 

		if( (relativeScreenPosition.x > (game.width/2 + 30) && game.offsetX < (game.map.widthInPixels-game.width)) 
			||
			(relativeScreenPosition.x < (game.width/2 - 30)  && game.offsetX >= 4)
			) {
			game.offsetX+= vx;
		}

		if( (relativeScreenPosition.y > 340 && game.offsetY < (game.map.heightInPixels-game.height)) 
			||
			(relativeScreenPosition.y < 300 && game.offsetY >= 4)
			) {
			game.offsetY+= vy;
		}

		
		



	}
}

game.player.smokeItem = function() {
	this.init();
}

game.player.smokeItem.prototype.init = function() {
	if(game.player.dir === "r") {
		this.x = game.player.x;
		this.vx = -Math.random()/3;
	} else {
		this.x = game.player.x + 32;
		this.vx = Math.random()/3;
	}
	
	this.y = game.player.y+16;
	this.alpha = Math.random();
	this.vy = -Math.random() -0.3;
	this.angle = Math.random()*360;
	this.radius = Math.random();	
}

game.player.smokeItem.prototype.draw = function() {
	this.y += this.vy;
	this.x += this.vx;
	this.alpha -= 0.01;
	this.angle++;
	this.radius += 0.05;

	game.context.beginPath();
    game.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    game.context.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    game.context.fill();
    game.context.closePath();

    if(this.alpha <= 0) {
    	this.init();
    }
}

game.player.shot = function(x,y,dir) {
	this.x = x;
	this.y = y;
	this.dir = dir;

	this.y += game.player.height / 2;

	this.vx = 0;
	this.vy = 0;

	console.log(dir);

	if(game.keys.d && !(game.keys.l || game.keys.r)) {
		this.vy = 3;
		this.x += (game.player.width/2) 
	} else if(game.keys.u && !(game.keys.l || game.keys.r)) {
		this.vy = -3;
		this.x += (game.player.width/2) 
	}
	else if(dir === "r") {
		this.vx = 3;
		this.x += game.player.width;
	} else if(dir === "l") {
		this.vx = -3
	} 



	this.radius = 2;
	return this;
}

game.player.shot.prototype.draw = function() {
	this.x += this.vx;
	this.y += this.vy;

	game.context.beginPath();
    game.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    game.context.fillStyle = "rgba(255, 255, 255, 0.8)";
    game.context.fill();
    game.context.closePath();

    var shotHit = game.collision.shotHit(this.x, this.y);

    if(shotHit) {
    	if(!shotHit.canNotBeShot) {
    		game.map.blockDestroyed(this.x, this.y);	
    		game.explosions.add(this.x, this.y, this.dir);
    	}
    	
    	this.remove = true;
    }
}

game.explosions = {
	items: [],
	colors: ["rgba(0,0,0, ","rgba(100,100,100, ", "rgba(34,34,34, ","rgba(67,67,67, "],
	add: function(x, y, dir) {

		var x = Math.floor((x) / game.map.size)*game.map.size + game.map.size/2;
		var y = Math.floor((y) / game.map.size)*game.map.size + game.map.size/2;

		this.items.push(new game.explosion(x, y));
	},
	draw: function() {
		this.items.forEach(function (e) {
			e.draw();
		});

		this.items = _.reject(this.items, function(t) { return t.remove; })

	},
	color: function() {
		return _.sample(this.colors);
	}
};

game.explosion = function(x, y) {
	this.items = [];
	for(var i = 0; i < 50; i++) {
		this.items.push(new game.explosionItem(x, y))
	}
	return this;
}


game.explosion.prototype.draw = function() {
	this.items.forEach(function (e) {
		e.draw();
	});

	if(this.items[0].alpha <= 0) {
		console.log("alpha 0 - removing");
		this.remove = true;
	}
}

game.explosionItem = function(x, y) {
	this.x = x - 4 + 8*Math.random();
	this.y = y - 4 + 8*Math.random();
	this.color = game.explosions.color();
	this.alpha = 0.6;
	this.vx = ((-1 + 2*Math.random())/2)*Math.random()*3;
	this.vy = ((-1 + 2*Math.random())/2)*Math.random()*3;
	this.angle = Math.random()*360;
	this.dAngel = Math.random()*3;
	this.size = Math.random()*20;	
	return this;
}

game.explosionItem.prototype.draw = function() {
	this.y += this.vy;
	this.x += this.vx;
	this.alpha -= 0.01;
	this.angle+=this.dAngel*1.1;
	this.size -= 0.0001;

	this.vx = this.vx*1.03;
	this.vy = this.vy*1.03;

	game.context.save();
	game.context.beginPath();
	game.context.translate(this.x + this.size/2, this.y + this.size/2);
	game.context.rotate(this.angle*Math.PI/180);		
	game.context.fillStyle = this.color + this.alpha + ")";
    game.context.fillRect(-this.size, -this.size, this.size, this.size);
    game.context.closePath();
    game.context.restore();
}