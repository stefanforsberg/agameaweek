var game = game || {};

game.gun = {
	x: 0,
	y: 0,
	subscriptions: [],
	crosshairSize: 4,
	draw: function() {
		game.context.beginPath();
		game.context.strokeStyle="rgba(255,255,255,0.05)";
		game.context.moveTo(game.player.x + (game.player.w / 2),game.player.y + (game.player.h / 2));
		game.context.lineTo(this.x,this.y);

		game.context.stroke();

		game.context.strokeStyle="rgba(255,255,255,0.4)";

		game.context.moveTo(this.x-this.crosshairSize, this.y-this.crosshairSize);
		game.context.lineTo(this.x+this.crosshairSize,this.y+this.crosshairSize);

		game.context.moveTo(this.x+this.crosshairSize, this.y-this.crosshairSize);
		game.context.lineTo(this.x-this.crosshairSize,this.y+this.crosshairSize);

		game.context.stroke();

	},
	init: function() {

		subscriptions = [];

		subscriptions.push(game.sources.mouseMove.scan(function(g, m) {
			g.x = m.x;
			g.y = m.y;
			return g;
		}, this).subscribe());
	},
	dispose: function() {
		this.subscriptions.forEach(function (s) {
			s.dispose();
		})
	}
};


