game.chars = {
	images: {
		sm: document.getElementById("charsm"),
		ea: document.getElementById("charea"),
		alert: document.getElementById("alert"),
		jira: document.getElementById("jira"),
		xml: document.getElementById("xml")
	} ,
	items: [],
	tickets: [],
	init: function(chars) {
		this.items = [];
		this.tickets = [];

		chars.forEach(function (c) {
			if(c.type === "sm") {
				this.items.push(new game.charSm(c, game.chars.images.sm, game.chars.images.jira));	
			} else if(c.type === "ea") {
				this.items.push(new game.charSm(c, game.chars.images.ea, game.chars.images.xml));	
			}else if(c.type === "follow") {
				this.items.push(new game.charFollow(c));	
			}
			
		}, this)
		
	},
	draw: function() {
		this.items.forEach(function (c) {
			c.draw();
		})

		this.tickets.forEach(function (c) {
			c.draw();
		})

		this.tickets = _.reject(this.tickets, function(t) { return t.remove; })
	}
}

game.charFollow = function(c) {
	this.img = document.getElementById("charfollow");

	this.x = c.x;
	this.y = c.y;
	this.width = game.tileSize;
	this.height = game.tileSize;
	this.rotation = 0;
	this.text = c.properties.text;

	return this;
}

game.charFollow.prototype.draw = function() {

	if(game.isOnScreen(this)) {

		var alpha = (this.x - game.player.x) / 200;
		
		if(Math.abs(alpha < 1)) {

			alpha = 1-Math.abs(alpha);

			if(this.text === "welcome") {
				game.context.fillStyle="rgba(255,255,255," + alpha*0.7 +  ")"
				game.context.strokeStyle="rgba(0,0,0," + alpha*0.7 +  ")"
				game.context.fillRect(455,350, 230, 57);
				game.context.strokeRect(455,350, 230, 57);

				game.context.fillStyle="rgba(0,0,0," + alpha + ")"
				game.context.font="10px 'Press Start 2P'";
				game.context.fillText("Morning! You need to",460, 370);
				game.context.fillText("hurry back to day care",460, 370+14*1);
				game.context.fillText("to pick up your kids!",460,  370+14*2);	
			} else if(this.text === "key") {
				game.context.fillStyle="rgba(255,255,255," + alpha*0.7 +  ")"
				game.context.strokeStyle="rgba(0,0,0," + alpha*0.7 +  ")"
				game.context.fillRect(2176,160, 230, 57);
				game.context.strokeRect(2176,160, 230, 57);

				game.context.fillStyle="rgba(0,0,0," + alpha + ")"
				game.context.font="10px 'Press Start 2P'";
				game.context.fillText("Beware! The enterprice",2181, 180);
				game.context.fillText("architects are up",2181, 180+14*1);
				game.context.fillText("ahead!",2181,  180+14*2);	
			}
			
		}

		var deltaX = this.x - game.player.x;
		var deltaY = this.y - game.player.y;
		angleInRadians = (-Math.PI/2) + Math.atan2(deltaY, deltaX);

		game.context.save();
		game.context.translate(this.x + (game.tileSize/2), this.y + (game.tileSize/2));
		game.context.rotate(angleInRadians);		
		game.context.drawImage(this.img, -(game.tileSize/2), -(game.tileSize/2));
		game.context.restore();
	}


};

game.charSm = function(c, img, ticketImg) {
	this.img = img;
	this.ticketImg = ticketImg;
	this.alertImg = game.chars.images.alert;
	this.x = c.x;
	this.y = c.y;
	this.width = game.tileSize;
	this.height = game.tileSize;
	this.sprite = 0;
	this.spriteCounter = 0;
	this.rotation = c.rotation;
	this.ticketDelay = 0;
	this.id = c.id;
	for(var k in c.properties) this[k]=Number(c.properties[k]);
	console.log(this.x);
	return this;
}

game.charSm.prototype.canTarget = function() {

	if(game.isOnScreen(this)) 
	{
		if(this.dx > 0) {
			if(this.dir > 0) {
				return game.player.x > this.x;
			} else {
				return game.player.x < this.x;
			}
		} else if(this.dy > 0) {
			if(this.dir > 0) {
				return game.player.y > this.y;
			} else {
				return game.player.y < this.y
			}
		}
	}

	return false;
}

game.charSm.prototype.target = function(sx, sy, dx, dy) {

	if(this.ticketDelay > 0) {
		this.ticketDelay--;
	} else {
		game.chars.tickets.push(new game.ticket(sx, sy, dx, dy, 2, this.ticketImg));
		this.ticketDelay = this.ticketDelayMax;
	}
}

game.charSm.prototype.draw = function() {

	this.alert = false;

	if(this.canTarget()) {
		
		var canSee = game.walls.canSee(this, game.player);

		if(canSee.canSee) {
			this.alert = true;
			this.target(canSee.o1x, canSee.o1y, canSee.o2x, canSee.o2y);
		}
	}

	if(this.notMoving) {
		game.context.save();
	
		game.context.translate(this.x + (game.tileSize/2), this.y + (game.tileSize/2));
		game.context.rotate(this.rotation*Math.PI/180);		
		game.context.drawImage(this.img, 
			this.sprite*game.tileSize, 0, game.tileSize, game.tileSize,
			-(game.tileSize/2), -(game.tileSize/2), game.tileSize, game.tileSize
			);
		
		game.context.restore();	
	} else {
		game.context.save();
	
		game.context.translate(this.x + (game.tileSize/2), this.y + (game.tileSize/2));
		game.context.rotate(this.rotation*Math.PI/180);		
		game.context.drawImage(this.img, 
			this.sprite*game.tileSize, 0, game.tileSize, game.tileSize,
			-(game.tileSize/2), -(game.tileSize/2), game.tileSize, game.tileSize
			);
		
		game.context.restore();	

		this.spriteCounter++;

		if(this.spriteCounter % 15 === 0) {
			this.sprite++;	
		}

		if(this.sprite > 3) {
			this.sprite = 0;
			this.spriteCounter = 0;
		}

		this.x += this.dir*this.dx;
		this.y += this.dir*this.dy;

		if(this.x > this.maxX) {
			this.dir = this.dir*-1;
			this.rotation += 180;
		}

		if(this.x < this.minX) {
			this.dir = this.dir*-1;	
			this.rotation += 180;
		}

		if(this.y > this.maxY) {
			this.dir = this.dir*-1;
			this.rotation += 180;
		}

		if(this.y < this.minY) {
			this.dir = this.dir*-1;
			this.rotation += 180;
		}
	}
	
	if(this.alert) {
		game.context.drawImage(this.alertImg, this.x, this.y);
	}
};

game.ticket = function(sx, sy, dx, dy, acceleration, img) {

	var dX = sx - dx;
	var dY = sy - dy;

	var dist = Math.sqrt(dX*dX+dY*dY);
	this.x = sx;
	this.y = sy;
	this.width = 32;
	this.height = 32;
	this.img = img;
	this.vx = -1*(dX/dist)*acceleration;
	this.vy = -1*(dY/dist)*acceleration;

	this.remove = false;

	return this;
}

game.ticket.prototype.boundingBox = function() {
	return {
		x: this.x + 5,
		y: this.y + 7,
		width: 20,
		height: 16
	}
}

game.ticket.prototype.draw = function() {
	game.context.drawImage(this.img, this.x, this.y);

	this.x += this.vx;
	this.y += this.vy;

	if(game.isOnScreenFull(this)) {

		if (game.collides(this.boundingBox(), game.player)) {
			this.remove = true;
		}
	} else {
		this.remove = true;
	}
}

function Ccw(p1, p2, p3) {
  a = p1.x; 
  b = p1.y; 
  c = p2.x; 
  d = p2.y;
  e = p3.x; 
  f = p3.y;
  
  return (f - b) * (c - a) > (d - b) * (e - a);
}

function isIntersect(p1, p2, p3, p4) {
  return (Ccw(p1, p3, p4) != Ccw(p2, p3, p4)) && (Ccw(p1, p2, p3) != Ccw(p1, p2, p4));
}
