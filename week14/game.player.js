game.player = {
	movement: {},
	current: null,
	taskColor: "",
	init: function() {
		this.current = game.wizard;
	},
	draw: function(t) {
	
		if(this.movement.length > 0 && t % 5 === 0) {
			this.current.x = this.movement[0][0];
			this.current.y = this.movement[0][1];
			this.movement.shift();
		}

		if(game.target.current.type === "player") {
			game.context.save();
			game.context.lineWidth = "1px";
			game.context.strokeStyle = "rgba(0,0,0,0.9)"
			game.context.strokeRect(this.current.x.tileToPos(), this.current.y.tileToPos(), game.tileSize, game.tileSize);
			game.context.restore();	
		}
		

		game.context.drawImage(game.wizard.img, game.wizard.x.tileToPos(), game.wizard.y.tileToPos());
		game.context.drawImage(game.hunter.img, game.hunter.x.tileToPos(), game.hunter.y.tileToPos());
		
	},
	setMovementArray: function(p) {
		this.movement = p
	},
	isInRangeOf: function(x,y) {
		return this.current.isInRangeOf(x,y);
	},
	clicked: function(x, y) {
		if(x === game.wizard.x && y === game.wizard.y) {
			this.movement = [];
			this.current = game.wizard;
			return true;
		} else if(x === game.hunter.x && y === game.hunter.y) {
			this.movement = [];
			this.current = game.hunter;
			return true;
		}

		return false;
	}
}

game.wizard = {
	img: document.getElementById("chars_map"),
	taskColor: "#263238",
	x: 0,
	y: 3,
	id: 0,
	type: "player",
	isInRangeOf: function(x,y) {
		return (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <=1 );
	},
}

game.hunter = {
	img: document.getElementById("char_hunter"),
	x: 0,
	y: 5,
	taskColor: "#0032ff",
	id: 1,
	type: "player",
	isInRangeOf: function(x,y) {
		return (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <=1 );
	},
}