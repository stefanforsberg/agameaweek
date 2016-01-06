var game = game || {};

game.stars = {

	items: [],

	init: function() {

		this.items = [];

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
	this.radius = 1 + Math.random() * 1.5;
	this.alpha = 0.02 + 0.25*Math.random();
	this.setColor();
}

star.prototype.setColor = function() {
	var colors = ["151, 170, 246", "235, 234, 240", "250, 206, 159"]
	this.color = colors[Math.floor(Math.random()*colors.length)];
}

star.prototype.draw = function() {

	game.context.beginPath();
	game.context.fillStyle = "rgba(" + this.color + "," + this.alpha + ")";
	game.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
	game.context.fill();

	this.x += this.vx;
	this.y += this.vy;
}