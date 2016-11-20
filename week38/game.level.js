game.level = {
	update: function() {

		// if(game.pos === 100) {
		// 	game.boss.start();
		// }

		if(game.pos < 3400) {
			game.pos = 3400
		}
		
		

		this.enemy03Pattern01(10);

		this.enemy03Pattern01Shoot(300);

		if(game.pos === 460) {
			game.enemies.add(new game.enemies.enemy01(700, 240))
		}

		this.enemy04Pattern01(600);

		this.enemy03Pattern01(810);


		this.enemy03Pattern01Shoot(1100);


		if(game.pos === 1260) {
			game.enemies.add(new game.enemies.enemy01(700, 240))
		}

		this.enemy04Pattern01(1200);

		if(game.pos === 1450) {
			game.enemies.add(new game.enemies.enemy05(700, 120))
			game.enemies.add(new game.enemies.enemy05(700, 220))
		} 

		this.enemy04Pattern01(1500);

		this.enemy03Pattern01(1500);

		if(game.pos === 1600) {
			game.enemies.add(new game.enemies.enemy05(700, 120))
			game.enemies.add(new game.enemies.enemy05(700, 220))
		} 

		this.enemy04Pattern01(1700);

		this.enemy03Pattern01(1700);		

		this.electricalPattern02(1800);

		this.electricalPattern02(2000);

		this.electricalPattern02(2100);

		this.electricalPattern03(2400)

		this.electricalPattern01(3000)

		this.enemy03Pattern01Shoot(3500);

		this.enemy04Pattern01(3500);

		if(game.pos === 3700) {
			game.enemies.add(new game.enemies.enemy01(700, 10+92*0))
			game.enemies.add(new game.enemies.enemy01(710, 10+92*1))
			game.enemies.add(new game.enemies.enemy01(720, 10+92*2))
			game.enemies.add(new game.enemies.enemy01(730, 10+92*3))
			game.enemies.add(new game.enemies.enemy01(740, 10+92*4))
		}

		this.enemy03Pattern01Shoot(3900);

		this.enemy04Pattern01(3900);

		if(game.pos === 4100) {
			game.enemies.add(new game.enemies.enemy01(700, 10+92*0))
			game.enemies.add(new game.enemies.enemy01(710, 10+92*1))
			game.enemies.add(new game.enemies.enemy01(720, 10+92*2))
			game.enemies.add(new game.enemies.enemy01(730, 10+92*3))
			game.enemies.add(new game.enemies.enemy01(740, 10+92*4))
		}

		


		
	},

	enemy02pattern01: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.enemy02(700, 200, 180))	
			game.enemies.add(new game.enemies.enemy02(700, 280, 0))	
		}		
	},

	enemy03Pattern01: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === s+30) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 

		if(game.pos === s+60) {
			game.enemies.add(new game.enemies.enemy03(700, 100))
		} 
	},


	enemy03Pattern01Shoot: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.enemy03(700, 100, true))
		} 

		if(game.pos === s+30) {
			game.enemies.add(new game.enemies.enemy03(700, 100, true))
		} 

		if(game.pos === s+60) {
			game.enemies.add(new game.enemies.enemy03(700, 100, true))
		} 
	},	

	enemy04Pattern01: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.enemy04(-50, 300))
		} 

		if(game.pos === s+30) {
			game.enemies.add(new game.enemies.enemy04(-50, 330))
		} 

		if(game.pos === s+60) {
			game.enemies.add(new game.enemies.enemy04(-50, 350))
		}
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
	},

	electricalPattern03: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.electrical(700, 176, 128, game.enemies.electricalImg, false))
		} 

		if(game.pos === s+70) {
			game.enemies.add(new game.enemies.electrical(700, 0, 160, game.enemies.electricalImg, false))
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
	},

	electricalPattern02: function(s) {
		if(game.pos === s) {
			game.enemies.add(new game.enemies.electrical(700, 176, 128, game.enemies.electricalImg, false))
		}

		if(game.pos === s+70) {
			game.enemies.add(new game.enemies.electrical(700, 0, 128, game.enemies.electricalImg, false))
		}

		if(game.pos === s+140) {
			game.enemies.add(new game.enemies.electrical(700, 352, 128, game.enemies.electricalImg, false))
		}
	}
}