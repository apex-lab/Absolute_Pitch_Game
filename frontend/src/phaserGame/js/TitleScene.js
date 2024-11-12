import Phaser from 'phaser';

//This module constructs the title screen for the game
export default class TitleScene extends Phaser.Scene{
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        console.log("Preloading image");
        this.load.image('space', '/assets/space.png');
    }

    create() {
        //initializing title background
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0, 0);
        
        let startText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Start Game', { fontSize: '32px', fill: '#fff' });
        startText.setOrigin(0.5, 0.5);
        startText.setInteractive();
        startText.on('pointerdown', () => {
            this.scene.start('InstructionScene');
        });
        
    }
}