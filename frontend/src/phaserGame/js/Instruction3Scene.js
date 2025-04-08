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
           "Congratulations! You have completed the second phase",
            "You will now begin Phase 3. \n\n",
            "This phase will consist of aliens from the previous 2 phases \n\n The aliens will appear from their respective ports of prior phases \n\n",
            "Depedning on which phase the alien appeared in you will shoot with either the W or E key",
            "Remember, the faster that you shoot the alien the more points you will get \n\n ",
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
                    this.scene.start('Level11Scene');
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
            this.scene.start('Level11Scene');
        });
    }
}