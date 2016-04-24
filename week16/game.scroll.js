game.scroll = {
	init: function() {
		game.subscriptions.push(Rx.Observable.fromEvent(window, 'keydown')
			.map(function (e) {
				return e.keyCode;
			})
			.filter(function (e) {
				return (e === 37 || e === 39);
			})
			.subscribe(function (e) {

				if(e === 39) {
					if(game.offsetX < 2368) {
						game.offsetX += game.tileSize;	
					}
				} else if(e === 37) {
					if(game.offsetX > 0) {
						game.offsetX -= game.tileSize;	
					}
					
				}

				if(game.offsetX > 1120 && game.sounds.current == "left") {
					game.sounds.current = "right";
					game.sounds.left.fadeOut(0, 2000);
					game.sounds.right.fadeIn(0.5, 3000);
				} else if(game.offsetX < 1120 && game.sounds.current == "right") {
					game.sounds.current = "left";
					game.sounds.left.fadeIn(0.5, 3000);
					game.sounds.right.fadeOut(0, 2000);
				}
		}));
	}
}