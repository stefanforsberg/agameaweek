game.target = {
	x: 0,
	y: 0,
	finder: {},
	current: null,
	canGo: true,
	type: "",
	tileType: "",
	canClick: true,
	init: function() {
		this.finder = new PF.AStarFinder({ 
			allowDiagonal: true,
    		dontCrossCorners: true
    	});
		this.canClick = true;
		this.x = 0;
		this.y = 0;
		this.canGo = true;

		this.current = game.player.current;

		game.subscriptions.push(Rx.Observable.fromEvent(game.canvas, 'click').scan(function (target, e) {

			if(!target.current) {
				return target;
			}

			var clickedTree = game.trees.clickedTree(target.x, target.y);
			if(clickedTree) {
				if(game.player.isInRangeOf(target.x, target.y)) {
					game.tasks.startTreeTask(game.player.current, clickedTree);
				}

				return target;
			}

			if(!target.canClick) {
				return target;
			}




			if(target.current.type === "object") {
				target.current.click(target.x, target.y, target.tileType);
				return target;
			}

			var grid = game.pathFinderGrid.clone();
			var path = target.finder.findPath(game.player.current.x, game.player.current.y, target.x, target.y, grid);
			game.player.setMovementArray(path);

			return target;
		}, this).subscribe());

		var mouseMoveStream = Rx.Observable.fromEvent(game.canvas, 'mousemove')
			.map(function(e) {
				return {
					x: (e.pageX - game.canvas.offsetLeft).toTileX(true),
					y: (e.pageY - game.canvas.offsetTop).toTileY(true),
				}
			}).
			filter(function(e) {
				return (e.x >= 0 && e.y >= 0);
			});

		game.subscriptions.push(mouseMoveStream.scan(function (target, e) {

			if(target.x !== e.x || target.y !== e.y) {

				target.tileType = game.map.tileTypeAt(e.x, e.y);

				var grid = game.pathFinderGrid.clone();
				target.canGo = target.finder.findPath(game.player.current.x, game.player.current.y, e.x, e.y, grid).length > 0;
			} 

			target.x = e.x;
			target.y = e.y;

			if(target.current.type === "player" && !target.canGo) {
				target.canClick = false;
				return target;
			}

			if(target.current.type === "object" && (target.current.buildOn.indexOf(target.tileType) <0)) {
				target.canClick = false;
				return target;
			}

			target.canClick = true;

			return target;
		}, this).subscribe());
	},
	draw: function() {

		if(!this.current) {
			return;
		}

		if(!this.canClick) {
			return;
		}


		game.context.save();
		game.context.globalAlpha = 0.5
		game.context.drawImage(this.current.img, this.x.tileToPos(), this.y.tileToPos());
		game.context.restore();
	}
}

