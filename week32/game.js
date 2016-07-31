var game = game || {};

game.canvas = document.getElementById("game");
game.context = game.canvas.getContext("2d");

game.load = function() {

	game.init();
}

game.init = function() {
	var style = game.canvas.getAttribute('style') || '';
	var scale = Math.min(window.innerWidth/game.canvas.width,window.innerHeight/game.canvas.height);
	game.canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');

	game.controls.init();

	game.map.init();

	game.renderScene.init();

	game.renderScene.render();



	// var roofGradient=game.context.createLinearGradient(0,0,0,100);
	// roofGradient.addColorStop(0,"#a73767");
	// roofGradient.addColorStop(1,"#000000");
	// game.context.fillStyle=roofGradient;
	// game.context.fillRect(0,0,800,100);

	// var floorGradient=game.context.createLinearGradient(0,300,0,500);
	// floorGradient.addColorStop(0,"#000000");
	// floorGradient.addColorStop(1,"#676767");
	// game.context.fillStyle=floorGradient;
	// game.context.fillRect(0,300,800,200);

	// game.context.fillStyle = '#98bb98';
	// game.context.beginPath();
	// game.context.moveTo(0, 0);
	// game.context.lineTo(40,15);
	// game.context.lineTo(40, 460);
	// game.context.lineTo(0, 500);
	// game.context.closePath();
	// game.context.fill();

	// game.context.fillStyle = '#88ab88';
	// game.context.beginPath();
	// game.context.moveTo(40, 15);
	// game.context.lineTo(200, 80);
	// game.context.lineTo(200, 310);
	// game.context.lineTo(40, 460);
	// game.context.closePath();
	// game.context.fill();

	// game.context.fillStyle = '#789b78';
	// game.context.beginPath();
	// game.context.moveTo(200, 80);
	// game.context.lineTo(240, 95);
	// game.context.lineTo(240, 270);
	// game.context.lineTo(200, 310);
	// game.context.closePath();
	// game.context.fill();	

}