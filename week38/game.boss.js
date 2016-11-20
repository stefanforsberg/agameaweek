game.boss = {
    init: function() {
        this.img = document.getElementById("boss");
        this.shakeCount = 0;
        this.entering = false;
        this.active = false;
        this.x = 650;
        this.y = 170;
    },
    start: function() {
        this.entering = true;
        this.active = false;
    },
    draw: function() {

        if(this.entering) {
            game.context.drawImage(this.img, this.x, this.y);
            this.x-=0.5;

            if(this.x <= 500) {
                this.active = true;
            }
        } else if(this.active) {
            game.context.drawImage(this.img, this.x, this.y);
        }



    }
}