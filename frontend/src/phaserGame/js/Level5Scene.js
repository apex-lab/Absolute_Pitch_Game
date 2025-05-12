import Phaser from 'phaser';
import axios from 'axios';
import { preloadAssets } from './Preload.js';
import { createAssets } from './create.js';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'
import ScoreManager from './ScoreTracker'

export default class Level5Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level5Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0;
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.canSnare = false; 
        this.canShoot = true; 
        this.speed = 300
        this.levelUpThreshold = 660
    }
    preload() {
        preloadAssets(this);
    }
    create() {
        this.levelStarted = false;

        this.load.image('space', 'assets/space.png');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0,0)

        const levelText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Level 5',
            {
                fontSize: '48px',
                fill: '#ffffff',
            }
        ).setOrigin(0.5);

        // After a delay, destroy the text and start the level
        this.time.delayedCall(2000, () => {
            levelText.destroy();
            this.startLevel(); 
        });
    }

    startLevel() {
        this.levelStarted = true;
        createAssets(this);

    }
    update(time,delta) {
        if (!this.levelStarted) return; 
        updateAssets(this,time, delta)
    }
    playerHit(bullet, player) {
        playerHit(this, bullet, player)
    }
    CaptureEnemy(capture, bullet, enemy) {
        captureEnemy(this, capture,bullet,enemy);
    }
    enemyShoot(enemy) {
        enemyShoot(this,enemy)
    }
    onEvent() {
        this.checkForNextLevel(); // Check if conditions to move to the next level are met
        
        let side = Phaser.Math.Between(1, 6);
        let new_side;
        do { 
            new_side = Phaser.Math.Between(1,6); 
        } while (new_side === side); 
        side = new_side; 

        switch (side) {
            case 1:
                this.spawnEnemy(this.LightBlueEnemy, 100, this.ShootDelay);
                break;
            case 2: 
                this.spawnEnemy(this.OrangeEnemy, 100, this.ShootDelay);
                break;
            case 3: 
                this.spawnEnemy(this.BlueEnemy, 100, this.ShootDelay);
                break;
            case 4: 
                this.spawnEnemy(this.YellowEnemy, 100, this.ShootDelay);
                break;
            case 5:
                this.spawnEnemy(this.GreenEnemy,100 , this.ShootDelay);
                break;
            case 6:
                this.spawnEnemy(this.PurpleEnemy, 100, this.ShootDelay); 
                break;
            default:
                console.log("Unexpected side value:", side);
                break;
        }
        this.enemyCount++;
    }

    spawnEnemy(enemy, speed, shootDelay) {
        const randIndex = Phaser.Math.Between(0, 6);
        //Adding unique chromatic scale to each enemy
        switch(enemy.texture.key){
            case 'LightBlueEnemy':
                console.log("Playing sound:", this.LightBlueEnemySounds[randIndex].key);
                this.LightBlueEnemySounds[randIndex].play();
                break;
            case 'OrangeEnemy':
                console.log("Playing sound:", this.OrangeEnemySounds[randIndex].key);
                this.OrangeEnemySounds[randIndex].play();
                break;
            case 'blue-enemy': 
                console.log("Playing sound:", this.BlueEnemySounds[randIndex].key);
                this.BlueEnemySounds[randIndex].play();
                break;
            case 'YellowEnemy':
                console.log("Playing sound:", this.YellowEnemySounds[randIndex].key);
                this.YellowEnemySounds[randIndex].play();
                break;
            case 'green-enemy':
                console.log("Playing sound:", this.GreenEnemySounds[randIndex].key);
                this.GreenEnemySounds[randIndex].play();
                break;
            case 'PurpleEnemy':
                console.log("Playing sound:", this.PurpleEnemySounds[randIndex].key);
                this.PurpleEnemySounds[randIndex].play();
                break;
            default: 
                console.log("Unexpected enemy value")
                break;
        }
        spawnEnemy (this,enemy,this.speed,shootDelay);
    }

    async checkForNextLevel () {
        const score = ScoreManager.getScore();

        if (score >= this.levelUpThreshold) {
            const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
            // const token = localStorage.getItem("authToken");

            // console.log("sending level data:", {
            //     levelNumber: 1,
            //     completionTime: completionTime,
            //     score: score,
            //     enemiesKilled: this.enemyCount,
            //     killData: this.killData
            // });
            // try {
            //     const response = await axios.post("http://localhost:3000/api/level/save", 
            //         {
            //             levelNumber: 5,
            //             completionTime: completionTime,
            //             score: score,
            //             enemiesKilled: this.enemyCount,
            //             killData: this.killData
            //         },
            //         {
            //             headers: {
            //                 Authorization: `${token}`
            //             }
            //         }
            //     );
            //     console.log("Progress saved:", response.data);
               
            // } catch (err) {
            //     console.error("Error saving progress:", err);
            // }
            this.time.delayedCall(2000, () => {
                this.scene.start('Level6Scene'); 
            });
            checkForNextLevel(this);
            
        }
    }
}