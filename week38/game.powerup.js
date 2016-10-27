game.powerup = {
	items: [],
	init: function() {
		this.items = [];
		this.img = document.getElementById("powerup")
	}, 
	add: function(x, y) {

		var r = Math.random();

		var item;

		if(r < 0.05) {
			item = new game.powerup.item(x,y);
			item.sx = 0;
			item.sy = 0;
			item.hit = function() { game.player.upgradeWeapon() } ;
		} else 	if(r >= 0.05 && r < 0.1) {
			item = new game.powerup.item(x,y);
			item.sx = 16;
			item.sy = 0;
			item.hit = function() { game.player.upgradeHealth() } ;
		}

		if(item) {
			this.items.push(item);	
		}
		
	},
	draw: function() {

		this.items = _.reject(this.items, function(t) { return t.remove; })

		this.items.forEach(function (i) {

			if(game.collides(i, game.player)) {
				i.hit();
				game.sounds[0].play("powerup");
				i.remove = true;
			}

			i.draw();
		});
	}
}

game.powerup.item = function(x, y) {
	this.x = x;
	this.y = y;
	this.width = 16;
	this.height = 16;
	return this;
}

game.powerup.item.prototype.draw = function() {
	game.context.drawImage(game.powerup.img, this.sx, this.sy, 16, 16, this.x, this.y, 16, 16);
	this.x--;

	if(this.x < -40) {
		this.remove = true;
	}
}
