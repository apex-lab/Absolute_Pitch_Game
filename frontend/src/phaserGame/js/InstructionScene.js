import Phaser from 'phaser';

export default class InstructionScene extends Phaser.Scene {
    constructor() {
        super ({ key: 'InstructionScene' });
    }

    preload() {
        this.load.image('space', 'assets/space.png');
    }

    create() {
        console.log('Instructions');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0, 0);
        
        const instructions = [
            "Welcome to Phase 1. \n\n Use your mouse to rotate the ship. \n\n To shoot press the W key.",
            "The aliens will come from different ports on the screen \n\n and each alien corresponds to a unique note. \n\n Before the alein comes on screen a sequence of octaves consisting of \n\n the same note will play.",
            "The faster that you shoot the alien the more points you will get \n\n ",
            "Aliens will attack if not defeated in time.",
            "Good luck!"
        ];
        let instructionText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, instructions[0], {
            fontSize: '24px',
            fill: '#fff',
            align: 'center', 
            wordWrap: { width: this.cameras.main.width - 40}
        });
        instructionText.setOrigin(0.5, 0.5);

        let currentIndex = 0;
        const changeInterval = 5000;

        this.time.addEvent({
            delay: changeInterval,
            callback: () => {
                currentIndex++;
                if (currentIndex < instructions.length) {
                    instructionText.setText(instructions[currentIndex]);
                } else {
                    this.scene.start('Level1Scene');
                }
            },
            loop: true
        });
        let skipButton = this.add.text(this.cameras.main.width - 20, this.cameras.main.height - 20, 'Skip', {
            fontSize: '20px',
            fill: '#fff',
            backgroundColor: '#000'
        });
        skipButton.setOrigin(1, 1);
        skipButton.setInteractive();
        skipButton.on('pointerdown', () => {
            this.scene.start('Level1Scene');
        });
    }
}