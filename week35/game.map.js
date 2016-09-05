game.map = {
	level: [],
	floor: 1,
	floorData: {},
	init: function() {
		this.loadFloor1();
	},
	loadFloor1: function() {
		this.floor = 1;
		this.level = []
		this.level.push([[0,1,0,0,],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,1],[0,1,0,1],[0,1,0,0],[0,1,1,1],[1,1,1,0],[1,1,1,0]])
		this.level.push([[1,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,1,1],[1,1,0,0],[0,2,1,1, game.actions.Floor1OpenDoor53],[1,0,1,0],[1,1,0,0],[0,0,1,1],[1,0,1,0]])
		this.level.push([[3,1,0,1,"WASD to move\nQ and E to turn 90 degrees\nSpace to interact"],[0,1,4,1,game.actions.Floor1OpenDor12],[1,1,0,1],[0,1,0,1],[0,0,3,0, "Some buttons are hidden\nLook around"],[1,1,0,1],[0,0,1,1],[1,0,1,0],[1,1,0,1],[0,0,1,1]])
		this.level.push([[1,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,1,1],[1,0,0,1],[0,1,5,1],[1,1,0,1],[0,0,0,1],[0,1,-20,1],[1,1,1,1]])
		game.player.x = 0
		game.player.y = 2
		game.player.dir = 0
	},
	loadFloor2: function() {
		this.floor = 2;
		this.level = []		
		this.level.push([[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0],[1,1,1,0],[1,1,0,0],[0,1,0,0],[0,1,0,1],[0,1,0,0],[0,1,1,0]])
		this.level.push([[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[1,0,1,0],[1,0,0,0],[0,0,1,1],[1,-20,1,0],[1,0,0,1],[0,0,1,0]])
		this.level.push([[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0],[1,0,1,0],[1,0,1,0],[2,1,0,1, game.actions.Floor2FixTeleport],[0,0,0,0],[0,1,1,0],[1,0,1,0]])
		this.level.push([[1,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,1,1],[1,0,1,0],[1,0,0,0],[0,1,1,1],[1,0,0,0],[0,0,1,1],[1,0,1,0]])
		this.level.push([[3,1,0,1, "Floor 2"],[0,1,0,1],[0,1,0,0],[0,1,0,0],[0,0,1,1],[1,0,1,0,],[3,1,0,1, "Teleports can take you\nto different places"],[0,0,1,0],[1,1,0,0],[0,0,1,0]])
		this.level.push([[1,1,0,0],[0,1,1,0],[1,0,0,0],[0,0,1,0],[1,1,0,0],[0,0,0,0],[0,1,1,0],[1,0,1,0],[1,0,0,0],[0,0,1,0]])
		this.level.push([[1,0,0,0],[0,0,1,1],[1,0,0,0],[0,0,1,0],[1,0,0,1],[0,0,0,0],[0,0,1,0],[1,0,1,0],[1,0,0,0],[0,0,1,0]])
		this.level.push([[1,0,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[1,0,0,1],[0,0,1,1],[1,0,1,0],[1,0,0,0],[0,0,1,0]])
		this.level.push([[1,0,1,0],[1,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,1,0,1],[0,1,0,1],[0,0,1,1],[1,0,0,0],[0,0,1,0]])
		this.level.push([[1,0,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,0,1],[0,0,1,1]])
		game.player.x = 0
		game.player.y = 4
		game.player.dir = 0	
		this.floorData = {
			teleporterFixed: false
		}
	},
	loadFloor3: function() {
		this.floor = 3;
		this.level = []				
		this.level.push([[1,1,0,0],[0,1,0,0],[0,1,1,0],[1,6,1,0, game.actions.Floor3OpenTimedDoor],[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0]])
		this.level.push([[1,0,0,1],[0,0,0,1],[0,0,1,1],[1,0,1,0],[1,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,0],[0,0,1,0]])
		this.level.push([[1,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,1,0],[1,0,0,0],[0,0,1,0]])
		this.level.push([[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,1,0],[1,0,1,5],[1,0,0,0],[0,0,1,0]])
		this.level.push([[1,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,1],[1,0,1,0],[1,0,0,1],[0,0,1,1]])
		this.level.push([[1,0,0,0],[0,0,0,0],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,1,1],[1,1,0,0],[0,0,0,1],[0,1,0,1],[0,1,1,1]])
		this.level.push([[1,0,0,0],[0,0,1,0],[1,1,0,0],[0,1,0,1],[0,1,0,0],[0,1,0,0],[0,0,1,1],[1,1,0,0],[0,1,0,0],[0,1,1,0]])
		this.level.push([[1,0,0,1],[0,0,1,1],[1,0,1,0],[1,1,1,1],[1,0,0,0],[0,0,1,1],[1,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0]])
		this.level.push([[1,1,0,1],[-20,1,0,1],[0,0,0,1],[0,1,0,1],[0,0,1,1],[1,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,1,0]])
		this.level.push([[1,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,1,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,1,1]])
		game.player.x = 0
		game.player.y = 2
		game.player.dir = 2			
	},
	loadFloor4: function() {
		this.floor = 3;
		this.level = []			
		this.level.push([[1,1,3,1, "Thank you.\nEnjoy your tomb"]])
		game.player.x = 0
		game.player.y = 0
		game.player.dir = 2		
	},
	playerLocation: function() {
		return game.map.level[game.player.y][game.player.x];
	},
	set: function(x,y,i,val) {
		game.map.level[y][x][i] = val;
	},
	playerMap: function() {
		var currentLocation = this.playerLocation();

		var map = [];

		var directionMatrix = this.getDirectionMatrix();


		for(var y = 0; y < 4; y++) {
			var xMap = []
			for(var x = 0; x < 3; x++) {

				var currentPosY = game.player.y + directionMatrix[y][x][1];
				var currentPosX = game.player.x + directionMatrix[y][x][0];

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

		if(game.player.dir === 1) {
			return [
				[[-1,-3],[0,-3],[1,-3]],
				[[-1,-2],[0,-2],[1,-2]],
				[[-1,-1],[0,-1],[1,-1]],
				[[-1, 0],[0, 0],[1, 0]]
			];
		} else if(game.player.dir === 0) {
			return [
				[[-3, 1],[-3, 0],[-3,-1]],
				[[-2, 1],[-2, 0],[-2,-1]],
				[[-1, 1],[-1, 0],[-1,-1]],
				[[ 0, 1],[ 0, 0],[ 0,-1]]
			];
		} else if(game.player.dir === 3) {
			return [
				[[1, 3],[0, 3],[-1, 3]],
				[[1, 2],[0, 2],[-1, 2]],
				[[1, 1],[0, 1],[-1, 1]],
				[[1, 0],[0, 0],[-1, 0]]
			];
		} else if(game.player.dir === 2) {
			return [
				[[3, -1],[3, 0],[3, 1]],
				[[2, -1],[2, 0],[2, 1]],
				[[1, -1],[1, 0],[1, 1]],
				[[0, -1],[0, 0],[0, 1]]
			];
		}
	}
}

game.player = {
	x: 0,
	y: 2,
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
		if(game.map.playerLocation()[game.player.getDirectionIndex(0)] > 0) {
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
		if(game.map.playerLocation()[game.player.getDirectionIndex(1)] > 0) {
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
		if(game.map.playerLocation()[game.player.getDirectionIndex(2)] > 0) {
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
		if(game.map.playerLocation()[game.player.getDirectionIndex(3)] > 0) {
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
	playerMap: null,
	init: function() {
		game.renderWalls.init();
		game.text.init();
		game.doors.init();
		game.teleports.init();

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

		game.context.clearRect(0,0,800,600)

		game.context.fillStyle = "#000000";
		game.context.fillRect(0,0,800,500);

		game.context.drawImage(this.backgroundCanvas, 0, 0)

		this.playerMap = game.map.playerMap();



		// rooms 3 steps ahead

		if(this.playerMap[0][1][game.player.getDirectionIndex(0)] > 0) {
			game.renderWalls.sideWall3StepsAway();
		}

		if(this.playerMap[0][1][game.player.getDirectionIndex(2)] > 0) {
			game.renderWalls.sideWall3StepsAway(true);
		}	



		// rooms 2 steps ahead

		if(this.playerMap[1][0][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall2StepsAway("l");
		}

		if(this.playerMap[1][1][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall2StepsAway("f");
		}

 		if(this.playerMap[1][2][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall2StepsAway("r");
		}			

		if(this.playerMap[1][1][game.player.getDirectionIndex(0)] > 0) {
			game.renderWalls.sideWall2StepsAway();
		}

		if(this.playerMap[1][1][game.player.getDirectionIndex(2)] > 0) {
			game.renderWalls.sideWall2StepsAway(true);
		}		






		if(this.playerMap[2][0][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall1StepsAway("l");
		}

		if(this.playerMap[2][1][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall1StepsAway("f");
		}

 		if(this.playerMap[2][2][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall1StepsAway("r");
		}

		if(this.playerMap[2][1][game.player.getDirectionIndex(0)] > 0) {
			game.renderWalls.sideWall1StepsAway();
		}

		if(this.playerMap[2][1][game.player.getDirectionIndex(2)] > 0) {
			game.renderWalls.sideWall1StepsAway(true);
		}	







		if(this.playerMap[3][0][game.player.getDirectionIndex(1)] > 0) {

			game.renderWalls.wall0StepsAway("l");
		}

		if(this.playerMap[3][1][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall0StepsAway("f");
		}

 		if(this.playerMap[3][2][game.player.getDirectionIndex(1)] > 0) {
			game.renderWalls.wall0StepsAway("r");
		}

		if(this.playerMap[3][1][game.player.getDirectionIndex(0)] > 0 || this.playerMap[3][1][game.player.getDirectionIndex(0)] === -4) {
			game.renderWalls.sideWall0StepsAway();
		}

		if(this.playerMap[3][1][game.player.getDirectionIndex(2)] > 0 || this.playerMap[3][1][game.player.getDirectionIndex(2)] === -4) {
			game.renderWalls.sideWall0StepsAway(true);
		}			

		game.compass.draw();

		game.buttons.render();

		game.doors.render();

		game.teleports.render();

		game.text.render();

		game.events.render();

	},
	createBackground: function() {

		this.backgroundCanvas = document.createElement("canvas");
		this.backgroundCanvas.width = 800;
		this.backgroundCanvas.height = 500;
		var context = this.backgroundCanvas.getContext("2d");
				
		for(var i = 0; i < 4; i++) {

			context.strokeStyle = "rgba(80,80,80,1)"

			var s = game.renderWalls["s" + i];

			context.moveTo(0, s.y4);
			context.lineTo(800, s.y4)
			context.stroke();
		}

		context.moveTo(400, 500)
		context.lineTo(400,250);
		context.stroke();

		context.moveTo(170, 500)
		context.lineTo(355, 250);
		context.stroke();

		context.moveTo(630, 500)
		context.lineTo(445, 250);
		context.stroke();

		context.moveTo(0, game.renderWalls.s1.y4)
		context.lineTo(300, 250);
		context.stroke();

		context.moveTo(800, game.renderWalls.s1.y4)
		context.lineTo(500, 250);
		context.stroke();
			

		var roofGradient = context.createLinearGradient(0,0,0,100);
		roofGradient.addColorStop(0,"rgba(73,53,81,0.5)");
		roofGradient.addColorStop(1,"rgba(0,0,0,1)");
		context.fillStyle=roofGradient;
		context.fillRect(0,0,800,100);

		var floorGradient = context.createLinearGradient(0,260,0,500);
		floorGradient.addColorStop(0,"rgba(0,0,0,1)");
		floorGradient.addColorStop(1,"rgba(109,53,98,0.5)");
		context.fillStyle=floorGradient;
		context.fillRect(0,250,800,250);

	
	}
}

game.renderWalls = {
	init: function() {
		this.kRoof = 90/280;
		this.kFloor = (230)/280

		this.s0 = this.generateSideCoords(0, 70, "#C160AC", "#F77BDE");
		this.s1 = this.generateSideCoords(70, 230, "#542A4D", "#C160AC");
		this.s2 = this.generateSideCoords(230, 280, "#160B14", "#542A4D");
		this.s3 = this.generateSideCoords(280, 300, "#000000", "#160B14");
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

	sideWall3StepsAway: function(flipped) {

		game.context.fillStyle = flipped ? this.s3.gradientRight : this.s3.gradientLeft;
		game.context.beginPath();
		game.context.moveTo(flipped ? this.s3.x1f : this.s3.x1, this.s3.y1);
		game.context.lineTo(flipped ? this.s3.x2f : this.s3.x2, this.s3.y2);
		game.context.lineTo(flipped ? this.s3.x2f : this.s3.x2, this.s3.y3);
		game.context.lineTo(flipped ? this.s3.x1f : this.s3.x1, this.s3.y4);		
		game.context.closePath();
		game.context.fill();
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

game.compass = {
	currentDirectionColor: "rgba(252,111,83,1)",
	northColor: "rgba(252,27,121,1)",
	inactiveColor: "rgba(73,53,81,1)",
	draw: function() {

		game.context.strokeStyle = "rgba(255,255,255,0.5)"

		var current

		var fillStyle = {
			w: this.inactiveColor,
			n: this.inactiveColor,
			e: this.inactiveColor,
			s: this.inactiveColor,
		}

		switch(game.player.dir) {
			case 0:
				fillStyle.n = this.currentDirectionColor
				fillStyle.e = this.northColor
				break;
			case 1:
				fillStyle.n = this.currentDirectionColor
				break;	
			case 2:
				fillStyle.n = this.currentDirectionColor
				fillStyle.w = this.northColor
				break;	
			case 3:
				fillStyle.n = this.currentDirectionColor
				fillStyle.s = this.northColor
				break;									
		}

		game.context.fillStyle = fillStyle.n;
		game.context.beginPath();
		game.context.moveTo(35,535);
		game.context.lineTo(45,505);
		game.context.lineTo(55,535);
		game.context.lineTo(35,535);
		game.context.closePath();
		game.context.fill();
		
		game.context.fillStyle = fillStyle.s;
		game.context.beginPath();
		game.context.moveTo(35,555);
		game.context.lineTo(45,585);
		game.context.lineTo(55,555);
		game.context.lineTo(35,555);
		game.context.closePath();
		game.context.fill();
		
		game.context.fillStyle = fillStyle.w;
		game.context.beginPath();
		game.context.moveTo(5,545);
		game.context.lineTo(35,535);
		game.context.lineTo(35,555);
		game.context.lineTo(5,545);
		game.context.closePath();
		game.context.fill();
		
		game.context.fillStyle = fillStyle.e;
		game.context.beginPath();
		game.context.moveTo(85,545);
		game.context.lineTo(55,535);
		game.context.lineTo(55,555);
		game.context.lineTo(85,545);
		game.context.closePath();
		game.context.fill();
	}
}