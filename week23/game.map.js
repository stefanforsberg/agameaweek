game.map = {
	width: 20,
	height: 20,
	chanceToStartAlive: 0.4,
	mapArray: [],
	size: 48,
	init: function() {
		this.map = [];
		this.widthInPixels = this.width * this.size;
		this.heightInPixels = this.height * this.size;


		for(var y=0; y<this.height; y++) {


			var xArray = [];
	        for(var x=0; x<this.height; x++){
	        	xArray.push( (Math.random() < this.chanceToStartAlive))
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

	    console.log(this.mapArray);
	},
	aliveNeighbours: function(x, y) {
		//Returns the number of cells in a ring around (x,y) that are alive.
	    var count = 0;

	    for(var i=-1; i<2; i++){
	        for(var j=-1; j<2; j++){
	            var neighbour_x = x+i;
	            var neighbour_y = y+j;
	            //If we're looking at the middle point
	            if(i === 0 && j === 0){
	                continue;
	            }
	            //In case the index we're looking at it off the edge of the map
	            else if(neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= this.width || neighbour_y >= this.height){
	                count = count + 1;
	            }
	            //Otherwise, a normal check of the neighbour
	            else if(this.mapArray[neighbour_y][neighbour_x]){
	                count = count + 1;
	            }
	        }
	    }

	    return count;
	},
	doGeneration: function(currentMapArray) {

		var newMap = [];

		for(var y=0; y<this.height; y++) {

			var newXArray = [];

			var deathLimit = 5;
			var birthLimit = 2;

	        for(var x=0; x<this.width; x++){

	            var nbs = this.aliveNeighbours(x, y);
	           
	            //The new value is based on our simulation rules
	            //First, if a cell is alive but has too few neighbours, kill it.

	            var dead;

	            if(currentMapArray[x][y]){
	                if(nbs < deathLimit){
	                    dead = false;
	                }
	                else{
	                    dead = true;
	                }
	            } //Otherwise, if the cell is dead now, check if it has the right number of neighbours to be 'born'
	            else{
	                if(nbs > birthLimit){
	                    dead = true;
	                }
	                else{
	                    dead= false;
	                }
	            }


	            newXArray.push(dead);
	            
	        }

	        newMap.push(newXArray);
	        
	    }

	    this.mapArray = newMap;
	},

	draw: function() {

		


		for(var y = 0; y < this.mapArray.length; y++) {
			for(var x = 0; x < this.mapArray[0].length; x++) {
				if(this.mapArray[y][x]) {
					game.context.fillStyle = "rgba(255,255,255,0.2)";
				} else {
					game.context.fillStyle = "rgba(0,0,0,0.2)";
				}

				game.context.fillRect(x*this.size, y*this.size, 1*this.size, 1*this.size);
			}
		}
	}
    
}
