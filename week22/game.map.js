game.map = {
	tiles: {},
	canvas: {},
	tileArray: [],
	block: [],
	init: function(map) {
		this.block = []
		this.tileArray = []

		this.width = map.width*game.tileSize;

		for(var y = 0; y < map.height; y++) {
			var xArray = [];
			for(var x = 0; x < map.width; x++) {
				xArray.push("ground");
			}
			this.tileArray.push(xArray);
		}

		var blocks = _.findWhere(map.layers, {name: "Block"});

		blocks.objects.forEach(function (o) {
			this.block.push( {
				x: o.x,
				y: o.y,
				width: o.width,
				height: o.height
			})
		}, this);

		var walls = _.findWhere(map.layers, {name: "Wall"});

		game.walls.init(walls.objects);

		var chars =  _.findWhere(map.layers, {name: "Char"});

		game.chars.init(chars.objects);

		var stuff =  _.findWhere(map.layers, {name: "Stuff"});

		game.stuff.init(stuff.objects);

	},
	blocked: function(p) {

		var currentScreenBlocks = _.filter(this.block, function(b) {
			return game.isOnScreenFull(b);
		})

		return _.some(currentScreenBlocks, function(b) {
			return game.collides(b, p);
		}) 
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
    request.open("GET", "floor1.json", true);
    request.send();
}

