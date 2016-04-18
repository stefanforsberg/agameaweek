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
					game.offsetX += game.tileSize;
				} else if(e === 37) {
					if(game.offsetX > 0) {
						game.offsetX -= game.tileSize;	
					}
					
				}
		}));
	}
}