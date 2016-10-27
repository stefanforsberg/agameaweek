game.shots = {
	items: [],
 	init: function() {
 		this.items = [];
 		this.itemsEnemy = [];

 		this.shotImg = document.createElement("canvas");
		this.shotImg.width = 6;
		this.shotImg.height = 1;
		var context = this.shotImg.getContext("2d")

		context.fillStyle = "rgba(255,255,255,0.8)"
		context.fillRect(2,0,2,1);
		context.fillStyle = "rgba(255,255,255,0.4)"
		context.fillRect(1,0,1,1);
		context.fillRect(4,0,1,1);
		context.fillStyle = "rgba(255,255,255,0.1)"
		context.fillRect(0,0,1,1);
		context.fillRect(5,0,1,1);

 		this.shot2Img = document.createElement("canvas");
		this.shot2Img.width = 3;
		this.shot2Img.height = 3;
		context = this.shot2Img.getContext("2d")

		context.fillStyle = "rgba(255,255,255,1)"
		context.fillRect(1,1,1,1);
		context.fillStyle = "rgba(255,255,255,0.7)"
		context.fillRect(1,0,1,1);
		context.fillRect(0,1,1,1);
		context.fillRect(2,1,1,1);
		context.fillRect(1,2,1,1);	
		context.fillStyle = "rgba(255,255,255,0.4)"
		context.fillRect(0,0,1,1);
		context.fillRect(2,0,1,1);
		context.fillRect(0,2,1,1);
		context.fillRect(2,2,1,1);		
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

	if(this.x < -10 || this.x > 650 || this.y < -10 || this.y > 650) {
		this.remove = true;
	}

}

