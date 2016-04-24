game.tasks = {
	items: [],
	taskText: document.getElementById("task"),
	init: function() {
		this.items = [];
	},
	startTreeTask: function(p, t) {
		this.items = _.filter(this.items, function(t) { return t.p.id !== p.id })
		this.items.push(new game.treeTask(p, t));
	},
	draw: function(t) {
		this.items = _.filter(this.items, function(t) { return !t.ended() })

		this.items.forEach(function (o) {
			o.draw(t);
		});
	}, 
	setTaskText: function(t) {
		this.taskText.innerHTML = t;
	}

}

game.treeTask = function(p, t) {
	this.p = p;
	this.t = t;
	return this;
}

game.treeTask.prototype.draw = function(ts) {

	if(!this.lineDash) {
		this.lineDash = 4
	}

	if(ts % 4 === 0) {
		this.t.life--;

		
	}

	if(ts % 10 === 0) {
		if(this.lineDash === 4) {
			this.lineDash = 2		
		} else {
			this.lineDash = 4
		}
	}

	game.context.save();
	game.context.translate(0.5, 0.5);
	game.context.setLineDash([this.lineDash]);
	game.context.strokeStyle = this.p.taskColor;
	game.context.beginPath();
	game.context.strokeRect(this.p.x.tileToPos(), this.p.y.tileToPos(), game.tileSize, game.tileSize);
	game.context.strokeRect(this.t.x.tileToPos(), this.t.y.tileToPos(), game.tileSize, game.tileSize);
	game.context.stroke();
	game.context.restore();
}

game.treeTask.prototype.ended = function() {
	return !this.p.isInRangeOf(this.t.x, this.t.y) || (this.t.life <= 0); 
}