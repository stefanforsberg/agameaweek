game.map = {
	tiles: {},
	canvas: {},
	tileArray: [],
	init: function(map) {

		this.tileArray = []

		for(var y = 0; y < map.height; y++) {
			var xArray = [];
			for(var x = 0; x < map.width; x++) {
				xArray.push("ground");
			}
			this.tileArray.push(xArray);
		}


		var mapImage = document.getElementById("mapImage");
		this.canvas = document.createElement('canvas');
	    this.canvas.width  = mapImage.naturalWidth;
	    this.canvas.height = mapImage.naturalHeight;

	    var context = this.canvas.getContext("2d");

	    context.drawImage(mapImage, 0, 0);

		game.pathFinderGrid = new PF.Grid(map.width, map.height); 

		var treeLayer = map.layers[1];

		game.trees.init(treeLayer);

		treeLayer.objects.forEach(function (o) {
			this.tileArray[o.y.toTileY()][o.x.toTileX()+1] = "tree";
			game.pathFinderGrid.setWalkableAt(o.x.toTileX()+1, o.y.toTileY(), false);
		}, this);

		var waterLayer = map.layers[2];

		waterLayer.objects.forEach(function (o) {
			this.tileArray[o.y.toTileY()][o.x.toTileX()+1] = "water";
			game.pathFinderGrid.setWalkableAt(o.x.toTileX()+1, o.y.toTileY(), false);
		}, this);
	},
	tileTypeAt: function(x, y) {

		if( (y < 0 || y > this.tileArray.length) || (x < 0 || x > this.tileArray[0].length) ) {
			return "oob";
		}

		return this.tileArray[y][x];
	},
	draw: function() {
		game.context.drawImage(this.canvas, 0, 0)
	}

}

game.loadMap = function(cb) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
		if ((request.readyState == 4))
		{
			cb(JSON.parse(request.responseText));
		}
    }
    request.open("GET", "map.json", true);
    request.send();
}

game.parseMap = function(map) {

	game.map.init(map);

	console.log(map);



}

