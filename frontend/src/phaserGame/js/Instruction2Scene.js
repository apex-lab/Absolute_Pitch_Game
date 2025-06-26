import Phaser from 'phaser';

export default class Instruction2Scene extends Phaser.Scene {
    constructor() {
        super ({ key: 'Instruction2Scene' });
    }

    preload() {
        this.load.image('space', 'assets/space.png');
    }

    create() {
        console.log('Instructions');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0, 0);
        
        const instructions = [
           "Congratulations! You have completed Phase 1. \n\n",
            "You will now begin Phase 2. \n\n",
            "This phase will consist of a new set of aliens \n\n Each alien will appear from the same screen location (or 'port') as an  alien from the previous phase.\n\n",
            "Controls \n \n Use the Left and Right arrow keys to ratate the ship. \n\n Press the E key to shoot.",
            "Aliens will attack if not defeated in time.",
            "Good luck!",
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