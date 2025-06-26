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
            "Thank you for participating in our experiment",
            "You will now begin Phase 1. \n\n " ,
            "Controls \n \n Use the Left and Right arrow keys to ratate the ship. \n\n Press the W key to shoot.",
            "Aliens will appear from various positions (ports) on the screen \n\n and each alien is associated with a unique note. \n\n","Before the alein comes on screen a sequence of octaves based on that note will play as an audio cue \n\n",
            "If not destroyed in time, the alien will attack. \n\n",
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
    }
}