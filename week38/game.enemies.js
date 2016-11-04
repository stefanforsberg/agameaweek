game.enemies = {
	items: [],
 	init: function() {
 		this.items = [];

 		this.enemy01img = document.getElementById("enemy01")
 		this.enemy02img = document.getElementById("enemy02")
 		this.enemy03img = document.getElementById("enemy03")
 		this.electricalImg = document.getElementById("electrical")
 		this.electrical2Img = document.getElementById("electrical2")
 	},
 	add: function(e) {
 		this.items.push(e)
 	},
 	draw: function() {

 		this.items = _.reject(this.items, function(t) { return t.remove; })

 		this.items.forEach(function (e) {

 			e.draw()

 			game.shots.items.forEach(function (s) {

 				if(game.collides(e, s)) {

 					if(e.shootable) {

 						var isShot = true;

 						if(e.shot) {
 							isShot = e.shot();
 						}

 						if(isShot) {

							if(!e.electrical) {
			 					game.explosions.add(e.x+16, e.y+16, 100)

			 					game.sounds[0].play("enemyHit");

		 						game.powerup.add(e.x+10, e.y+10);
							}


		 					e.remove = true;

		 					
 						}


 					}

 					s.remove = true;


 				}
 			});
 		})
 	}
}



game.enemies.enemy01 = function(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.shootTimer = 100;
	this.shootable = true;
	this.img = game.enemies.enemy01img;
	return this;
}

game.enemies.enemy01.prototype.draw = function() {
	game.context.drawImage(this.img, this.x, this.y)
	this.x-=2;

	if(this.x < -40) {
		this.remove = true;
	}

	this.shootTimer--;

	if(this.shootTimer < 0) {
		game.shots.addEnemy(new game.shots.shot(this.x, this.y+16, function() { return -4; }, function() { return 0; }, game.shots.shot2Img))
		this.shootTimer = 100;
	}
}

game.enemies.enemy02 = function(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.shootTimer = 100;
	this.img = game.enemies.enemy02img;
	this.shootable = true;
	this.a = 0;
	return this;
}

game.enemies.enemy02.prototype.draw = function() {
	game.context.drawImage(this.img, this.x, this.y)
	this.x-=2;
	this.y += 0.7*Math.sin(this.a*Math.PI/180)

	if(this.x < -40) {
		this.remove = true;
	}

	this.shootTimer--;

	if(this.shootTimer < 0) {
		game.shots.addEnemy(new game.shots.shot(this.x, this.y+16, function() { return -3; }, function() { return 0; }, game.shots.shot2Img))
		game.shots.addEnemy(new game.shots.shot(this.x, this.y+16, function() { return 0; }, function() { return -3; }, game.shots.shot2Img))
		game.shots.addEnemy(new game.shots.shot(this.x, this.y+16, function() { return 0; }, function() { return 3; }, game.shots.shot2Img))
		this.shootTimer = 100;
	}

	this.a++;
}

game.enemies.enemy03 = function(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.phace = 0;
	this.img = game.enemies.enemy03img;
	this.c = 0;
	this.spriteIndex = 0;
	this.shootable = true;
	return this;
}

game.enemies.enemy03.prototype.draw = function() {

	this.c++;

	if(this.c > 20) {
		this.spriteIndex++;

		if(this.spriteIndex > 3) {
			this.spriteIndex = 0;
		}

		this.c = 0;
	}

	game.context.drawImage(this.img, 32*this.spriteIndex, 0, this.width, this.height, this.x, this.y, this.width, this.height)
	
	if(this.phace === 0) {
		this.x-=2;

		if(this.x < 200) {
			this.phace = 1;
		}
	} else if(this.phace === 1) {
		this.y += 2;
		this.x += 2;

		if(this.y > 400) {
			this.phace = 2;
		}

	} else if(this.phace === 2) {
		this.x-=2;

		if(this.x < -40) {
			this.remove = true;
		}
	}
}

game.enemies.enemy04 = function(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.phace = 0;
	this.img = game.enemies.enemy03img;
	this.c = 0;
	this.spriteIndex = 0;
	this.shootable = true;
	return this;
}

game.enemies.enemy04.prototype.draw = function() {

	this.c++;

	if(this.c > 20) {
		this.spriteIndex++;

		if(this.spriteIndex > 3) {
			this.spriteIndex = 0;
		}

		this.c = 0;
	}

	game.context.drawImage(this.img, 32*this.spriteIndex, 0, this.width, this.height, this.x, this.y, this.width, this.height)
	
	if(this.phace === 0) {
		this.x+=2;

		if(this.x > 400) {
			this.phace = 1;
		}
	} else if(this.phace === 1) {
		this.y -= 2;
		this.x -= 2;

		if(this.y < 100) {
			this.phace = 2;
		}

	} else if(this.phace === 2) {
		this.x+=2;

		if(this.x > 650) {
			this.remove = true;
		}
	}
}

game.enemies.enemy05 = function(x,y) {
	this.x = x;
	this.y = y;
	this.width = 32;
	this.height = 32;
	this.img = game.enemies.enemy02img;
	this.a = 0;
	this.shootable = true;
	return this;
}

game.enemies.enemy05.prototype.draw = function() {
	game.context.drawImage(this.img, this.x, this.y)
	this.x-=2;
	this.y += 3*Math.sin(this.a*Math.PI/180)

	if(this.x < -40) {
		this.remove = true;
	}

	this.a+=3;
}

game.enemies.electrical = function(x,y, height, img, shootable) {
	this.x = x;
	this.y = y;
	this.width = 12;
	this.electrical = true;
	this.shootable = shootable;
	this.height = height;
	this.images = height / 32;
	this.img = img;
	this.c = 0;
	this.spriteIndex = 0;
	this.health = 100;
	return this;
}

game.enemies.electrical.prototype.shot = function() {
	this.health -= 25;

	return (this.health <= 0);
}

game.enemies.electrical.prototype.draw = function() {

	this.c++;

	if(this.c > 5) {
		this.spriteIndex++;

		if(this.spriteIndex > 3) {
			this.spriteIndex = 0;
		}

		this.c = 0;
	}

	for(var i = 0; i < this.images; i++ ) {
		game.context.drawImage(this.img, 12*this.spriteIndex, 0, this.width, this.height, this.x, this.y + 32*i, this.width, this.height)	
	}

	this.x-= 2;
	
}


game.explosions = {
	items: [],
 	init: function() {
 		this.items = [];
 	},
 	add: function(x, y, amount) {

 		if(!amount) {
 			amount = 100;
 		}

 		for(var i = 0; i < amount; i++) {
 			this.items.push(new game.explosion(x,y));
 		}
 		
 	},
 	draw: function() {
 		this.items.forEach(function (e) {
 			e.draw();
 		})
 	}
}

game.explosion = function(x, y) {
	this.x = x
	this.y = y
	this.dx = 2*Math.random();
	this.dy = (-2 + 4*Math.random()) / 6;
	this.startYellow = Math.floor(Math.random()*255);
	this.alpha = 0.75 + Math.random()*0.15;
	this.size = 2 + Math.random()*3;
	return this;
}

game.explosion.prototype.draw = function() {
	game.context.fillStyle = "rgba(255," + this.startYellow + ",0," + this.alpha + ")";
	game.context.fillRect(this.x, this.y, this.size, this.size);
	this.alpha -= 0.01;

	if(this.startYellow > 0) {
		this.startYellow--;	
	}

	
	this.x += this.dx *(1-this.alpha);
	this.y += this.dy * 3*(1-this.alpha);

	this.size -= 0.03;
}