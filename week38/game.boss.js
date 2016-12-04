game.boss = {
    init: function() {
        this.img = document.getElementById("boss");
        this.shakeCount = 0;
        this.entering = false;
        this.active = false;
        this.x = 650;
        this.y = 170;
        this.phase = 0;
        this.dirY = -1;
        this.health = {
            top: 100,
            bottom: 100,
            main: 100
        }

    },
    start: function() {
        this.entering = true;
        this.active = false;
        this.electricalDefence = new game.enemies.electrical(650, 203, 60, game.enemies.electricalImg, false, true)
        game.enemies.add(this.electricalDefence);
        game.sounds[1].play();
    },
    draw: function() {

        if(this.entering) {
            game.context.drawImage(this.img, this.x, this.y);
            this.x-=0.5;
            this.electricalDefence.x-= 0.5

            if(this.x === 510) {
                
            }

            if(this.x <= 500) {
                this.active = true;
                this.top = {
                    x: this.x,
                    y: this.y,
                    width: 32,
                    height: 32
                };
                
                game.sounds[2].play();
                game.sounds[1].fade(1,0,1000)

            }
        } else if(this.active) {
            this.phase++;

            game.context.drawImage(this.img, this.x, this.y);

            if(this.phase % 25 === 0) {
		        var vy = -1 + 2*Math.random();
                var vx = 1+Math.random()*1;
                game.shots.addEnemy(new game.shots.shot(this.x, this.y+110, function() { return -vx; }, function() { return vy; }, game.shots.shot2Img))
            }

            if(this.phase % 45 === 0) {
		        var vy = -1 + 2*Math.random();
                var vx = 1+Math.random()*1;
                game.shots.addEnemy(new game.shots.shot(this.x, this.y+14, function() { return -vx; }, function() { return vy; }, game.shots.shot2Img))
            }

            if(this.phase === 250) {
                game.enemies.add(new game.enemies.electrical(700, 0, 160, game.enemies.electricalImg, false))
            }

            if(this.phase === 500) {
                game.enemies.add(new game.enemies.electrical(700, 480-160, 160, game.enemies.electricalImg, false))
            }

            if(this.phase === 750) {
                game.enemies.add(new game.enemies.electrical(700, 160, 160, game.enemies.electricalImg, false))
                game.enemies.add(new game.enemies.enemy02(700, 200, 180))	
			    game.enemies.add(new game.enemies.enemy02(700, 280, 0))	
            }

            if(this.phase > 1000) {
                this.phase = 0;
            }

            if(this.phase % 360 === 0) {
                console.log("changing dir")
                this.dirY = this.dirY*-1;
            }

            var dy = this.dirY*0.7*Math.sin(this.phase*Math.PI/180);
            this.y += dy;
            this.electricalDefence.y += dy;
            this.top.y += dy;
        }



    },
    handleShot: function(s) {
        if(game.collides(s, this.top)) {
            s.remove = true;
            console.log("collides")
        }
    }
}