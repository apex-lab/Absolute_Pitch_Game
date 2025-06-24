import Phaser from 'phaser';

export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet'); // default texture
        scene.physics.add.existing(this);
        this.scene = scene;
        this.setOrigin(0.5, 0.5);
        this.type = 'type1'; // default type
        this.setScale(3.5);
    }

    fire(x, y, angle, type = 'type1') {
        this.type = type;
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.rotation = angle - Math.PI;

        if (type === 'type1') {
            this.setTexture('bullet');
            this.setScale(3.5);
        } else if (type === 'type2') {
            this.setTexture('capture');
            this.setScale(1.0);
            this.expand();
        }

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
        if (
            this.x < 0 || this.x > this.scene.scale.width ||
            this.y < 0 || this.y > this.scene.scale.height
        ) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}
