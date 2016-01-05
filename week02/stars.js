var game = game || {};

game.stars = {

	items: [],

	init: function() {

		for(var i = 0; i < 1000; i++) {
			this.items.push(new star());
		}
	},
	draw: function() {
		this.items.forEach(function (i) {
			i.draw();
		});	
	}
}

function star() {
	this.x = Math.random()*game.settings.width;
	this.y = Math.random()*game.settings.height;
	this.vx = -1/30 + Math.random() / 20;
	this.vy = -1/30 +  Math.random() / 20;
	this.radius = Math.random() * 2.5;
	this.alpha = 0.02 + 0.3*Math.random();
}

star.prototype.draw = function() {
	game.context.beginPath();
	game.context.fillStyle = "rgba(255,255,255," + this.alpha + ")";
	game.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
	game.context.fill();

	this.x += this.vx;
	this.y += this.vy;
}