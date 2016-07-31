game.map = {
	level: [],
	init: function() {
		this.level.push([[1,1,0,0],[0,1,0,0],[0,1,1,0]])
		this.level.push([[1,0,0,1],[0,0,0,0],[0,0,1,1]])
		this.level.push([[1,1,1,1],[1,0,1,0],[1,1,1,1]])
		this.level.push([[1,1,1,1],[1,0,1,0],[1,1,1,1]])
		this.level.push([[1,1,1,1],[1,0,1,1],[1,1,1,1]])

	},
	playerLocation: function() {
		return game.map.level[game.player.y][game.player.x];
	},
	playerMap: function() {
		var currentLocation = this.playerLocation();

		var map = [];

		var directionMatrix = this.getDirectionMatrix();

		game.context.strokeStyle = "#ff0000";
		for(var y = 0; y < this.level.length; y++) {
			for(var x = 0; x < this.level[0].length; x++) {
				game.context.strokeRect(300+30*x, 300+30*y,30,30);
			}
		}

		for(var y = 0; y < 3; y++) {
			var xMap = []
			for(var x = 0; x < 3; x++) {

				var currentPosY = game.player.y + directionMatrix[y][x][1];
				var currentPosX = game.player.x + directionMatrix[y][x][0];

				game.context.fillStyle = "rgba(255,255,255,0.5)";
				game.context.fillRect(300+30*currentPosX, 300+30*currentPosY,30,30);

				if(currentPosY < 0 || currentPosY > (this.level.length-1) || currentPosX < 0 || currentPosX > (this.level[0].length-1)) {
					xMap.push([1,1,1,1]);
				} else {
					xMap.push(this.level[game.player.y + directionMatrix[y][x][1]][game.player.x + directionMatrix[y][x][0]])	
				}

				
			}

			map.push(xMap);
		}

		return map;


	},
	getDirectionMatrix: function() {

		console.log("getting direction matrix for " + game.player.dir)

		if(game.player.dir === 1) {
			return [
				[[-1,-2],[0,-2],[1,-2]],
				[[-1,-1],[0,-1],[1,-1]],
				[[-1, 0],[0, 0],[1, 0]]
			];
		} else if(game.player.dir === 0) {
			return [
				[[-2, 1],[-2, 0],[-2,-1]],
				[[-1, 1],[-1, 0],[-1,-1]],
				[[ 0, 1],[ 0, 0],[ 0,-1]]
			];
		} else if(game.player.dir === 3) {
			return [
				[[1, 2],[0, 2],[-1, 2]],
				[[1, 1],[0, 1],[-1, 1]],
				[[1, 0],[0, 0],[-1, 0]]
			];
		} else if(game.player.dir === 2) {
			return [
				[[2, -1],[2, 0],[2, 1]],
				[[1, -1],[1, 0],[1, 1]],
				[[0, -1],[0, 0],[0, 1]]
			];
		}
	}
}

game.player = {
	x: 2,
	y: 0,
	dir: 0,
	directionIndex: {
		d1: [0,1,2,3],
		d0: [3,0,1,2],
		d2: [1,2,3,0],
		d3: [2,3,0,1]
	},
	rotateLeft: function() {
		this.dir--;
		if(this.dir < 0) {
			this.dir = 3;
		}
	},
	rotateRight: function() {
		this.dir++;
		if(this.dir > 3) {
			this.dir = 0;
		}
	},	
	moveLeft: function() {
		if(game.map.playerLocation()[game.player.getDirectionIndex(0)] === 1) {
			return;
		}

		var newPosX = this.x;
		var newPosY = this.y;

		switch(this.dir) {
			case 0: 
				newPosY++;
				break;
			case 1: 
				newPosX--;
				break;
			case 2: 
				newPosY--;
				break;
			case 3: 
				newPosX++;
				break;
		}

		this.x = newPosX;
		this.y = newPosY;
	},	
	moveForward: function() {
		if(game.map.playerLocation()[game.player.getDirectionIndex(1)] === 1) {
			return;
		}

		var newPosX = this.x;
		var newPosY = this.y;

		switch(this.dir) {
			case 0: 
				newPosX--;
				break;
			case 1: 
				newPosY--;
				break;
			case 2: 
				newPosX++;
				break;
			case 3: 
				newPosY++;
				break;
		}

		this.x = newPosX;
		this.y = newPosY;
	},
	moveRight: function() {
		if(game.map.playerLocation()[game.player.getDirectionIndex(2)] === 1) {
			return;
		}

		var newPosX = this.x;
		var newPosY = this.y;

		switch(this.dir) {
			case 0: 
				newPosY--;
				break;
			case 1: 
				newPosX++;
				break;
			case 2: 
				newPosY++;
				break;
			case 3: 
				newPosX--;
				break;
		}

		this.x = newPosX;
		this.y = newPosY;
	},		
	moveBack: function() {
		if(game.map.playerLocation()[game.player.getDirectionIndex(3)] === 1) {
			return;
		}

		var newPosX = this.x;
		var newPosY = this.y;

		switch(this.dir) {
			case 0: 
				newPosX++;
				break;
			case 1: 
				newPosY++;
				break;
			case 2: 
				newPosX--;
				break;
			case 3: 
				newPosY--;
				break;
		}

		this.x = newPosX;
		this.y = newPosY;
	},	
	getDirectionIndex: function(dir) {
		return this.directionIndex["d"+this.dir][dir];

	}
}


game.renderScene = {
	init: function() {
		game.renderWalls.init();

		this.createBackground();

		this.kRoof = 90/280;
		this.kFloor = (230)/280
	},
	logForPlayerMapAt: function(playerMapBase, x, y) {
		console.log("Log for: " + x + ", " + y)
		var playerMap = playerMapBase[y][x];
		console.log("raw " + playerMap[0] + "," + playerMap[1] + "," + playerMap[2] + "," + playerMap[3]);
		console.log("getDirectionIndex " + playerMap[game.player.getDirectionIndex(0)] + "," + playerMap[game.player.getDirectionIndex(1)] + "," + playerMap[game.player.getDirectionIndex(2)] + "," + playerMap[game.player.getDirectionIndex(3)]);
		console.log("End log")
	},
	render: function() {

		game.context.fillStyle = "#000000";
		game.context.fillRect(0,0,800,500);

		game.context.drawImage(this.backgroundCanvas, 0, 0)

		var playerMap = game.map.playerMap();


		this.logForPlayerMapAt(playerMap, 0, 2);

		this.logForPlayerMapAt(playerMap, 0, 0);




		// rooms 2 steps ahead

		if(playerMap[0][0][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall2StepsAway("l");
		}

		if(playerMap[0][1][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall2StepsAway("f");
		}

 		if(playerMap[0][2][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall2StepsAway("r");
		}			

		if(playerMap[0][1][game.player.getDirectionIndex(0)] > 0) {
			game.renderWalls.sideWall2StepsAway();
		}

		if(playerMap[0][1][game.player.getDirectionIndex(2)] > 0) {
			game.renderWalls.sideWall2StepsAway(true);
		}		






		if(playerMap[1][0][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall1StepsAway("l");
		}

		if(playerMap[1][1][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall1StepsAway("f");
		}

 		if(playerMap[1][2][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall1StepsAway("r");
		}

		if(playerMap[1][1][game.player.getDirectionIndex(0)] > 0) {
			game.renderWalls.sideWall1StepsAway();
		}

		if(playerMap[1][1][game.player.getDirectionIndex(2)] > 0) {
			game.renderWalls.sideWall1StepsAway(true);
		}	







		if(playerMap[2][0][game.player.getDirectionIndex(1)] > 0) {

			game.renderWalls.wall0StepsAway("l");
		}

		if(playerMap[2][1][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall0StepsAway("f");
		}

 		if(playerMap[2][2][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall0StepsAway("r");
		}

		if(playerMap[2][1][game.player.getDirectionIndex(0)] > 0) {
			game.renderWalls.sideWall0StepsAway();
		}

		if(playerMap[2][1][game.player.getDirectionIndex(2)] > 0) {
			game.renderWalls.sideWall0StepsAway(true);
		}			


		var playerMap = game.map.playerMap();

	},
	createBackground: function() {

		this.backgroundCanvas = document.createElement("canvas");
		this.backgroundCanvas.width = 800;
		this.backgroundCanvas.height = 500;
		var context = this.backgroundCanvas.getContext("2d");
		
		var roofGradient = context.createLinearGradient(0,0,0,100);
		roofGradient.addColorStop(0,"#1B393D");
		roofGradient.addColorStop(1,"#000000");
		context.fillStyle=roofGradient;
		context.fillRect(0,0,800,100);

		var floorGradient = context.createLinearGradient(0,300,0,500);
		floorGradient.addColorStop(0,"#000000");
		floorGradient.addColorStop(1,"#1B393D");
		context.fillStyle=floorGradient;
		context.fillRect(0,300,800,200);
	}
}

game.renderWalls = {
	init: function() {
		this.kRoof = 90/280;
		this.kFloor = (230)/280

		this.s0 = this.generateSideCoords(0, 40, "#C160AC", "#F77BDE");
		this.s1 = this.generateSideCoords(40, 230, "#542A4D", "#C160AC");
		this.s2 = this.generateSideCoords(230, 280, "#160B14", "#542A4D");

	},

	generateSideCoords: function(x1, x2, c1, c2) {
		var coords = {
			x1: x1,
			x2: x2
		};

		coords.y1 = coords.x1 * this.kRoof;
		coords.y2 = coords.x2 * this.kRoof;
		coords.y3 = 500 - coords.x2 * this.kFloor;
		coords.y4 = 500 - coords.x1 * this.kFloor;
		coords.x1f = (800 - coords.x1);
		coords.x2f = (800 - coords.x2);

		coords.gradientLeft = game.context.createLinearGradient(coords.x1, 0, coords.x2, 0);
		coords.gradientLeft.addColorStop(0, c2);
		coords.gradientLeft.addColorStop(1, c1);

		coords.colorWall = c1

		coords.gradientRight = game.context.createLinearGradient(coords.x1f, 0, coords.x2f, 0);
		coords.gradientRight.addColorStop(0, c2);
		coords.gradientRight.addColorStop(1, c1);

		return coords;
	},

	wall2StepsAway: function(direction) {

		if(direction === "f") {
			game.context.fillStyle = this.s2.colorWall;
			game.context.fillRect(this.s2.x2,this.s2.y2,(this.s2.x2f - this.s2.x2),(this.s2.y3 - this.s2.y2));	
		} else if(direction === "l") {
			game.context.fillStyle = this.s2.colorWall;
			game.context.fillRect(this.s2.x2-280,this.s2.y2,280,(this.s2.y3 - this.s2.y2));	
		} else if(direction === "r") {
			game.context.fillStyle = this.s2.colorWall;
			game.context.fillRect(this.s2.x2f, this.s2.y2,280,(this.s2.y3 - this.s2.y2));	
		}
	},

	sideWall2StepsAway: function(flipped) {

		game.context.fillStyle = flipped ? this.s2.gradientRight : this.s2.gradientLeft;
		game.context.beginPath();
		game.context.moveTo(flipped ? this.s2.x1f : this.s2.x1, this.s2.y1);
		game.context.lineTo(flipped ? this.s2.x2f : this.s2.x2, this.s2.y2);
		game.context.lineTo(flipped ? this.s2.x2f : this.s2.x2, this.s2.y3);
		game.context.lineTo(flipped ? this.s2.x1f : this.s2.x1, this.s2.y4);		
		game.context.closePath();
		game.context.fill();
	},
	

	wall1StepsAway: function(direction) {
		if(direction === "f") {
			game.context.fillStyle = this.s1.colorWall;
			game.context.fillRect(this.s1.x2,this.s1.y2,(this.s1.x2f - this.s1.x2),(this.s1.y3 - this.s1.y2));	
		} else if(direction === "l") {
			game.context.fillStyle = this.s1.colorWall;
			game.context.fillRect(this.s1.x2-230,this.s1.y2,230,(this.s1.y3 - this.s1.y2));	
		} else if(direction === "r") {
			game.context.fillStyle = this.s1.colorWall;
			game.context.fillRect(this.s1.x2f, this.s1.y2,230,(this.s1.y3 - this.s1.y2));	
		}
	},


	sideWall1StepsAway: function(flipped) {

		game.context.fillStyle = flipped ? this.s1.gradientRight : this.s1.gradientLeft;
		game.context.beginPath();
		game.context.moveTo(flipped ? this.s1.x1f : this.s1.x1, this.s1.y1);
		game.context.lineTo(flipped ? this.s1.x2f : this.s1.x2, this.s1.y2);
		game.context.lineTo(flipped ? this.s1.x2f : this.s1.x2, this.s1.y3);
		game.context.lineTo(flipped ? this.s1.x1f : this.s1.x1, this.s1.y4);		
		game.context.closePath();
		game.context.fill();
	},	



	wall0StepsAway: function(direction) {
		if(direction === "f") {
			game.context.fillStyle = this.s0.colorWall;
			game.context.fillRect(this.s0.x2,this.s0.y2,(this.s0.x2f - this.s0.x2),(this.s0.y3 - this.s0.y2));	
		} else if(direction === "l") {
			game.context.fillStyle = this.s0.colorWall;
			game.context.fillRect(this.s0.x2-200,this.s0.y2,200,(this.s0.y3 - this.s0.y2));	
		} else if(direction === "r") {
			game.context.fillStyle = this.s0.colorWall;
			game.context.fillRect(this.s0.x2f, this.s0.y2,200,(this.s0.y3 - this.s0.y2));	
		}
	},

	sideWall0StepsAway: function(flipped) {

		game.context.fillStyle = flipped ? this.s0.gradientRight : this.s0.gradientLeft;
		game.context.beginPath();
		game.context.moveTo(flipped ? this.s0.x1f : this.s0.x1, this.s0.y1);
		game.context.lineTo(flipped ? this.s0.x2f : this.s0.x2, this.s0.y2);
		game.context.lineTo(flipped ? this.s0.x2f : this.s0.x2, this.s0.y3);
		game.context.lineTo(flipped ? this.s0.x1f : this.s0.x1, this.s0.y4);		
		game.context.closePath();
		game.context.fill();
	},	
}