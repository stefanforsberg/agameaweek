game.stuff = {
	images: {
		phone: document.getElementById("stuff_phone"),
		computer: document.getElementById("stuff_computer"),
	},
	items: [],
	init: function(m) {
		this.items = [];
		m.forEach(function (s) {
			this.items.push(new game.item(s));
		}, this)
	},
	draw: function() {
		this.items.forEach(function (i) {
			i.draw();
		})
	},
	pickup: function(i) {
		if(i.type === "phone") {
			document.getElementById("phone_icon").src = "stuff_phone.png"
		} else if(i.type === "computer") {
			document.getElementById("computer_icon").src = "stuff_computer.png"
		} 
	}
}

game.item = function(i) {
	this.x = i.x;
	this.y = i.y;
	this.width = i.width;
	this.height = i.height;
	this.type = i.type;
	this.text = i.properties.text;

	if(this.type === "phone") {
		this.boundingBox = {
			x: this.x + 9,
			y: this.y + 5,
			width: 14,
			height: 22
		}
	} else if(this.type === "computer") {
		this.boundingBox = {
			x: this.x + 1,
			y: this.y + 6,
			width: 30,
			height: 20
		}
	} else {
		this.boundingBox = {
			x: this.x,
			y: this.y,
			width: game.tileSize,
			height: game.tileSize
		}
	}

	if(this.type !== "secret") {
		this.img = game.stuff.images[i.type];	
	}
	
	return this;
}

game.item.prototype.draw = function() {

	if(game.collides(this.boundingBox, game.player)) {
		game.stuff.pickup(this);
	}

	if(this.type === "secret") {
		return;
	}

	game.context.drawImage(this.img, this.x, this.y);
};