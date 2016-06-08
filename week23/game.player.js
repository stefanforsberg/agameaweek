game.player = {
	x: 100,
	y: 100,
	speed: 2,
	smoke: [],
	angle: 0,
	img: document.getElementById("ship"),
	init: function() {
		for(var i = 0; i < 120; i++)	{
			this.smoke.push(new game.player.smokeItem(this.x, this.y));	
		}
		
	},
	draw: function() {

		this.smoke.forEach(function (s) {
			s.draw();
		})

		var vx = 0, vy = 0;

		if(game.keys.r) {
			vx = this.speed;
		}

		if(game.keys.l) {
			vx = -this.speed;
		}

		if(game.keys.d) {
			vy = this.speed;
		}

		if(game.keys.u) {
			vy = -this.speed;
		}

		this.x += vx;
		this.y += vy + Math.sin(this.angle * Math.PI / 180)/10;

		this.angle+=2

		game.context.drawImage(this.img, this.x, this.y);


		var relativeScreenPosition = {
			x: this.x - game.offsetX,
			y: this.y - game.offsetY,
		} 

		if( (relativeScreenPosition.x > 340 && game.offsetX < (game.map.widthInPixels-game.width)) 
			||
			(relativeScreenPosition.x < 300 && game.offsetX >= 4)
			) {
			game.offsetX+= vx;
		}

		if( (relativeScreenPosition.y > 340 && game.offsetY < (game.map.heightInPixels-game.height)) 
			||
			(relativeScreenPosition.y < 300 && game.offsetY >= 4)
			) {
			game.offsetY+= vy;
		}


	}
}

game.player.smokeItem = function() {
	this.init();
}

game.player.smokeItem.prototype.init = function() {
	this.x = game.player.x;
	this.y = game.player.y+16;
	this.alpha = Math.random();
	this.vx = -Math.random()/5;
	this.vy = -Math.random();
	this.angle = Math.random()*360;
	this.radius = Math.random();	
}

game.player.smokeItem.prototype.draw = function() {
	this.y += this.vy //this.vy + Math.sin(this.angle * Math.PI / 180);
	this.x += this.vx; //this.vx + Math.cos(this.angle * Math.PI / 180);;
	this.alpha -= 0.01;
	this.angle++;
	this.radius += 0.05;

	game.context.beginPath();
    game.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    game.context.fillStyle = "rgba(255, 255, 255, " + this.alpha + ")";
    game.context.fill();
    game.context.closePath();

    if(this.alpha <= 0) {
    	this.init();
    }
}