import Phaser from 'phaser';

export default class Capture extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'capture'); // Replace 'net' with the appropriate texture key
        scene.physics.add.existing(this);
        this.scene = scene;
        this.setOrigin(0.5, 0.5);
        this.type = 'type2';
    }

    fire(x, y,angle) {
        this.setActive(true);
        this.body.reset(x,y);
        this.setVisible(true);
        this.setVelocity(0, 0);
        this.rotation = angle - Math.PI; 
        this.scene.physics.velocityFromRotation(angle, 1500, this.body.velocity);
    }

    expand() {
        this.scene.tweens.add({
            targets: this,
            scaleX: 2,
            scaleY: 2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.x < 0 || this.x > this.scene.scale.width || this.y < 0 || this.y > this.scene.scale.height) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}