var game = game || {};

game.minions = {
	items: [],
	init: function() {
		this.items.push({x: 400, y: 200, radius: 10});
	},
	draw: function() {

		for(var i = this.items.length-1; i >= 0; i--) {
			var minion = this.items[i];

			game.context.beginPath();
			game.context.fillStyle = "#ffffff";
			game.context.arc(minion.x,minion.y,minion.radius,0,game.PI2);
			game.context.fill();
		}
	}
}