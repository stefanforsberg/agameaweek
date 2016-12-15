game.boss = {
    init: function() {
        this.img = document.getElementById("boss");
        this.damagedEyeImg = document.getElementById("bossDamagedEye");
        this.shakeCount = 0;
        this.entering = false;
        this.active = false;
        this.x = 650;
        this.y = 170;
        this.phase = 0;
        this.dirY = -1;
        this.level = 0;
        this.totalHealth = 3;
        this.dying = 0;

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
            this.x-=1;
            this.electricalDefence.x-= 1

            if(this.x === 510) {
                
            }

            if(this.x <= 500) {
                this.active = true;
                this.top = new game.boss.eye(this.x, this.y, 10);
                this.bottom = new game.boss.eye(this.x, this.y+96, 10);
                this.body = {
                    x: this.x+48,
                    y: this.y+13,
                    width: 76,
                    height: 102, 
                };
                this.main = {
                    x: this.x+48,
                    y: this.y+32,
                    width: 3,
                    height: 64, 
                    health: 25,
                    hitAnimation: 0
                }
                
                game.sounds[2].play();
                game.sounds[1].fade(1,0,1000)

            }
        } else if(this.active) {
            this.phase++;

            game.context.save();
            game.context.strokeStyle = "rgba(255,255,255,0.7)";
            game.context.fillStyle = "rgba(255,255,255,0.3)";
            game.context.strokeRect(20,20,600,20)
            game.context.fillRect(21,21,6*this.totalHealth-2,18)
            game.context.restore();

            game.context.drawImage(this.img, this.x, this.y);

            this.top.draw();
            this.bottom.draw();

            if(this.main.hitAnimation > 0) {
                game.context.save();
                game.context.fillStyle = "rgba(255,255,255,"  + (this.main.hitAnimation/100) + ")";
                game.context.fillRect(this.main.x, this.main.y-14, 10, this.main.height+28);
                game.context.restore();
                this.main.hitAnimation-=10;
            }

            if(this.level === 0) {
                if(this.phase % 99 === 0) {
                    var vy = -1 + 2*Math.random();
                    var vx = 1+Math.random()*1;
                    game.shots.addEnemy(new game.shots.shot(this.x, this.y+110, function() { return -vx; }, function() { return vy; }, game.shots.shot2Img))
                }

                if(this.phase % 97 === 0) {
                    var vy = -1 + 2*Math.random();
                    var vx = 1+Math.random()*1;
                    game.shots.addEnemy(new game.shots.shot(this.x, this.y+14, function() { return -vx; }, function() { return vy; }, game.shots.shot2Img))
                }
            } else if(this.level === 1) {
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
            } else if(this.level === 2) {
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
            }            


            if(this.phase > 1000) {
                this.phase = 0;
            }

            if(this.phase % 360 === 0) {
                this.dirY = this.dirY*-1;
            }

            var dy = this.dirY*0.7*Math.sin(this.phase*Math.PI/180);
            this.y += dy;
            this.electricalDefence.y += dy;
            this.top.y += dy;
            this.bottom.y += dy;
            this.main.y += dy;
            this.body.y+=dy;

            if(game.collides(game.player, {x: this.x, y: this.y, width: 128, height: 128})) {
                this.electricalDefence.remove = true;
                game.player.death();
            }
        }



    },
    handleShot: function(s) {

        var shotHit = false;

        if(game.collides(s, this.body)) {
            s.remove = true;
        }

        if(game.collides(s, this.top)) {
            
            s.remove = true;
            if(this.top.hit()) {
                shotHit = true;
            }
        }

        if(game.collides(s, this.bottom)) {
            s.remove = true;
            if(this.bottom.hit()) {
                shotHit = true;
            }
        }

        if(game.collides(s, this.main)) {
            shotHit = true;
            this.main.hitAnimation = 100;
            
            if(this.level === 0) {
                this.totalHealth--;
            } else if(this.level === 1) {
                this.totalHealth-= 0.5;
            } else if(this.level === 2) {
                this.totalHealth-= 0.5;
            }
            
            this.main.health-= 1;
            
            if(this.totalHealth <= 0 && !this.dying) {


                var x = this.x;
                var y = this.y

                window.setTimeout(function() {
                    game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                    game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                    game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                    game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                    game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                     window.setTimeout(function() {
                        game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                        game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                        game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                        game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                        game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                        window.setTimeout(function() {
                            game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                            game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                            game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                            game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                            game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                            window.setTimeout(function() {
                                game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                                game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                                game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                                game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);
                                game.explosions.add(x+Math.random()*128, y+Math.random()*128, 40);

                                game.texts = [];
                                game.texts.push(new text(110,200,46, 8, "WELL DONE", "40px 'Press Start 2P'", "rgba(255,255,255,0.8)"));
                                game.texts.push(new text(80,300,18, 2, "Press any key to try again", "14px 'Press Start 2P'", "rgba(255,255,255,0.8)"));
                                this.dying = true;
                                game.dying = true;
                                game.explosions.add(this.x+Math.random()*128, this.y+Math.random()*128, 40);

                            }, 60);
                        }, 60);
                     }, 60);
                }, 60)
            }

            if(this.main.health <= 0) {
                if(this.level === 0) {
                    this.top.health = 20;
                    this.bottom.health = 20;
                    this.electricalDefence = new game.enemies.electrical(500, this.y+32, 60, game.enemies.electricalImg, false, true)
                    game.enemies.add(this.electricalDefence);
                    this.main.health = 50;
                    this.level++;
                } else if(this.level === 1) {
                    this.top.health = 30;
                    this.bottom.health = 30;
                    this.electricalDefence = new game.enemies.electrical(500, this.y+32, 60, game.enemies.electricalImg, false, true)
                    game.enemies.add(this.electricalDefence);
                    this.main.health = 100;
                    this.level++;
                } 

            }
            s.remove = true;
        }

        if(this.top.dead() && this.bottom.dead() && this.electricalDefence) {
            this.electricalDefence.remove = true;
        }

        return shotHit;
    }
}

game.boss.eye = function(x,y, health) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.health = health;
    this.hitAnimation = 0;
    return this;
}

game.boss.eye.prototype.draw = function() {

    if(this.health <= 0) {
        game.context.drawImage(game.boss.damagedEyeImg, this.x, this.y);
    }

    if(this.hitAnimation > 0) {
        game.context.save();
        game.context.fillStyle = "rgba(255,255,255,"  + (this.hitAnimation/100) + ")";
        game.context.beginPath();
        game.context.arc(this.x+16,this.y+16,16,0,2*Math.PI);
        game.context.fill();
        game.context.restore();
        this.hitAnimation-=10;
    }
}

game.boss.eye.prototype.hit = function() {
    if(this.health > 0) {
        this.health--;
        this.hitAnimation = 100;
        return true;
    }

    return false;
}

game.boss.eye.prototype.dead = function() {
    return this.health <= 0;
}