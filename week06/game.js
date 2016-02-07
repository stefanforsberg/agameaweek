var game = game || {};

game.width = 1600;
game.height = 650;
game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.trees = [];

game.draw = function() {

	game.context.clearRect(0,0, game.width, game.height);

	game.context.drawImage(document.getElementById("bg"), 0, 0);

	game.trees.forEach(function (t) {
		t.draw();
	})

	window.requestAnimationFrame(game.draw);
}


game.load = function() {

	game.trees = [];

	game.context.drawImage(document.getElementById("bg"), 0, 0);

	game.trees.push(new game.tree(250, 650));

	game.trees.push(new game.tree(800, 650));

	game.trees.push(new game.tree(1350, 650));

	game.draw();
	
}

game.tree = function(x, h) {

	this.canvases = [];

	this.currentGeneration = 5;
	this.currentGenerationLife = 0;
	this.lifeForce = 1000;

	this.generations = [];

	this.length = 80 +  Math.round(Math.random()*30)
	this.divergence = 25 + Math.round(Math.random()*10)
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


// //Lets draw the branches now
// 	function branches(h)
// 	{
// 		console.log(start_points);
		

// 		//reducing line_width and length
// 		length = length * reduction;
// 		line_width = line_width * reduction;
// 		game.context.lineWidth = line_width;
		
// 		var new_start_points = [];
// 		game.context.beginPath();
// 		for(var i = 0; i < start_points.length; i++)
// 		{
// 			var sp = start_points[i];
// 			//2 branches will come out of every start point. Hence there will be
// 			//2 end points. There is a difference in the divergence.
// 			var ep1 = get_endpoint(sp.x, sp.y, sp.angle+this.divergence, this.length);
// 			var ep2 = get_endpoint(sp.x, sp.y, sp.angle-this.divergence, this.length);
			
// 			//drawing the branches now
// 			game.context.moveTo(sp.x, h-sp.y);
// 			game.context.lineTo(ep1.x, h-ep1.y);

// 			game.context.moveTo(sp.x, h-sp.y);
// 			game.context.lineTo(ep2.x, h-ep2.y);
			
// 			//Time to make this function recursive to draw more branches
// 			ep1.angle = sp.angle+divergence;
// 			ep2.angle = sp.angle-divergence;
			
// 			new_start_points.push(ep1);
// 			new_start_points.push(ep2);
// 		}

// 		var colors = ["#778B71", "#8EA886", "#ADC7A6"];

// 		//Lets add some more color
// 		if(length < 20) {
// 			game.context.strokeStyle = colors[Math.floor(Math.random()*colors.length)];
// 		}
// 		else {
// 			game.context.strokeStyle = "#925c00";
// 		}
// 		game.context.stroke();
// 		start_points = new_start_points;
// 		//recursive call - only if length is more than 2.
// 		//Else it will fall in an long loop
// 		if(length > 2) branches(h);
// 		//else setTimeout(init, 500);
// 	}
	
	function get_endpoint(x, y, a, length)
	{
		//This function will calculate the end points based on simple vectors
		//http://physics.about.com/od/mathematics/a/VectorMath.htm
		//You can read about basic vectors from this link
		var epx = x + length * Math.cos(a*Math.PI/180);
		var epy = y + length * Math.sin(a*Math.PI/180);
		return {x: epx, y: epy};
	}