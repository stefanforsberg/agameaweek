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

	game.context.drawImage(document.getElementById("icons_top"), 650, 20);

	game.tools.draw();

	window.requestAnimationFrame(game.draw);
}


game.load = function() {

	game.trees = [];

	game.context.drawImage(document.getElementById("bg"), 0, 0);

	game.trees.push(new game.tree(250, 650));

	game.trees.push(new game.tree(800, 650));

	game.trees.push(new game.tree(1350, 650));
	
	game.environment.init();

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
			console.log(m);
			if(m.x > 673 && m.x < 755 && m.y > 60 && m.y < 125) {
				self.currentTool = self.iconWater;
			} else if(m.x > 785 && m.x < 820 && m.y > 37 && m.y < 82) {
				self.currentTool = self.iconFood;
			} else if(m.x > 855 && m.x < 900 && m.y > 54 && m.y < 140) {
				self.currentTool = self.iconLeaf;
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

game.glowWorm = function() {
	this.colors = ["rgba(99,203,230, 0.3)", "rgba(255,216,0, 0.3)"];

	this.reset();

	return this;
}

game.glowWorm.prototype.reset = function() {
	this.vx = 0.2*(Math.random()-1);
	this.vy = 0.05*(Math.random()-1);
	this.radius = 1 + Math.random()*3;
	this.x = Math.random()*1600;
	this.y = Math.random()*650;
	this.a = Math.random()*360;
	this.divergence = Math.random()*3;
	this.color = this.colors[Math.floor(this.colors.length*Math.random())];
}

game.glowWorm.prototype.draw = function() {



}

game.environment = {

	glowWorms: [],
	minutes: 0,
	tick: 0,

	init: function() {

		this.tick = 0;
		this.minutes = 1020;

		for(var i = 0; i < 200; i++) {
			this.glowWorms.push(new game.glowWorm());
		}

		this.canvas = document.createElement('canvas');
		this.canvas.width = game.width;
		this.canvas.height = game.height;
		this.ctx = this.canvas.getContext("2d");
	},

	draw: function() {

		this.ctx.clearRect(0,0,game.width, game.height);

		this.tick++;

		if(this.tick % 10 === 0) {
			this.minutes++;

			if(this.minutes > 1440) {
				this.minutes = 0;
			}
		}

		var alpha;

		if(this.minutes >= 0 && this.minutes < 120) {
			alpha = 0.8;
		}
		else if(this.minutes >= 120 && this.minutes < 600) {
			alpha = 0.8*Math.abs((this.minutes - 600) / 480);
		}  else if(this.minutes > 1080) {
			alpha =  0.8 - 0.8*Math.abs((this.minutes - 1440 ) / (1440-1080)) ;
		} else {
			alpha = 0;
		}

		this.ctx.fillStyle = "rgba(0, 0, 0, " +alpha + ")";
		this.ctx.fillRect(0, 0, game.width, game.height);

		game.context.drawImage(this.canvas, 0 , 0);

	},
	glowWorm: function() {
		this.ctx.globalCompositeOperation = "source-over";
		//Lets reduce the opacity of the BG paint to give the final touch


		this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		this.ctx.fillRect(0, 0, game.width, game.height);

		
		//Lets blend the particle with the BG
		this.ctx.globalCompositeOperation = "lighter";
		
		//Lets draw particles from the array now
		for(var t = 0; t < this.glowWorms.length; t++)
		{
			var p = this.glowWorms[t];
			
			this.ctx.beginPath();
			
			//Time for some colors
			var gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
			gradient.addColorStop(0, "white");
			gradient.addColorStop(0.2, "white");
			gradient.addColorStop(0.4, p.color);
			gradient.addColorStop(1, "transparent");
			
			this.ctx.fillStyle = gradient;
			this.ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
			this.ctx.fill();

			p.x += p.vx + 0.01*Math.cos(p.a*Math.PI/180)*p.divergence;
			p.y += p.vy + 0.006*Math.sin(p.a*Math.PI/180)*p.divergence;

			p.a+= p.divergence/3;
		}

		

		game.context.globalAlpha = 1;
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


game.tree.prototype.draw  = function() {

	if(this.lifeForce > 0) {
		this.currentGenerationLife += 1;

		if(this.currentGenerationLife >= 100) {

			if(this.currentGeneration >= (this.canvases.length-1)) {
				this.currentGenerationLife = 100;
			} else {
				this.currentGenerationLife = 0;
				this.currentGeneration++;	
			}
		}

		this.lifeForce--;
	} else {
		this.currentGenerationLife -= 1;

		if(this.currentGenerationLife <= 0) {
			this.currentGenerationLife = 100;
			this.currentGeneration--;
		}

		this.lifeForce--;

	}

	if(this.currentGeneration < 0) {
		this.currentGeneration = 0;
		this.lifeForce = this.canvases.length*100;
	}

	for(var i = 0; i < this.currentGeneration; i++) {
		game.context.drawImage(this.canvases[i], 0, 0);
	}

	try {
		game.context.globalAlpha = this.currentGenerationLife/100;
		game.context.drawImage(this.canvases[this.currentGeneration], 0, 0);
		game.context.globalAlpha = 1;
	} catch(err) {
		console.log("error: " + this.canvases.length + ", " + this.currentGeneration);
	}

	if(Math.random() < 0.001) {
		this.statuses.push(new game.treeStatus(this.x))
	}

	this.statuses.forEach(function (o) {
		o.draw();
	});
	
}

game.treeStatus = function(x) {
	this.x = x - 20 -150 + Math.random()*300;
	this.y = 380 + Math.random()*180;
	this.sprite = document.getElementById("icon_water_small");

	return this;
}

game.treeStatus.prototype.draw = function() {
	game.context.globalAlpha = 0.7;
	game.context.drawImage(this.sprite, this.x, this.y);
	game.context.globalAlpha = 1;
}

game.tree.prototype.generate = function(h, generation) {

	var canvas = document.createElement('canvas');
	canvas.width = game.width;
	canvas.height = game.height;
	var ctx = canvas.getContext("2d");

	// this.canvases.forEach(function(c) {
	// 	ctx.drawImage(c, 0, 0);
	// });

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



	var colors = ["rgba(105,145,93,", "rgba(161,224,143,", "rgba(160,219,142,", "rgba(161,224,143,", "rgba(105,145,93,", "rgba(161,224,143,", "rgba(160,219,142,", "rgba(161,224,143,", "rgba(105,145,93,", "rgba(161,224,143,", "rgba(160,219,142,", "rgba(161,224,143,", "rgba(249,255,91,", "rgba(255,154,96,", "rgba(255,89,105,"]

	if(this.length < 20) {
		
		for(var i = 0; i < this.start_points.length; i++)
		{
			var sp = this.start_points[i];
			ctx.beginPath();
			ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)] + Math.random()/4 + ")"
			ctx.arc(sp.x - 3 + 6*Math.random(),h-sp.y  - 5 + 10*Math.random(),1+Math.random()*5,0,2*Math.PI);
			ctx.fill();
		}
		

	}

	this.canvases.push(canvas);

	

	if(this.length > 2) {
		this.generate(h, (generation+1))
	} 
	else {
		this.isReady = true;
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