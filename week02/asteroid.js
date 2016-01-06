var game = game || {};

game.asteroids = {
	items: [],
	init: function() {
		
		this.items = [];

		game.sources.tick.scan(function (a, t) {
			
			if(t % 200 === 0) {
			 	var asteroidToAdd = new asteroid();
				asteroidToAdd.init();
				a.items.push(asteroidToAdd)	
			}
			
			// }

			return a;
		}, this).subscribe();	
	},
	draw: function() {
		
		this.items.forEach(function (i) {

			if(!i.exploding) {
				if(game.collides(i, game.player)) {
					game.player.death();
				}	
			}

			i.draw();
		})
	},

}

var asteroid = function () {
	this.x = 400;
	this.y = 200;
	this.w = 16;
	this.h = 16;
	this.vx = 0;
	this.vy = 0;
	this.va = 0;
	this.angle = 0;
	this.baseCanvas = {};
	this.direction = 0;
	this.exploding = false;
	this.explodingShards = [];
	this.color = "";
};

asteroid.prototype.draw = function() {

	if(!this.exploding) {
		game.context.save();
		game.context.translate(this.x + (this.w/2), this.y + (this.h/2));
		game.context.rotate(this.angle*Math.PI/180);		
		game.context.drawImage(this.baseCanvas,-(this.w/2), -(this.h/2));
		game.context.restore();
	} else {
		if(this.explodingShards[0].alpha === 0) {
			this.seed();
		} else {
			this.explodingShards.forEach(function (i) {
				i.draw();
			});	
		}
	}
	
};

asteroid.prototype.explode = function() {
	game.sounds.explode.play();
	this.exploding = true;
	this.explodingShards = [];

	for(var i = 0; i < 20; i++) {
		this.explodingShards.push(new shard(this.x, this.y, this.vx, this.vy, this.color));	
	}
};

asteroid.prototype.setColor = function() {
	var colors = ["120, 197, 214", "197, 214,71", "232, 104, 162", "198, 98, 166", "121, 194, 103", "242, 140, 51"]

	this.color = colors[Math.floor(Math.random()*colors.length)];
};

asteroid.prototype.seed = function() {

	this.exploding = false;
	this.explodingShards = [];
	this.angle = 0;

	this.vx = 2*(-2+Math.random()*4);
	this.vy = 2*(-2+Math.random()*4);

	this.va = -2+Math.random()*2;

	if(this.vx > 0) {
		this.x = -10
	} else {
		this.x = game.settings.width + 10;
	}

	if(this.vy > 0) {
		this.y = -10
	} else {
		this.y = game.settings.height + 10;
	}
};

asteroid.prototype.init = function() {

	this.baseCanvas = document.createElement("canvas");
	this.baseCanvas.style.cssText = "width: 16px; height:16px;display:none;";

	this.w = 8 + Math.random()*25;
	this.h = this.w;

	this.setColor();

	var baseContext = this.baseCanvas.getContext("2d");

	baseContext.rect(0,0,this.w,this.h);
	baseContext.clip();

	baseContext.beginPath();
	baseContext.fillStyle = "rgba(" + this.color + ",.5)";

    baseContext.moveTo(0,0);
    baseContext.lineTo(this.w,0);
    baseContext.lineTo(this.w/2,this.h);	

	baseContext.fill();

	for(var i = 0; i < 4; i++) {
		baseContext.save();
		baseContext.beginPath();
		baseContext.fillStyle = "rgba(" + this.color + ",." + 0.05 + 0.1*Math.random() +")";
		baseContext.translate(this.w/2,this.h/2);
		baseContext.rotate(Math.random()*360*Math.PI/180);
	    baseContext.moveTo(0,0);
	    baseContext.lineTo(this.w,0);
	    baseContext.lineTo(this.w/2,this.h);		
		baseContext.fill();
		baseContext.restore();	
	}

	this.seed();

	game.sources.tick.scan(function (a, t)	{
		a.angle+= a.va;
		a.y += a.vy;
		a.x += a.vx

		if((a.x < -30) || (a.x > (game.settings.width+30)) || (a.y < -30) || (a.y > (game.settings.height+30))) {
			a.seed();
		}

		return a;
	}, this).subscribe();

	game.sources.mouseClick.scan(function (a, m) {

		if(!a.exploding) {
			if(game.collides(a, {x: m.x, y: m.y, w: 3, h: 3})) {
				a.explode();
			}
		}
		
		return a;
	}, this).subscribe();
};

var shard = function(x, y, vx, vy, color) {
	this.x = x;
	this.y = y;
	this.color = color;
	this.vx = vx * Math.random();
	this.vy = vy * Math.random();
	this.alpha = 0.5;
	this.counter = 1;
}

shard.prototype.draw = function () {

	game.context.beginPath();
	game.context.fillStyle = "rgba(" + this.color + "," + this.alpha + ")";
	game.context.arc(this.x, this.y, 5, 0, Math.PI*2);
	game.context.fill();

	this.alpha -= (this.counter/400);

	this.x += this.vx;
	this.y += this.vy;

	this.counter++;
}