import Phaser from 'phaser';
import axios from 'axios';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        this.load.image('space', '/assets/space.png');
    }

    create() {
        const scene = this;

        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0, 0);

        let title = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Absolute Pitch', { fontSize: '50px', fill: '#fff' });
        title.setOrigin(0.5, 0.5);
        title.y = 400;

        let new_game = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'New Game', { fontSize: '30px', fill: '#fff' });
        new_game.setOrigin(0.5, 0.5);
        new_game.y = 600;
        new_game.setInteractive();
        new_game.on('pointerdown', () => newGameForm());

        let continue_game = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Continue', { fontSize: '30px', fill: '#fff' });
        continue_game.setOrigin(0.5, 0.5);
        continue_game.y = 700;
        continue_game.setInteractive();
        continue_game.on('pointerdown', () => continueGame());

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

                <label for="confirm-password">Confirm Password:</label>
                <input type="password" id="confirm-password" name="confirm-password"><br><br>
                
                <button type="submit">Create Account</button>
                <button type="button" id="back-button">Back</button>
            `;

            Object.assign(form.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fff',
                fontFamily: 'Courier',
                fontSize: '25px'
            });

            document.body.appendChild(form);

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const name = document.getElementById('new-username').value;
                const password = document.getElementById('new-password').value;
                const password2 = document.getElementById('confirm-password').value;

                if (!name || !password || !password2 || password !== password2) {
                    alert('Please make sure all fields are filled and passwords match.');
                    return;
                }

                try {
                    const response = await axios.post('http://localhost:3000/api/users/register', {
                        name,
                        password,
                        password2
                    });

                    console.log('Registration Success:', response.data);
                    document.body.removeChild(form);
                    scene.scene.start('InstructionScene');

                } catch (error) {
                    console.error('Registration Error:', error.response?.data || error.message);
                    alert(`Error: ${error.response?.data?.message || 'Account creation failed'}`);
                }
            });

            document.getElementById('back-button').addEventListener('click', () => {
                document.body.removeChild(form);
                scene.scene.restart();
            });
        }

        function continueGame() {
            new_game.destroy();
            continue_game.destroy();

            const form = document.createElement("form");
            form.innerHTML = `
                <label for="username">Username:</label>
                <input type="text" id="username" name="username"><br><br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password"><br><br>
                <button type="submit">Login</button>
                <button type="button" id="back-button">Back</button>
            `;

            Object.assign(form.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fff',
                fontFamily: 'Courier',
                fontSize: '25px'
            });

            document.body.appendChild(form);

            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const name = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                if (!name || !password) {
                    alert('Both fields are required.');
                    return;
                }

                try {
                    const response = await axios.post('http://localhost:3000/api/users/login', {
                        name,
                        password
                    });

                    console.log('Login Success:', response.data);
                    localStorage.setItem('token', response.data.token);

                    document.body.removeChild(form);
                    const savedScene = 'InstructionScene';
                    scene.scene.start(savedScene);
                } catch (error) {
                    console.error('Login Error:', error.response?.data || error.message);
                    alert(`Login failed: ${error.response?.data?.message || 'Invalid credentials'}`);
                    document.body.appendChild(form);
                }
            });

            document.getElementById('back-button').addEventListener('click', () => {
                document.body.removeChild(form);
                scene.scene.restart();
            });
        }
    }
}
