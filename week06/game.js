var game = game || {};

game.width = 1600;
game.height = 650;
game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.trees = [];

game.draw = function() {

	game.context.clearRect(0,0, game.width, game.height);

	game.context.drawImage(document.getElementById("bg"), 0, 0);

	game.environment.draw();

	game.trees.forEach(function (t) {
		t.draw();
	})

	game.context.drawImage(document.getElementById("icons_top"), 600, 20);

	game.tools.draw();

	window.requestAnimationFrame(game.draw);
}


game.load = function() {
	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['song.mp3'],
		loop: true,
		onload: function() {
			game.sounds[1] = new Howl({
				urls: ['bird.mp3'],
				loop: true,
				onload: function() {
					game.sounds[2] = new Howl({
						urls: ['cricket.mp3'],
						loop: true,
						onload: function() {
							game.init();
						}		  			
					})
				}		  			
			})
		}		  			
	})

	
}

game.init = function() {

	game.sounds[0].fadeIn(0.3, 20000);
	game.sounds[1].fadeIn(0.3, 20000);

	game.trees = [];

	game.context.drawImage(document.getElementById("bg"), 0, 0);

	game.trees.push(new game.tree(250, 650));

	game.trees.push(new game.tree(800, 650));

	game.trees.push(new game.tree(1350, 650));
	
	console.log("before init");
	game.environment.init();
	console.log("after init");

	game.tools.init();

	game.draw();
}

game.tools = {
	currentTool:null,
	currentPos: {},
	iconWater: document.getElementById("icon_water"),
	iconLeaf: document.getElementById("icon_leaf"),
	iconFood: document.getElementById("icon_food"),
	init: function() {
		var self = this;

		this.currentTool = null;
		this.currentPos = {};

		Rx.Observable.fromEvent(game.canvas, 'click').map(game.mapForMouseCoords).subscribe(function(m) {

			if(m.x > 612 && m.x < 700 && m.y > 87 && m.y < 181) {
				self.currentTool = self.iconWater;
			} else if(m.x > 745 && m.x < 839 && m.y > 30 && m.y < 129) {
				self.currentTool = self.iconFood;
			} else if(m.x > 890 && m.x < 985 && m.y > 83 && m.y < 193) {
				self.currentTool = self.iconLeaf;
			} 

			if(self.currentTool)
			{
				var cures;

				if(self.currentTool === self.iconWater)
				{
					cures = "water"
				} else if(self.currentTool === self.iconLeaf) {
					cures = "leaf"
				} else if(self.currentTool === self.iconFood) {
					cures = "food"
				}

				if(m.x > 23 && m.x < 461 && m.y > 225 && m.y < 650) {
					game.trees[0].cure(cures);
				} else if(m.x > 543 && m.x < 1040 && m.y > 225 && m.y < 650) {
					game.trees[1].cure(cures);
				} else if(m.x > 1150 && m.x < 1580 && m.y > 225 && m.y < 650) {
					game.trees[2].cure(cures);
				}
			}

			

		});

		Rx.Observable.fromEvent(game.canvas, 'mousemove').map(game.mapForMouseCoords).subscribe(function(m) {
			self.currentPos = {
				x: m.x - 42,
				y: m.y - 60
			};
		});
	},
	draw: function() {
		
		if(this.currentTool) {
			game.context.globalAlpha = 0.3;
			game.context.drawImage(this.currentTool, this.currentPos.x, this.currentPos.y);
			game.context.globalAlpha = 1;
		}
		
	}
}

game.glowWorm = function(xBase, yBase) {
	this.colors = ["rgba(99,203,230, 0.3)", "rgba(255,216,0, 0.3)"];

	this.reset(xBase, yBase);

	return this;
}

game.glowWorm.prototype.reset = function(xBase, yBase) {
	this.vx = (2*Math.random()-1) / 10;
	this.vy = -0.3*(Math.random());
	this.radius = 1 + Math.random()*6;
	this.x = xBase -150 + Math.random()*300;
	this.y = yBase - 20 + 40*Math.random();
	this.a = Math.random()*360;
	this.divergence = Math.random()*3;
	this.color = this.colors[Math.floor(this.colors.length*Math.random())];
}

game.glowWorm.prototype.draw = function() {



}

game.environment = {

	glowWorms: [],
	glowWormAlpha: 0,
	minutes: 480,
	tick: 0,
	day: 0,

	init: function() {

		this.tick = 0;
		this.minutes = 1020;
		this.day = 0;
		this.resetNight();

		this.canvas = document.createElement('canvas');
		this.canvas.width = game.width;
		this.canvas.height = game.height;
		this.ctx = this.canvas.getContext("2d");
	},
	resetNight: function() {
		this.glowWormAlpha = 0;
		this.glowWorms.length = 0;

		for(var t = 0; t < game.trees.length; t++) {
			for(var i = 0; i < 100; i++) {
				this.glowWorms.push(new game.glowWorm(game.trees[t].x, game.trees[t].lastHeight));
			}
		}
	},
	draw: function() {

		this.ctx.clearRect(0,0,game.width, game.height);

		this.tick++;

		if(this.tick % 5 === 0) {
			this.minutes++;

			if(this.minutes > 1440) {
				this.minutes = 0;
				this.day++;
			}
		}

		var alpha;

		if(this.minutes >= 0 && this.minutes < 120) {
			alpha = 0.9;
		}
		else if(this.minutes >= 120 && this.minutes < 600) {
			alpha = 0.9*Math.abs((this.minutes - 600) / 480);
		}  else if(this.minutes > 1080) {
			alpha =  0.9 - 0.9*Math.abs((this.minutes - 1440 ) / (1440-1080)) ;
		} else {
			alpha = 0;
		}


		this.ctx.clearRect(0, 0, game.width, game.height);

		this.ctx.fillStyle = "rgba(0, 0, 0, " +alpha + ")";
		this.ctx.fillRect(0, 0, game.width, game.height);


		if(this.minutes > 1380 || this.minutes < 300) {
			this.glowWorm();
		}

		if(this.minutes === 480) {
			this.resetNight();
		}

		game.context.drawImage(this.canvas, 0 , 0);
		this.drawClock();

		if(this.minutes === 420) {
			game.sounds[1].fadeIn(0.3, 10000);
			game.sounds[2].fadeOut(0, 10000);
		}

		if(this.minutes === 1140) {
			game.sounds[2].fadeIn(0.3, 10000);
			game.sounds[1].fadeOut(0, 10000);
		}

		


	},
	drawClock: function() {
		var hour = ((((this.minutes*60)%12))*Math.PI/6) + (this.minutes*Math.PI/(6*60))

    	game.context.save();
    	game.context.translate(1570,30)

    	game.context.beginPath();
    	game.context.arc(0, 0, 25, 0, 2*Math.PI);
	    game.context.lineWidth = 1;
	    game.context.fillStyle ="rgba(255,255,255, 0.2)";
	    game.context.strokeStyle = "rgba(0,0,0,0.3)";
	    game.context.fill();
	    game.context.stroke();

    	game.context.beginPath();
	    game.context.lineWidth = 3;
	    game.context.lineCap = "round";
	    game.context.moveTo(0,0);
	    game.context.rotate(hour);
	    game.context.lineTo(0, -15);
	    game.context.strokeStyle = "rgba(0,0,0,0.7)";
	    game.context.stroke();
	    game.context.rotate(-hour);
	    game.context.restore();

	    var amPm = this.minutes <= 720 ? "AM" : "PM";

		game.context.font = "14px Arial";
		game.context.textAlign="center"; 
		game.context.fillText("Day " + this.day + " " + amPm,1500,35);
	},
	glowWorm: function() {

		for(var t = 0; t < this.glowWorms.length; t++)
		{


			if(this.minutes > 120 && this.minutes < 300) {
				this.glowWormAlpha -= 0.000005;

				if(this.glowWormAlpha < 0) {
					this.glowWormAlpha = 0;
				}
			} else {
				if(this.glowWormAlpha < 0.6) {
					this.glowWormAlpha += 0.00001;	
				}	
			}

			var p = this.glowWorms[t];
			
			this.ctx.beginPath();
			
			var gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
			gradient.addColorStop(0, "white");
			gradient.addColorStop(0.1, "white");
			gradient.addColorStop(0.4, p.color);
			gradient.addColorStop(1, "transparent");
			
			this.ctx.globalAlpha = this.glowWormAlpha;
			this.ctx.fillStyle = gradient;
			this.ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
			this.ctx.fill();
			this.ctx.globalAlpha = 1

			p.x += p.vx + 0.1*Math.cos(p.a*Math.PI/180)*p.divergence;
			p.y += p.vy;
			p.radius += Math.abs(0.1*Math.cos(p.a*Math.PI/180)*p.divergence)/20;

			p.a+= p.divergence/3;
		}

		
	}
}



game.tree = function(x, h) {

	this.x = x;
	this.canvases = [];
	this.statuses = []
	this.currentGeneration = 5;
	this.currentGenerationLife = 0;
	this.lifeForce = 1000;

	this.generations = [];

	this.length = 80 +  Math.round(Math.random()*35)
	this.divergence = 15 + Math.round(Math.random()*20)
	this.reduction = 0.70 + Math.random()*5/100

	this.isReady = false;

	this.lineWidth = 10;
	
	//This is the end point of the trunk, from where branches will diverge
	

	var trunk = {x: x, y: this.length+50, angle: 90};
		//It becomes the start point for branches
		this.start_points = []; //empty the start points on every init();
		this.start_points.push(trunk);

	//Y coordinates go positive downwards, hence they are inverted by deducting it
	//from the canvas height = H

	var canvas = document.createElement('canvas');
	canvas.width = game.width;
	canvas.height = game.height;
	var ctx = canvas.getContext("2d");

	ctx.beginPath();
	ctx.moveTo(trunk.x, h-50);
	ctx.lineTo(trunk.x, h-trunk.y);
	ctx.strokeStyle = "#925c00";
	ctx.lineWidth = this.lineWidth;
	ctx.stroke();

	this.canvases.push(canvas);
	
	this.generate(h,1);
}

game.tree.prototype.cure = function(type) {
	var itemToCure = _.findLastIndex(this.statuses, function(s) {console.log("t: " + s.type); return s.type === type;});
	if(itemToCure > -1) {
		this.statuses.splice(itemToCure, 1);	

		if(this.statuses.length === 0) {
			if(this.lifeForce < 0) {
				this.lifeForce = 0;
			}
		}
	}
	
}

game.tree.prototype.draw  = function() {


	if(this.lifeForce > 0) {
		if(this.currentGenerationLife >= 100) {

			if(this.currentGeneration >= (this.canvases.length-1)) {
				this.currentGenerationLife = 100;
			} else {
				this.currentGenerationLife = 0;
				this.currentGeneration++;	
			}
		}

		this.currentGenerationLife++;
	} else {
		if(this.currentGenerationLife <= 0) {
			this.currentGenerationLife = 100;
			this.currentGeneration--;
		}	

		this.currentGenerationLife--;
	}

	

	if(this.currentGeneration < 0) {
		this.currentGeneration = 0;
		this.lifeForce = this.canvases.length*100;
	}

	for(var i = 0; i < this.currentGeneration; i++) {
		game.context.drawImage(this.canvases[i], 0, 0);
	}

	game.context.globalAlpha = this.currentGenerationLife/100;
	game.context.drawImage(this.canvases[this.currentGeneration], 0, 0);
	game.context.globalAlpha = 1;

	if(Math.random() < 0.001) {
		this.statuses.push(new game.treeStatus(this.x))
	}

	this.statuses.forEach(function (o) {
		o.draw();
	});

	this.lifeForce -= this.statuses.length;

	if(this.statuses.length === 0) {
		this.lifeForce++;
	}

	this.currentGenerationLifeDelta = 0;
	
}

game.treeStatus = function(x) {
	this.x = x - 20 -100 + Math.random()*200;
	this.y = 500 + Math.random()*60;

	var r = Math.random();

	if(r < 0.33) {
		this.sprite = document.getElementById("icon_water_small");
		this.type = "water";
	} else if(r < 0.66) {
		this.sprite = document.getElementById("icon_food_small");
		this.type = "food";
	} else {
		this.sprite = document.getElementById("icon_leaf_small");
		this.type = "leaf";
	}

	if(r > 0.5) {
		this.dir = -1;
	} else {
		this.dir = 1;
	}
	
	this.a = Math.random()*360;

	return this;
}

game.treeStatus.prototype.draw = function() {
	game.context.globalAlpha = 0.8;
	game.context.drawImage(this.sprite, this.x + 7*Math.cos(this.a*Math.PI/180), this.y+ 7*Math.sin(this.a*Math.PI/180));
	game.context.globalAlpha = 1;
	this.a += this.dir;
}

game.tree.prototype.generate = function(h, generation) {

	var canvas = document.createElement('canvas');
	canvas.width = game.width;
	canvas.height = game.height;
	var ctx = canvas.getContext("2d");

	//reducing line_width and length
	this.length = this.length * this.reduction;
	this.lineWidth = this.lineWidth * this.reduction;
	ctx.lineWidth = this.lineWidth;
	console.log(this.lineWidth);
	
	var new_start_points = [];
	ctx.beginPath();
	for(var i = 0; i < this.start_points.length; i++)
	{
		var sp = this.start_points[i];
		//2 branches will come out of every start point. Hence there will be
		//2 end points. There is a difference in the divergence.
		var ep1 = get_endpoint(sp.x, sp.y, sp.angle+this.divergence + Math.random()*this.divergence/4, this.length);
		var ep2 = get_endpoint(sp.x, sp.y, sp.angle-this.divergence - Math.random()*this.divergence/4, this.length);
		
		//drawing the branches now
		ctx.moveTo(sp.x, h-sp.y);
		ctx.lineTo(ep1.x, h-ep1.y);
		ctx.moveTo(sp.x, h-sp.y);
		ctx.lineTo(ep2.x, h-ep2.y);
		
		//Time to make this function recursive to draw more branches
		ep1.angle = sp.angle+this.divergence + Math.random()*this.divergence/4;
		ep2.angle = sp.angle-this.divergence - Math.random()*this.divergence/4;
		
		new_start_points.push(ep1);
		new_start_points.push(ep2);


	}
	//Lets add some more color
	if(this.length < 15) ctx.strokeStyle = "#A1E08F";
	else ctx.strokeStyle = "#925c00";
	ctx.stroke();
	this.start_points = new_start_points;
	//recursive call - only if length is more than 2.
	//Else it will fall in an long loop



	// add leafs
	var colors = ["rgba(105,145,93,", "rgba(161,224,143,", "rgba(160,219,142,", "rgba(161,224,143,", "rgba(105,145,93,", "rgba(161,224,143,", "rgba(160,219,142,", "rgba(161,224,143,", "rgba(105,145,93,", "rgba(161,224,143,", "rgba(160,219,142,", "rgba(161,224,143,", "rgba(249,255,91,", "rgba(255,154,96,", "rgba(255,89,105,"]

	if(this.length < 20) {
		
		for(var i = 0; i < this.start_points.length; i++)
		{
			var sp = this.start_points[i];
			ctx.beginPath();
			ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)] + Math.random()/6 + ")"
			ctx.arc(sp.x - 3 + 6*Math.random(),h-sp.y  - 15 + 30*Math.random(),3+Math.random()*5,0,2*Math.PI);
			ctx.fill();
		}
		

	}

	this.canvases.push(canvas);

	

	if(this.length > 2) {
		this.generate(h, (generation+1))
	} 
	else {
		this.isReady = true;
		this.lastHeight = h - _.max(new_start_points, function(sp){ return sp.y; }).y + 45;
		console.log("nmax: " + (h - _.max(new_start_points, function(sp){ return sp.y; }).y))
		console.log("ready: " + this.canvases.length);
	}
}


function get_endpoint(x, y, a, length)
{
	//This function will calculate the end points based on simple vectors
	//http://physics.about.com/od/mathematics/a/VectorMath.htm
	//You can read about basic vectors from this link
	var epx = x + length * Math.cos(a*Math.PI/180);
	var epy = y + length * Math.sin(a*Math.PI/180);
	return {x: epx, y: epy};
}

game.mapForMouseCoords = function(m) {
	return {
		x: (m.pageX - game.canvas.offsetLeft),
		y: (m.pageY - game.canvas.offsetTop)
	};
}