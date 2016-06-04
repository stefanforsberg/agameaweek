game.stuff = {
	images: {
		phone: document.getElementById("stuff_phone"),
		computer: document.getElementById("stuff_computer"),
		briefcase: document.getElementById("stuff_briefcase"),
		notebook: document.getElementById("stuff_notebook"),
	},
	items: [],
	itemTexts: [],
	init: function(m) {
		this.items = [];
		this.itemTexts = [];
		m.forEach(function (s) {
			this.items.push(new game.item(s));
		}, this)
	},
	draw: function() {
		this.items.forEach(function (i) {
			i.draw();
		})

		this.items = _.reject(this.items, function(t) { return t.remove; })

		this.itemTexts.forEach(function (i) {
			i.draw();
		})

		
	},
	pickup: function(i) {
		if(i.type === "secret") {
			game.state.secrets++;
			document.getElementById("secret" + i.no + "_icon").src = "stuff_secret.png"
		} else {
			game.state.items++;
			document.getElementById(i.type + "_icon").src = "stuff_" + i.type + ".png"
		}

		this.itemTexts.push(new game.stuffText(i.x, i.y, i.text));
	}
}

game.stuffText = function(x, y, text) {
	this.x = x;
	this.y = y;
	this.text = text;
	this.alpha = 2;
	this.fontSize = 10;

	if(this.y > (game.height / 2)) {
		this.dir = -0.5;
	} else {
		this.dir = 0.5;
	}

}

game.stuffText.prototype.draw = function() {
	

	game.context.fillStyle="rgba(108,40,108," + this.alpha + ")"
	game.context.font= this.fontSize + "px 'Press Start 2P'";
	game.context.fillText(this.text,this.x, this.y);

	this.alpha-= 0.01;
	this.y += this.dir;
	this.fontSize += 0.03
}

game.item = function(i) {
	this.x = i.x;
	this.y = i.y;
	this.width = i.width;
	this.height = i.height;
	this.type = i.type;
	this.text = i.properties.text;
	this.no = i.properties.no;
	this.remove = false;

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
	} else if(this.type === "briefcase") {
		this.boundingBox = {
			x: this.x + 1,
			y: this.y + 1,
			width: 30,
			height: 26
		}
	} else if(this.type === "notebook") {
		this.boundingBox = {
			x: this.x + 5,
			y: this.y + 4,
			width: 20,
			height: 25
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
		this.remove = true;
	}

	if(this.type === "secret") {
		return;
	}

	game.context.drawImage(this.img, this.x, this.y);
};