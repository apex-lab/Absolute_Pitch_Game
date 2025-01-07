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
        let title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Absolute Pitch', {fontSize: '50px', fill: '#fff'});
        title.setOrigin(0.5,0.5);
        title.y= 400;
        var new_game = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'New Game', {fontSize: '30px', fill: '#fff'}); 
        new_game.setOrigin(0.5,0.5)
        new_game.y = 600;
        new_game.setInteractive(); 
        new_game.on('pointerdown', () => newGameForm()); 
    
        var continue_game = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Continue', {fontSize: '30px', fill: '#fff'}); 
        continue_game.setOrigin(0.5, 0.5);
        continue_game.y = 700;
        continue_game.setInteractive(); 
        continue_game.on('pointerdown',() => continueGame()); 
        
        const scene = this;
        
        function newGameForm() {
            new_game.destroy();
            continue_game.destroy();
            const form = document.createElement("form");
            form.innerHTML = `
                <h2>Create Account</h2>
                <label for="new-username">Username:</label>
                <input type="text" id="new-username" name="username"><br><br>
                
                <label for="new-password">Password:</label>
                <input type="password" id="new-password" name="password"><br><br>
                
                <button type="submit">Create Account</button>
                <button type="button" id="back-button">Back</button> <!-- Back button -->
            `;

                form.style.position = 'absolute';
                form.style.top = '50%';
                form.style.left = '50%';
                form.style.transform = 'translate(-50%, -50%)';
                form.style.color = '#ffff';
                form.style.fontFamily ='Courier';
                form.style.fontSize = "25px";
            document.body.appendChild(form);
        
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const username = document.getElementById('new-username').value;
                const password = document.getElementById('new-password').value;
                
                // TODO: Add logic to save the new account information
                console.log(`Creating account for ${username}`);
           
                // Remove form and start game
                document.body.removeChild(form);
                scene.scene.start('InstructionScene'); 
            });
            

            document.getElementById('back-button').addEventListener('click', () => {
                document.body.removeChild(form);
                scene.scene.restart(); 
            });
   
        }
        
 
        function  continueGame() { 
            new_game.destroy();
            continue_game.destroy();
            const form = document.createElement("form");
            form.innerHTML = `
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"><br><br>
                <label style = 'background-color: rgba('0,0,0,0.5'); color: #fffff for="password">Password:</label>
                <input type="password" id="password" name="password"><br><br>
                <button type="submit" style="display: block; margin: 0 auto; padding: 10px 20px; font-size: 16px; background-color: #333; color: #ffffff; border: none; border-radius: 5px; cursor: pointer;">Login</button>
               <button type="button" id="back-button">Back</button> <!-- Back button -->
               `;

                form.style.position = 'absolute';
                form.style.top = '50%';
                form.style.left = '50%';
                form.style.transform = 'translate(-50%, -50%)';
                form.style.color = '#ffff';
                form.style.fontFamily ='Courier';
                form.style.fontSize = "30px";
            
                document.body.appendChild(form);

                form.addEventListener('submit', (event) => {
                    event.preventDefault(); // Prevent the default form submission
                
                    // Placeholder for user verification needs to be replaced with an API call
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                
                    // Dummy verification logic
                    if (username === 'user' && password === 'pass') {
                        document.body.removeChild(form);

                    } else {
                        alert('Invalid credentials. Please try again.');
                    }
                });
                document.getElementById('back-button').addEventListener('click', () => {
                    document.body.removeChild(form);
                    scene.scene.restart(); 
                });
        }
    }
}