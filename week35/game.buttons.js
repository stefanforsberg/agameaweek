game.actions = {
	Floor1OpenDor12: function() {
		game.map.set(1,2,2,-4);
		game.map.set(1,2,4,undefined);
		game.map.set(2,2,0,-4);
		game.renderScene.render();
	},
	Floor1OpenDoor53: function() {
		game.map.set(5,1,4,undefined);
		game.map.set(5,3,2,-5);
		game.map.set(5,3,4,-5);
		game.map.set(6,3,0,-5);
		game.renderScene.render();
	},
	Floor2FixTeleport: function() {
		game.map.set(7,2,4,undefined);
		game.map.floorData.teleporterFixed = true;
		game.renderScene.render();
	},
	Floor3OpenTimedDoor: function() {
		game.map.set(7, 3, 3, -5);
		game.map.set(7, 4, 1, -5);
		game.map.set(3,0,4,undefined);

		window.setTimeout(function() {
			game.map.set(7, 3, 3, 5);
			game.map.set(7, 4, 1, 5);
			game.map.set(3,0,4,game.actions.Floor3OpenTimedDoor);
			game.sounds[0].play("doorClose");
			game.renderScene.render();
		}
		, 3000);
	}
}

game.buttons = {
	hasButton: function() {
		return game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === 2;
	},
	render: function(playerMap) {
		if(this.hasButton()) {
			game.context.fillStyle = "rgba(255,255,255,.1)"
			game.context.fillRect(200,200,15,15)
		}
	},
	action: function() {
		if(_.isFunction(game.renderScene.playerMap[3][1][4])) {
			game.sounds[0].play("door");
			game.renderScene.playerMap[3][1][4]();
		}
	}
}

game.doors = {
	init: function() {
		this.door0stepsAway = document.createElement("canvas");
		this.door0stepsAway.width = 800;
		this.door0stepsAway.height = 500;
		var context = this.door0stepsAway.getContext("2d");

		context.fillStyle = "rgba(0,0,0,0.6)";
		context.fillRect(150,game.renderWalls.s0.y3 - 390,500,390)
		context.fillStyle = "rgba(1,1,1,0.6)";
		context.fillRect(130,game.renderWalls.s0.y3 - 370,540,370)
		context.moveTo(400, game.renderWalls.s0.y3 - 350);
		context.lineTo(400, game.renderWalls.s0.y3 - 20);
		context.strokeStyle = "rgba(255,255,255,0.5)"
		context.stroke();

		this.doorOpen0stepsAway = document.createElement("canvas");
		this.doorOpen0stepsAway.width = 800;
		this.doorOpen0stepsAway.height = 500;
		var context = this.doorOpen0stepsAway.getContext("2d");

		context.fillStyle = game.renderWalls.s0.colorWall;
		context.fillRect(game.renderWalls.s0.x2,game.renderWalls.s0.y2,80,game.renderWalls.s0.y3 - game.renderWalls.s0.y2)
		context.fillRect(game.renderWalls.s0.x2f-80,game.renderWalls.s0.y2,80,game.renderWalls.s0.y3 - game.renderWalls.s0.y2)
		context.fillRect(game.renderWalls.s0.x2,game.renderWalls.s0.y2,game.renderWalls.s0.x2f - game.renderWalls.s0.x2,50)
		context.fillStyle = "rgba(0,0,0,0.6)";
		context.fillRect(game.renderWalls.s0.x2+60,game.renderWalls.s0.y2+50,20,game.renderWalls.s0.y3 - game.renderWalls.s0.y2 - 50)
		context.fillRect(game.renderWalls.s0.x2f-80,game.renderWalls.s0.y2+50,20,game.renderWalls.s0.y3 - game.renderWalls.s0.y2 - 50)
		context.fillRect(game.renderWalls.s0.x2+80,game.renderWalls.s0.y2+30,game.renderWalls.s0.x2f - game.renderWalls.s0.x2 - 160,20)

		this.door1stepsAway = document.createElement("canvas");
		this.door1stepsAway.width = 800;
		this.door1stepsAway.height = 500;
		context = this.door1stepsAway.getContext("2d");

		context.fillStyle = "rgba(0,0,0,0.6)";
		context.fillRect(280,game.renderWalls.s1.y3 - 210,240,210)
		context.fillStyle = "rgba(1,1,1,0.6)";
		context.fillRect(270,game.renderWalls.s1.y3 - 200,260,200)
		context.moveTo(400, game.renderWalls.s1.y3 - 190);
		context.lineTo(400, game.renderWalls.s1.y3 - 10);
		context.strokeStyle = "rgba(255,255,255,0.2)"
		context.stroke();

		this.doorOpen1stepsAway = document.createElement("canvas");
		this.doorOpen1stepsAway.width = 800;
		this.doorOpen1stepsAway.height = 500;
		var context = this.doorOpen1stepsAway.getContext("2d");

		context.fillStyle = game.renderWalls.s1.colorWall;
		context.fillRect(game.renderWalls.s1.x2,game.renderWalls.s1.y2,50,game.renderWalls.s1.y3 - game.renderWalls.s1.y2)
		context.fillRect(game.renderWalls.s1.x2f-50,game.renderWalls.s1.y2,50,game.renderWalls.s1.y3 - game.renderWalls.s1.y2)
		context.fillRect(game.renderWalls.s1.x2,game.renderWalls.s1.y2,game.renderWalls.s1.x2f - game.renderWalls.s1.x2,40)
		context.fillStyle = "rgba(0,0,0,0.6)";
		context.fillRect(game.renderWalls.s1.x2+40,game.renderWalls.s1.y2+40,10,game.renderWalls.s1.y3 - game.renderWalls.s1.y2 - 40)
		context.fillRect(game.renderWalls.s1.x2f-50,game.renderWalls.s1.y2+40,10,game.renderWalls.s1.y3 - game.renderWalls.s1.y2 - 40)
		context.fillRect(game.renderWalls.s1.x2+50,game.renderWalls.s1.y2+30,game.renderWalls.s1.x2f - game.renderWalls.s1.x2 - 100,10)


		this.door2stepsAway = document.createElement("canvas");
		this.door2stepsAway.width = 800;
		this.door2stepsAway.height = 500;
		context = this.door2stepsAway.getContext("2d");

		context.fillStyle = "rgba(0,0,0,0.6)";
		context.fillRect(310,game.renderWalls.s2.y3 - 150,180,150)

		this.doorOpen2stepsAway = document.createElement("canvas");
		this.doorOpen2stepsAway.width = 800;
		this.doorOpen2stepsAway.height = 500;
		context = this.doorOpen2stepsAway.getContext("2d");

		context.fillStyle = game.renderWalls.s2.colorWall;
		context.fillRect(game.renderWalls.s2.x2,game.renderWalls.s2.y2,30,game.renderWalls.s2.y3 - game.renderWalls.s2.y2)
		context.fillRect(game.renderWalls.s2.x2f-30,game.renderWalls.s2.y2,30,game.renderWalls.s2.y3 - game.renderWalls.s2.y2)
		context.fillRect(game.renderWalls.s2.x2,game.renderWalls.s2.y2,game.renderWalls.s2.x2f - game.renderWalls.s2.x2,30)

		this.button0stepsAway = document.createElement("canvas");
		this.button0stepsAway.width = 800;
		this.button0stepsAway.height = 500;
		context = this.button0stepsAway.getContext("2d");

		context.fillStyle = "rgba(0,0,0,0.3)";
		context.fillRect(680,240,26,26)
		context.fillStyle = "rgba(255,255,255,0.5)";
		context.fillRect(683,243,20,20)

		this.button1stepsAway = document.createElement("canvas");
		this.button1stepsAway.width = 800;
		this.button1stepsAway.height = 500;
		context = this.button1stepsAway.getContext("2d");

		context.fillStyle = "rgba(0,0,0,0.6)";
		context.fillRect(540,200,14,14)
		context.fillStyle = "rgba(255,255,255,0.3)";
		context.fillRect(542,202,10,10)		



	},
	render: function() {
		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === 4) {
			game.context.drawImage(this.door0stepsAway, 0, 0);
			game.context.drawImage(this.button0stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === -4) {
			game.context.drawImage(this.doorOpen0stepsAway, 0, 0);
			game.context.drawImage(this.button0stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === 4) {
			game.context.drawImage(this.door1stepsAway, 0, 0);
			game.context.drawImage(this.button1stepsAway, 0, 0);
		}		

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === -4) {
			game.context.drawImage(this.doorOpen1stepsAway, 0, 0);
			game.context.drawImage(this.button1stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[1][1][game.player.getDirectionIndex(1)] === 4) {
			game.context.drawImage(this.door2stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[1][1][game.player.getDirectionIndex(1)] === -4) {
			game.context.drawImage(this.doorOpen2stepsAway, 0, 0);
		}		

		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === 5) {
			game.context.drawImage(this.door0stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === -5) {
			game.context.drawImage(this.doorOpen0stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === 5) {
			game.context.drawImage(this.door1stepsAway, 0, 0);
		}		

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === -5) {
			game.context.drawImage(this.doorOpen1stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[1][1][game.player.getDirectionIndex(1)] === 5) {
			game.context.drawImage(this.door2stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[1][1][game.player.getDirectionIndex(1)] === -5) {
			game.context.drawImage(this.doorOpen2stepsAway, 0, 0);
		}	

		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === 6) {
			game.context.drawImage(this.button0stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === -6) {
			game.context.drawImage(this.button0stepsAway, 0, 0);
		}

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === 6) {
			game.context.drawImage(this.button1stepsAway, 0, 0);
		}		

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === -6) {
			game.context.drawImage(this.button1stepsAway, 0, 0);
		}
	}
}

game.teleports = {
	init: function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = 800;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");


	},
	render: function() {

		this.particles = [];

		if(this.currentInterval) {
			window.clearInterval(this.currentInterval);
		}

		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === -20) {
			this.context.drawImage(game.canvas, 0, 0);

			for(var i = 0; i < 300; i++) {
				this.particles.push(new game.teleports.particle(1));
			}
			this.currentInterval = window.setInterval(function() { this.render1StepAway() }.bind(this) , 33);
		}

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === -20) {
			this.context.drawImage(game.canvas, 0, 0);

			for(var i = 0; i < 300; i++) {
				this.particles.push(new game.teleports.particle(2));
			}
			this.currentInterval = window.setInterval(function() { this.render1StepAway() }.bind(this) , 33);
		}
	},
	render1StepAway: function() {

		game.context.drawImage(this.canvas, 0, 0);

		this.particles.forEach(function (p) {
			p.draw();
			p.update();
		})
	}
}

game.teleports.particle = function(stepsAway) {

	if(stepsAway === 2) {
		this.x = 380 + Math.random()*40;
		this.y = 70 + Math.random()*250;
		this.size = 1+Math.random()*5;
	} else if(stepsAway === 1) {
		this.x = 300 + Math.random()*200;
		this.y = 30 + Math.random()*350;
		this.size = 5+Math.random()*15;
	}


	this.i = Math.random()*100;
	this.di = 1+Math.random()*15
	this.color = "rgba(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.random()*0.3+ ")"
	return this;
}

game.teleports.particle.prototype.update = function() {
	this.x += 1.8*Math.cos(this.i*Math.PI/180);
	this.y += 0.2*Math.sin(this.i*Math.PI/180);
	this.i+= this.di;
}

game.teleports.particle.prototype.draw = function() {
	game.context.fillStyle = this.color;
	game.context.fillRect(this.x,this.y,this.size,this.size);
}

game.events = {
	render: function() {
		if(game.map.floor === 1) {
			if(game.player.x === 9 && game.player.y === 3) {
				game.sounds[0].play("teleport")
				game.map.loadFloor2();
				game.renderScene.render();
			}
		} else if(game.map.floor === 2) {
			if(game.player.x === 7 && game.player.y === 0) {
				game.sounds[0].play("teleport")
				if(game.map.floorData.teleporterFixed) {
					game.map.loadFloor3();	
				} else {
					game.map.loadFloor2();	
				}
				game.renderScene.render();
			}
		} else if(game.map.floor === 3) {
			if(game.player.x === 0 && game.player.y === 8) {
				game.sounds[0].play("teleport")
				
				game.map.loadFloor4();

				game.renderScene.render();
			}
		}
	}
}

game.text = {
	init: function() {
		game.context.textBaseline = "middle";
		game.context.textAlign = "center";
	},
	render: function() {
		if(game.renderScene.playerMap[3][1][game.player.getDirectionIndex(1)] === 3) {
			game.context.fillStyle = "rgba(255,255,255,0.6)";
			game.context.font = "32px Orbitron";
			this.wrapText(game.renderScene.playerMap[3][1][4], 400,160,500,40);
		}

		if(game.renderScene.playerMap[2][1][game.player.getDirectionIndex(1)] === 3) {
			game.context.fillStyle = "rgba(255,255,255,0.1)";
			game.context.font = "16px Orbitron";
			this.wrapText(game.renderScene.playerMap[2][1][4], 400,160,300,18);
		}		
	},
	// Borrowed from http://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
	wrapText: function (text, x, y, maxWidth, lineHeight) {
	    var lines = text.split("\n");

	    for (var i = 0; i < lines.length; i++) {

	        var words = lines[i].split(' ');
	        var line = '';

	        for (var n = 0; n < words.length; n++) {
	            var testLine = line + words[n] + ' ';
	            var metrics = game.context.measureText(testLine);
	            var testWidth = metrics.width;
	            if (testWidth > maxWidth && n > 0) {
	                game.context.fillText(line, x, y);
	                line = words[n] + ' ';
	                y += lineHeight;
	            }
	            else {
	                line = testLine;
	            }
	        }

	        game.context.fillText(line, x, y);
	        y += lineHeight;
	    }
	}
}