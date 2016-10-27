game.level = {
	update: function() {

		if(game.pos === 10) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 40) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 70) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 300) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 330) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 360) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 460) {
			game.enemies.add(new game.enemies.enemy01(700, 240))
		}

		if(game.pos === 600) {
			game.enemies.add(new game.enemies.enemy04(-50, 300))
		} 

		if(game.pos === 630) {
			game.enemies.add(new game.enemies.enemy04(-50, 330))
		} 

		if(game.pos === 660) {
			game.enemies.add(new game.enemies.enemy04(-50, 350))
		}

		if(game.pos === 810) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 840) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 870) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 1100) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 1130) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 1160) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === 1260) {
			game.enemies.add(new game.enemies.enemy01(700, 240))
		}

		if(game.pos === 1200) {
			game.enemies.add(new game.enemies.enemy04(-50, 300))
		} 

		if(game.pos === 1230) {
			game.enemies.add(new game.enemies.enemy04(-50, 330))
		} 

		if(game.pos === 1260) {
			game.enemies.add(new game.enemies.enemy04(-50, 350))
		}

		if(game.pos === 1450) {
			game.enemies.add(new game.enemies.enemy05(700, 120))
		} 

		if(game.pos === 1450) {
			game.enemies.add(new game.enemies.enemy05(700, 220))
		} 


		this.electricalPattern01(1800);
		
	},

	electricalPattern01: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.electrical(700, 176, 128, game.enemies.electricalImg, false))
		} 

		if(game.pos === s+70) {
			game.enemies.add(new game.enemies.electrical(700, 0, 160, game.enemies.electricalImg, false))
			game.enemies.add(new game.enemies.electrical(700, 160, 160, game.enemies.electrical2Img, true))
			game.enemies.add(new game.enemies.electrical(700, 320, 460, game.enemies.electricalImg, false))
		} 

		if(game.pos === s+200) {
			game.enemies.add(new game.enemies.electrical(700, 0, 416, game.enemies.electricalImg, false))
		} 

		if(game.pos === s+330) {
			game.enemies.add(new game.enemies.electrical(700, 64, 416, game.enemies.electricalImg, false))
		} 

		if(game.pos === s+460) {
			game.enemies.add(new game.enemies.electrical(700, 0, 416, game.enemies.electricalImg, false))
		} 
	}
}