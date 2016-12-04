game.shots = {
	items: [],
 	init: function() {
 		this.items = [];
 		this.itemsEnemy = [];

		 this.shotImg = document.getElementById("shot");

		 this.shot2Img = document.getElementById("shot2");
 	},
 	add: function(s) {
 		
 		this.items.push(s)
 	},
 	addEnemy: function(s) {
 		this.itemsEnemy.push(s)
 	},
 	draw: function() {

 		this.items = _.reject(this.items, function(t) { return t.remove; })
 		this.itemsEnemy = _.reject(this.itemsEnemy, function(t) { return t.remove; })

 		this.items.forEach(function (s) {
 			s.draw();
			game.boss.handleShot(s); 
 		})

 		this.itemsEnemy.forEach(function (s) {
 			s.draw();
 		})
 	}
}



game.shots.shot = function(x,y,dx,dy,img) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.width = game.shots.shotImg.width;
	this.height = game.shots.shotImg.height;
	this.img = img;
	return this;
}

game.shots.shot.prototype.draw = function() {
	game.context.drawImage(this.img, this.x, this.y)
	this.x += this.dx();
	this.y += this.dy();

	if(this.x < -3 || this.x > 640 || this.y < -3 || this.y > 480) {
		this.remove = true;
	}

}

