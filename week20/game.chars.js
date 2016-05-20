game.chars = {
	items: [],
	tickets: [],
	init: function(chars) {
		this.items = [];
		this.tickets = [];

		chars.forEach(function (c) {
			this.items.push(new game.charSm(c));
		}, this)
		
	},
	draw: function() {
		this.items.forEach(function (c) {
			c.draw();
		})

		this.tickets.forEach(function (c) {
			c.draw();
		})
	}
}

game.charSm = function(c) {
	this.img = document.getElementById("charsm");
	this.x = c.x;
	this.y = c.y;
	this.sprite = 0;
	this.spriteCounter = 0;
	this.rotation = c.rotation;
	this.ticketDelay = 0;
	for(var k in c.properties) this[k]=Number(c.properties[k]);

	return this;
}

game.charSm.prototype.canTarget = function() {

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
	

	return false;
}

game.charSm.prototype.target = function(sx, sy, dx, dy) {

	if(this.ticketDelay > 0) {
		this.ticketDelay--;
	} else {
		game.chars.tickets.push(new game.jiraTicket(sx, sy, dx, dy, 2));
		this.ticketDelay = 100;
	}
}

game.jiraTicket = function(sx, sy, dx, dy, acceleration) {

	var dX = sx - dx;
	var dY = sy - dy;

	var dist = Math.sqrt(dX*dX+dY*dY);
	this.x = sx;
	this.y = sy;
	this.img = document.getElementById("jira");
	this.vx = -1*(dX/dist)*acceleration;
	this.vy = -1*(dY/dist)*acceleration;

	return this;
}

game.jiraTicket.prototype.draw = function() {
	game.context.drawImage(this.img, this.x, this.y);

	this.x += this.vx;
	this.y += this.vy;
}


game.charSm.prototype.draw = function() {

	game.walls.canSee(this, game.player)

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
};

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
