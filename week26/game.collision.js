game.collision = {
	init: function() {

	},
	collides: function colCheck(shapeA, shapeB) {
	    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2));
	    var vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2));

	    var hWidths = (shapeA.width / 2) + (shapeB.width / 2);
	    var hHeights = (shapeA.height / 2) + (shapeB.height / 2);

	    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        return true;
	    }
	    return false;
	},	
	playerBlocked: function(x, y) {

		if(y < 0) {
			return true;
		}

		var blocked = false;

		var tileX = Math.floor((x+16) / game.map.size);
		var tileY = Math.floor((y+16) / game.map.size);

		var newPlayerBoundBox = {
			x: x,
			y: y,
			width: game.player.width,
			height: game.player.height
		}

		var colliders = [];

		for(var py = -1; py < 2; py++) {
			for(var px = -1; px < 2; px++) {

				if((tileY === 0 && py === -1) || (tileX === 0 && px === -1)) {
					colliders.push({x: tileX*game.map.size + game.map.size*px, y: tileY*game.map.size + game.map.size*py, width: game.map.size, height: game.map.size})
				} else if(game.map.mapArray[tileY+1*py][tileX+1*px].blocks) {
					colliders.push({x: tileX*game.map.size + game.map.size*px, y: tileY*game.map.size + game.map.size*py, width: game.map.size, height: game.map.size})
				}
			}
		}

		if(game.debug) {
			game.context.strokeStyle = "#000000";
			game.context.strokeRect(tileX*game.map.size, tileY*game.map.size, game.map.size, game.map.size);

			game.context.strokeStyle = "#00FF00";
			game.context.strokeRect(game.player.x, game.player.y, game.player.width, game.player.height);	

			colliders.forEach(function (c) {
				game.context.strokeStyle = "#FF0000";
				game.context.strokeRect(c.x, c.y, c.width, c.height);	
			});
		}

		blocked = _.any(colliders, function(c) {
			return game.collision.collides(c, newPlayerBoundBox)
		});

		return blocked;
	},
	shotHit: function(x,y) {

		var tileX = Math.floor((x) / game.map.size);
		var tileY = Math.floor((y) / game.map.size);

		if(tileY < 0) {
			return {
				canNotBeShot: true
			}
		}

		var tile = game.map.mapArray[tileY][tileX];

		if(!tile.blocks) {
			return null;
		}

		return game.map.mapArray[tileY][tileX];
	}

}

