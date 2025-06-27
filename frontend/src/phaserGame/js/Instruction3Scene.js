import Phaser from 'phaser';

export default class Instruction3Scene extends Phaser.Scene {
    constructor() {
        super ({ key: 'Instruction3Scene' });
    }

    preload() {
        this.load.image('space', 'assets/space.png');
    }

    create() {
        console.log('Instructions');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0, 0);
        
        const instructions = [
           "Congratulations! You have completed Phase 2. \n\n",
            "Welcome to Phase 3. \n\n",
            "In this phase, you will face all alien types previously encountered in Phases 1 and 2. \n\n Each alien will continue to emerge from its designated port as before. \n\n",
            "Use the correct key — W or E — to fire the corresponding bullet and eliminate the aliens before they attack.\n\n",
            "Correct key = successful hit.\n\n Incorrect key = penalty of -10 points. \n\n ",
            "If an alien is not eliminated in time, it will attack. You must reach the required point threshold to complete the level. \n\n Failing to meet this target will result in a level restart. \n\n",
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
        const changeInterval = 6000;

        this.time.addEvent({
            delay: changeInterval,
            callback: () => {
                currentIndex++;
                if (currentIndex < instructions.length) {
                    instructionText.setText(instructions[currentIndex]);
                } else {
                    this.scene.start('Level11Scene');
                }
            },
            loop: true
        });
    }
}