game.map = {
	width: 200,
	height: 200,
	chanceToStartAlive: 0.5,
	mapArray: [],
	size: 40,
	init: function() {
		this.map = [];
		this.widthInPixels = this.width * this.size;
		this.heightInPixels = this.height * this.size;


		for(var y=0; y<this.height; y++) {


			var xArray = [];
	        for(var x=0; x<this.height; x++){
	        	xArray.push({
	        		blocks: (Math.random() > this.chanceToStartAlive)
	        	});
	        }

	        this.mapArray.push(xArray);
	    }

	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
	    this.doGeneration(this.mapArray);
		this.doGeneration(this.mapArray);
		this.doGeneration(this.mapArray);

		this.openUpPaths();
		this.openUpPaths();
		this.openUpPaths();
		this.openUpPaths();
		this.openUpPaths();
		this.openUpPaths();
		this.openUpPaths();

		this.setSky();
		
		this.setBorders();

	    this.setColor();
	    

	    

	    console.log(this.mapArray);
	},
	blockingNeighbours: function(x, y) {
	    var count = 0;

	    for(var i=-1; i<2; i++){
	        for(var j=-1; j<2; j++){
	            var neighbour_x = x+i;
	            var neighbour_y = y+j;
	            if(i === 0 && j === 0){
	                continue;
	            }

	            else if(neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= this.width || neighbour_y >= this.height){
	                count = count + 1;
	            }

	            else if(this.mapArray[neighbour_y][neighbour_x].blocks){
	                count = count + 1;
	            }
	        }
	    }

	    return count;
	},

	doGeneration: function(currentMapArray) {

		var newMap = [];

		for(var y=0; y < this.height; y++) {

			var newXArray = [];

			var deathLimit = 5;
			var birthLimit = 3;

	        for(var x=0; x<this.width; x++){

	            var nbs = this.blockingNeighbours(x, y);
	           
	            var dead;

	            if(currentMapArray[y][x].blocks){
	            	if(nbs > birthLimit){
	                    dead = true;
	                }
	                else{
	                    dead= false;
	                }

	            } 
	            else{
	                if(nbs < deathLimit){
	                    dead = false;
	                }
	                else{
	                    dead = true;
	                }
	            }


	            newXArray.push({blocks: dead});
	            
	        }

	        newMap.push(newXArray);
	        
	    }

	    this.mapArray = newMap;
	},
	setSky: function() {
		for(var y=0; y < 8; y++) {

	        for(var x=0; x<this.width; x++){

	            this.mapArray[y][x].blocks = false;
	            this.mapArray[y][x].color = "rgba(255,255,255,0.3)";
	        }
	    }
	},
	setColor: function() {
		for(var y=0; y < this.height; y++) {

			var newXArray = [];

	        for(var x=0; x<this.width; x++){

	        	if(this.mapArray[y][x].blocks) {
	        		var blockingNeighbours = this.blockingNeighbours(x, y);
	           	
		           	if(blockingNeighbours > 7) {
		           		colorBase = Math.round(Math.random()*21);
		           		this.mapArray[y][x].color = "rgba("+colorBase+","+colorBase+","+colorBase+",1)"
		           	} else if(blockingNeighbours > 5) {
		           		this.mapArray[y][x].color = "rgba(34,34,34,0.9)"
	           		} else if(blockingNeighbours > 3) {
		           		this.mapArray[y][x].color = "rgba(56,56,56,0.9)"
	           		} else {
		           		this.mapArray[y][x].color = "rgba(84,84,84,0.9)"
		           	}
		           } else {
		           		this.mapArray[y][x].color = "rgba(180,180,180,0.3)";
		           }

	            
	        }
	    }
	},
	setBorders: function() {
		for(var y=0; y < this.height; y++) {
			this.mapArray[y][0].blocks = true;
			this.mapArray[y][0].canNotBeShot = true;
			this.mapArray[y][this.width-1].blocks = true;
			this.mapArray[y][this.width-1].canNotBeShot = true;
		}

		for(var x=0; x < this.width; x++) {
			this.mapArray[this.height-1][x].blocks = true;
			this.mapArray[this.height-1][x].canNotBeShot = true;
		}
	},
	openUpPaths: function() {
		for(var y=1; y < this.height-1; y++) {

	        for(var x=1; x<this.width-1; x++){

	        	if(!this.mapArray[y][x-1].blocks && !this.mapArray[y][x+1].blocks) {
	        		this.mapArray[y][x].blocks = false;
	        	}

	        	if(!this.mapArray[y-1][x].blocks && !this.mapArray[y+1][x].blocks) {
	        		this.mapArray[y][x].blocks = false;
	        	}
	        }
	        	
	    }
	},
	blockDestroyed: function(x, y) {
		var tileX = Math.floor((x) / game.map.size);
		var tileY = Math.floor((y) / game.map.size);

		this.mapArray[tileY][tileX].blocks = false;
		this.mapArray[tileY][tileX].color = "rgba(180,180,180,0.3)"
	},
	draw: function() {



		var objectDrawn = 0;

		for(var y = 0; y < this.mapArray.length; y++) {
			for(var x = 0; x < this.mapArray[0].length; x++) {

				var xPixel = x*this.size + this.size;
				var yPixel = y*this.size + this.size;

				if( 
					(xPixel >= game.offsetX && xPixel < (game.offsetX + game.width + this.size))
					&&
					(yPixel >= game.offsetY && yPixel < (game.offsetY + game.height + this.size))
				  ) {
				  	game.context.fillStyle = this.mapArray[y][x].color;
					game.context.fillRect(x*this.size, y*this.size, 1*this.size, 1*this.size);
				}
			}
		}
	}
}
