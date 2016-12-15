var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");
game.pos = 0;
game.deg2rad = Math.PI/180;
game.running = false;
game.dying = false;
game.dyingCounter = 0;

game.load = function() {

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['SFX.mp3'],
		volume: 0.5,
		sprite: {
	    	laser: [0, 200],
	    	playerHit: [950,300],
	    	enemyHit: [1920,300],
	    	powerup: [2870,350],
	    	death: [3350, 1000]
	  	},
		onload: function() {
			
			game.sounds[1] = new Howl({
				urls: ['boss.mp3'], 
				loop: false,
				onload: function() {
					game.sounds[2] = new Howl({
						urls: ['boss_song.mp3'], 
						loop: true,
						onload: function() {
							game.init();
						}
					})
				}
			})
		}		  			
	});

	
}

game.init = function() {

	if(game.requestId) {
		console.log("running, cancelling animation frame")
		window.cancelAnimationFrame(game.requestId);
	}

	game.backgrounds.init();
	game.player.init();
	game.keys.init();
	game.shots.init();
	game.enemies.init();
	game.explosions.init();
	game.powerup.init();
	game.boss.init();
	game.status.init();
	game.running = true;

	game.dyingCounter = 0;
	game.dying = false;
	game.pos = 0;

	var style = game.canvas.getAttribute('style') || '';
	var scale = Math.min(window.innerWidth/game.canvas.width,window.innerHeight/game.canvas.height);
	game.canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');

	

	window.requestAnimationFrame(game.draw);
}

game.draw = function() {

	game.context.clearRect(0,0,640,480);

	if(game.dying) {


		if(game.dyingCounter < 1) {
			
			game.backgrounds.draw();
			game.enemies.draw();
			
			game.explosions.draw();
			game.status.draw();
			game.level.update();

			game.dyingCounter += 0.01;
			game.alpha += 0.02;
			game.context.fillStyle = "rgba(0,0,0," + game.alpha + ")";
			game.context.fillRect(0,0,640,480);

			game.context.fillStyle = "rgba(0,0,0," + game.dyingCounter + ")";
			game.context.fillRect(0,0,640,480);

		} else {
			game.running = false;
		}

		game.context.save();
		game.texts.forEach(function (t) {
			drawText(t);
		})
		game.context.restore();
	} else if(game.boss.dying) {	
		game.backgrounds.draw();
		game.player.draw();
		game.enemies.draw();
		game.explosions.draw();
		game.status.draw();
		game.level.update();
	} else {

		if(game.boss.entering) {
			game.context.save();
			var dx = Math.random()*5;
			var dy = Math.random()*5;
			game.context.translate(dx, dy);  
		}

		game.backgrounds.draw();
		game.player.draw();
		game.shots.draw();
		game.enemies.draw();
		game.boss.draw();
		game.explosions.draw();
		game.powerup.draw();
		game.status.draw();
		game.level.update();
		game.pos++;

		if(game.boss.entering) {
			game.context.restore();

			if(game.boss.active) {
				game.boss.entering = false;
			}
		}
	}





	game.requestId = window.requestAnimationFrame(game.draw);	
	


}

game.backgrounds = {
	init: function() {
		

		this.grd = game.context.createLinearGradient(0, 0, 0, 480);

		this.grd.addColorStop(0, '#020111'); 
		this.grd.addColorStop(0.3, '#3a3a52'); 
		this.grd.addColorStop(0.7, '#5b7983'); 
		this.grd.addColorStop(1.0, '#9da671');

		this.bg01 = new game.background("bg01", 0, 472,4);
		this.bg02 = new game.background("bg02", 0, 330,0.01);
		this.bg032 = new game.background("bg032", 0, 330,0.15);
		this.bg03 = new game.background("bg03", 0, 330,0.54);
		this.bg04 = new game.background("bg04", 0, 330,1);
		this.bg05 = new game.background("bg05", 0, 330,1.5);

		this.stars = [];

		this.starBg = document.createElement("canvas");
		this.starBg.width = 640;
		this.starBg.height = 480;
		var context = this.starBg.getContext("2d")

		for(var i = 0; i < 100; i++) {
			var x = Math.random()*640;
			var y = Math.random()*200;
			var alpha = 0.75*Math.random();
			var size = Math.random()*1.4;
			var b = 220 + Math.floor(Math.random()*35);

			context.beginPath();
			context.fillStyle = "rgba(255,255,"+ b +"," + alpha + ")";
			context.arc(x,y,size,0,2*Math.PI);
			context.fill();
		}

		context.drawImage(document.getElementById("moon"), 550, 50)

	},
	draw: function() {

		game.context.fillStyle = this.grd;
		game.context.fillRect(0,0,640,400)

		game.context.drawImage(this.starBg, 0, 0)

		this.bg01.draw();
		this.bg02.draw();
		this.bg032.draw();
		this.bg03.draw();
		this.bg04.draw();
		this.bg05.draw();

		this.stars.forEach(function (s) {
			s.draw();
		});
	}
}

game.background = function(imgId, x, y, dX) {
	var image = document.getElementById(imgId);

	this.imageWidth = image.width;

	this.bg = document.createElement("canvas");
	this.bg.width = image.width*8;
	this.bg.height = image.height;
	var context = this.bg.getContext("2d")

	for(var i = 0; i < 8; i++) {
		context.drawImage(image,image.width*i,0);	
	}
	
	this.x = x;
	this.y = y;
	this.dX = dX;

	return this;
}

game.background.prototype.draw = function() {

	this.x-=this.dX;

	game.context.drawImage(this.bg , this.x, this.y)

	if(Math.abs(this.x) >= this.imageWidth) {
		this.x = 0;
	}
}

game.star = function() {
	this.x = Math.random()*640;
	this.y = Math.random()*200;
	this.alpha = 0.75*Math.random();
	this.startSeed = Math.floor(Math.random()*360);
	this.size = Math.random()*1.4;
	this.b = 220 + Math.floor(Math.random()*35);
	return this;
}

game.star.prototype.draw = function() {
	game.context.beginPath();
	game.context.fillStyle = "rgba(255,255,"+ this.b +"," + this.alpha + ")";
	game.context.arc(this.x,this.y,this.size,0,2*Math.PI);
	game.context.fill();

	this.alpha += 0.003*Math.sin(this.startSeed*game.deg2rad);

	this.startSeed++;
}

game.player = {
	init: function() {
		this.x = 50;
		this.y = 300;
		this.img = document.getElementById("ship");
		this.weapon = 1;
		this.weaponCooldown = 0;
		this.fumes = [];
		this.width = 32;
		this.height = 32;
		this.health = 3;

		for(var i = 0; i < 100; i++) {
			this.fumes.push(new game.player.fume());
		}
	},
	draw: function() {

		if(!game.boss.entering) {
			
			

			var px = this.x;
			var py = this.y;

			if(game.keys.pressed.u) {
				py-=3;
			} else if(game.keys.pressed.d) {
				py+=3;
			}

			if(game.keys.pressed.l) {
				px-=3;
			} else if(game.keys.pressed.r) {
				px+=3;
			}

			if(px < 10 || px > 600) {
				px = this.x;
			}

			if(py < 10 || py > 440) {
				py = this.y;
			}

			this.y = py;
			this.x = px;

			if(game.keys.pressed.space) {
				if(this.weaponCooldown === 0) {

					game.sounds[0].play("laser");
					
					switch(this.weapon) {
						case 1:
							game.shots.add(new game.shots.shot(this.x+32, this.y+14, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							break;
						case 2:
							game.shots.add(new game.shots.shot(this.x+20, this.y+1, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+14, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+27, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							break;						
						case 3:
							game.shots.add(new game.shots.shot(this.x+20, this.y+1, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+14, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+27, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y, function() { return 0; }, function() { return -6; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+26, function() { return 0; }, function() { return 6; }, game.shots.shotImg))
							break;									
						case 4:
							game.shots.add(new game.shots.shot(this.x+20, this.y+1, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+14, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+27, function() { return 6; }, function() { return 0; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y, function() { return 0; }, function() { return -6; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+26, function() { return 0; }, function() { return 6; }, game.shots.shotImg))	
							game.shots.add(new game.shots.shot(this.x+20, this.y, function() { return 3; }, function() { return -3; }, game.shots.shotImg))
							game.shots.add(new game.shots.shot(this.x+20, this.y+26, function() { return 3; }, function() { return 3; }, game.shots.shotImg))
							break;
					}

					this.weaponCooldown = 20;
				} 
			}

			if(this.weaponCooldown > 0) {
				this.weaponCooldown--;
			}

		}

		game.enemies.items.forEach(function (e) {
			if(game.collides(e, game.player)) {
				if(e.electrical) {
					game.player.death();
				} else {
					game.explosions.add(e.x+16, e.y+16, 100);
					e.remove = true;
					game.player.hit();	
				}

				
			}
		});

		game.shots.itemsEnemy.forEach(function (s) {
			if(game.collides(s, game.player)) {
				s.remove = true;
				game.player.hit();
			}
		});

		this.fumes.forEach(function (f) {
			f.draw();
		});

		game.context.save();
		for(var i = 0; i < this.health; i++) {
			game.context.fillStyle = "rgba(255,255,255,0.5)"
			game.context.fillRect(this.x -15, this.y + 3 +10*i , 5, 5)
		}
		game.context.restore();

		game.context.drawImage(this.img, this.x, this.y)

	},
	hit: function() {
		this.health--;
		if(this.health <= 0) {
			this.death();
		}
		game.sounds[0].play("playerHit");
	},
	death: function() {
		game.dying = true;
		game.texts = [];
	game.texts.push(new text(110,200,46, 8, "GAME OVER", "40px 'Press Start 2P'", "rgba(255,255,255,0.8)"));
	game.texts.push(new text(80,300,18, 2, "Press any key to try again", "14px 'Press Start 2P'", "rgba(255,255,255,0.8)"));
		game.sounds[0].play("death");
		game.sounds[2].stop();
		game.explosions.add(game.player.x+16, game.player.y+16, 100);
	},
	upgradeWeapon: function() {
		if(this.weapon < 4) {
			this.weapon++;
		}
	},
	upgradeHealth: function() {
		if(this.health < 3) {
			this.health++;
		}
	}
}

game.player.fume = function() {
	this.reset();
	return this;
}

game.player.fume.prototype.reset = function() {

	if(Math.random() > 0.5) {
		this.x = game.player.x+3 + 2*Math.random();
		this.y = game.player.y+6 + Math.random();
	} else {
		this.x = game.player.x+3 + 2*Math.random();
		this.y = game.player.y+22 + Math.random();
	}
	
	this.alpha = 0.75 + Math.random()*0.15;
	this.dx = -(0.5+ Math.random());
	this.dy = (-1+2*Math.random())/4;
}

game.player.fume.prototype.draw = function() {
	game.context.fillStyle = "rgba(255," + Math.floor((this.alpha)*255) + ",0," + this.alpha + ")";
	game.context.fillRect(this.x, this.y, 2, 2);
	this.alpha -= 0.1;
	this.x += this.dx;
	this.y += this.dy;

	if(this.alpha <= 0) {
		this.reset();
	}
}

game.keys = {
	pressed: {
		l: false,
		r: false,
		u: false,
		d: false,
		space: false
	},
	init: function() {

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

		keyStream.subscribe(function(k) {
			if(!game.running && game.dying) {
				game.init();
			}

			if(k.keyCode === 32) {
				game.keys.pressed.space = k.pressed
			} else if(k.keyCode === 37) {
				game.keys.pressed.l = k.pressed
			} else if(k.keyCode === 39) {
				game.keys.pressed.r = k.pressed
			} else if(k.keyCode === 38) {
				game.keys.pressed.u = k.pressed
			} else if(k.keyCode === 40) {
				game.keys.pressed.d = k.pressed
			}
		})
	},
	keyPress: function(k) {

	}
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

 function text(x, y, dX, dY, t, font, fillStyle, strokeStyle) {
	this.x = x;
	this.dX = dX;
	this.y = y;
	this.dY = dY;
	this.items = t.split("");
	this.c = Math.floor(Math.random()*360);
	this.font = font;
	this.fillStyle = fillStyle;
	this.strokeStyle = strokeStyle;
	return this;
}

function drawText(t) {
	t.items.forEach(function (letter, index) {

		game.context.font = t.font;

		if(t.fillStyle) {
			game.context.fillStyle = t.fillStyle
			game.context.fillText(letter,t.x + index*t.dX,t.y + t.dY*(index-t.items.length/2)*Math.sin( (t.c+index*3)*(game.deg2rad) ) );
		}
		if(t.strokeStyle) {
			game.context.strokeStyle = t.strokeStyle
			game.context.strokeText(letter,t.x + index*t.dX,t.y + t.dY*(index-t.items.length/2)*Math.sin( (t.c+index*3)*(game.deg2rad) ) );
		}
		
	})

	t.c++;
}