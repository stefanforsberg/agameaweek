game.controls = {
	init: function() {
		window.addEventListener("keydown", this.handleKeyDown.bind(this), false);	
	},
	handleKeyDown: function(e) {

		switch(e.keyCode) {

			case 65:
				game.player.moveLeft();
				e.preventDefault();
				game.renderScene.render();
				break;

			case 68:
				game.player.moveRight();
				e.preventDefault();
				game.renderScene.render();
				break;				

			case 69:
				game.player.rotateRight();
				e.preventDefault();
				game.renderScene.render();
				break;

			case 81:
				game.player.rotateLeft();
				e.preventDefault();
				game.renderScene.render();
				break;

			case 87:
				game.player.moveForward();
				e.preventDefault();
				game.renderScene.render();
				break;

			case 83:
				game.player.moveBack();
				e.preventDefault();
				game.renderScene.render();
				break;	

			case 32:
				game.buttons.action();
				e.preventDefault();
				break;			
		}


	}
	
}