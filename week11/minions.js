var game = game || {};

game.minions = {
	items: [],
	currentTargetIndex: -1,
	init: function() {

		this.items = [];

		this.currentTargetIndex = -1;
		//this.items.push(new game.minions.shooter());
		//this.items.push(new game.minions.shooter());

		var that = this;

		game.subscriptions.push(game.bossDead.subscribe(function() {
			for(var i = 0; i < game.bossLevel; i++) {
				that.items.push(new game.minions.shooter());
			} 
		}));
	},
	draw: function() {
		for(var i = this.items.length-1; i >= 0; i--) {
			this.items[i].draw();
		}
	},
	hit: function(objectToHit) {
		for(var i = this.items.length-1; i >= 0; i--) {
			if(game.collides(objectToHit, this.items[i])) {
				this.items.splice(i, 1);
				if(this.currentTargetIndex === i) {
					this.currentTargetIndex = -1;
					game.player.currentTarget = game.currentBoss;
				}
				
				
				return true;
			}
		}

		return false;
	},
	nextTarget: function() {



		this.currentTargetIndex++;

		if(this.currentTargetIndex >= this.items.length) {
			console.log(this.currentTargetIndex)
			this.currentTargetIndex = -1;
			return false;
		} else {
			return this.items[this.currentTargetIndex];
		}
	}
}

game.minions.shooter = function() {
	
	this.x = 100 + (Math.random()*(game.width-200));
	this.y = 100 + (Math.random()*(game.height-200));
	this.radius = 10;
	this.probability = 0.01;

	this.draw =  function() {

		if(Math.random() < this.probability) {
			var target = {
				x: Math.random()*game.width,
				y: Math.random()*game.width
			}

			var pointToPoint = game.pointToPoint(this, target, 1);

			game.shots.add({x: this.x, y: this.y, vx: pointToPoint.vx, vy: pointToPoint.vy, radius: 5});
		}

		game.context.beginPath();
		game.context.fillStyle = "#ffffff";
		game.context.arc(this.x,this.y,this.radius,0,game.PI2);
		game.context.fill();
	}

	return this;
}