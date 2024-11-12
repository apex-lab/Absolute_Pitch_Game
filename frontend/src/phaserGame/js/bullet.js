import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite { 
    constructor(scene,x, y, scale = 3.5) { 
        super (scene, x , y, 'bullet'); 
        this.setScale(scale)
        scene.physics.add.existing(this);
        this.setOrigin(0.5,0.5);
    }

    fire(x,y,angle, scale = 3.5) { 
        this.setScale(scale);
        this.body.reset(x,y); 
        this.setActive(true);
        this.setVisible(true); 
        this.rotation = angle - Math.PI; 
        this.scene.physics.velocityFromRotation(angle, 1500, this.body.velocity);
    }

    preUpdate(time,delta){ 
        super.preUpdate(time,delta); 
        if (this.x < 0 || this.x > this.scene.sys.canvas.width ||this.y <  0 || this.y > this.scene.sys.canvas.height) { 
            this.setActive(false); 
            this.setVisible(false); 
        }
    }
}