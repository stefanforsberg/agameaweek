game.status = {
    init: function() {
        this.xp = 0;
        this.next = [100,200,400,800];
        this.level = 0;       
        game.context.font = "8px 'Press Start 2P'" 
    },
    draw: function() {
        game.context.save();
        game.context.fillStyle = "rgba(255,255,255,0.8)"
        game.context.fillText("Exp: " + this.xp,10,10);
        game.context.fillText("Next: " + this.next[this.level],120,10);
        game.context.restore();
    },
    addXp: function(xp) {
        this.xp += xp;

        if(this.xp > this.next[this.level]) {
            if(this.level < (this.next.length-1)) {
                this.level++;
                game.sounds[0].play("powerup");
                game.player.upgradeWeapon();
            }
            
        }
    }
}