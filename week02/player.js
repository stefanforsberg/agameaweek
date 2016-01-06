var game = game || {};

game.player = {
	x: 320,
	y: 240,
	w: 16,
	h: 16,
	vx: 0,
	vy: 0,
	subscriptions: [],
	baseCanvas: {},
	direction: 0,
	draw: function() {
		game.context.drawImage(this.baseCanvas,this.x, this.y);
	},
	death: function() {
		game.sources.gameEnded.onNext(true);
		game.sounds.explode.play();
	},
	dispose: function() {
		subscriptions.forEach(function (s) {
			s.dispose();
		})
	},
	init: function() {

		this.subscriptions = [];
		this.x = 320;
		this.y = 240;
		this.w = 16;
		this.h = 16;
		this.vx = 0;
		this.vy = 0;

		this.baseCanvas = document.createElement("canvas");
		this.baseCanvas.style.cssText = "width: 16px; height:16px;display:none;";

		document.body.appendChild(this.baseCanvas);

		var baseContext = this.baseCanvas.getContext("2d");
		this.baseCanvas.style.cssText = "width: 16px; height:16px;display:none;";

		baseContext.beginPath();
		baseContext.fillStyle = "#78C5D6";
		baseContext.fillRect(0,0,16,2);
		baseContext.fillStyle = "#459BA8";
		baseContext.fillRect(0,2,16,2);
	    baseContext.fillStyle = "#79C267";
		baseContext.fillRect(0,4,16,2);
		baseContext.fillStyle = "#C5D647";
		baseContext.fillRect(0,6,16,2);
		baseContext.fillStyle = "#F5D63D";
		baseContext.fillRect(0,8,16,2);
		baseContext.fillStyle = "#F28C33";
		baseContext.fillRect(0,10,16,2);
		baseContext.fillStyle = "#E868A2";
		baseContext.fillRect(0,12,16,2);
		baseContext.fillStyle = "#BF62A6";
		baseContext.fillRect(0,14,16,2);

		this.subscriptions.push(game.sources.keyDown.scan(function (p, k) {

			if(k.keyCode === 68) {
				p.direction = 1;
			} else if(k.keyCode === 65) {
				p.direction = -1;
			}else if(k.keyCode === 87) {
				p.vy =-8
			}

			return p;
		}, this).subscribe());

		this.subscriptions.push(game.sources.keyUp.scan(function (p, k) {

			if(k.keyCode === 68) {
				p.direction = 0;
			} else if(k.keyCode === 65) {
				p.direction = 0;
			}

			return p;
		}, this).subscribe());	

		this.subscriptions.push(game.sources.tick.scan(function (p, t)	{

			p.vy += 0.5;

			if(Math.abs(p.vx) < 2) {
				p.vx += p.direction * 0.1;	
			}
			

			if(p.vx > 0) {
				p.vx -= 0.01;
			} else if(p.vx < 0) {
				p.vx += 0.01;
			}

			if(p.vy > (0.5*4)) {
				p.vy = 0.5*4;
			}

			p.y += p.vy;
			p.x += p.vx

			if(p.y < -10 || p.x < -10 || (p.x > game.settings.width) || (p.y > game.settings.height)) {
				p.death();
			}

			return p;
		}, this).subscribe());
	}
}

