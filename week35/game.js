var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.load = function() {

	game.sounds = [];
	game.sounds[0] = new Howl({
		urls: ['sfx.mp3'],
		sprite: {
	    	door: [0, 2500],
	    	teleport: [2600,4000],
	    	doorClose: [6500,2500]
	  	},
		onload: function() {
			game.sounds[1] = new Howl({
				urls: ['song.mp3'], 
				loop: true,
				onload: function() {
					game.sounds[1].play();
					game.init();	
				}
			})
		}		  			
	});
}

game.init = function() {
	var style = game.canvas.getAttribute('style') || '';
	var scale = Math.min(window.innerWidth/game.canvas.width,window.innerHeight/game.canvas.height);
	game.canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');

	game.controls.init();

	game.map.init();

	game.renderScene.init();

	game.renderScene.render();

}