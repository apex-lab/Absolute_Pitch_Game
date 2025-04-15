import Phaser from 'phaser';
import axios from 'axios';
import { preloadAssets } from './Preload';
import { createAssets } from './create';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'
import ScoreManager from './ScoreTracker'

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.fireRate = 200;
        this.canSnare = false; 
        this.canShoot = true; 
        this.lastFireTime = 0;
        this.enemyTimers = {};
        this.levelUpThreshold = 30;
        this.speed = 300;
        this.killData = [];
    }
    preload() {
        preloadAssets(this);
    }

    create() {
        this.levelStarted = false;
        this.load.image('space', 'assets/space.png');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0,0)
        // Display "Level 1" text centered on the screen
        const levelText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Level 1',
            {
                fontSize: '48px',
                fill: '#ffffff',
            }
        ).setOrigin(0.5);

        // After a delay, destroy the text and start the level
        this.time.delayedCall(2000, () => {
            levelText.destroy();
            this.startLevel(); // Now start the level
        });
    }

    startLevel() {
        this.levelStarted = true;
        this.levelStartTime = Date.now();
        this.killData = []; 
        this.enemyCount = 0; 
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
    onEvent(player) {
        this.checkForNextLevel()
        
        let side = Phaser.Math.Between(1, 2);
        let new_side;
        do { 
            new_side = Phaser.Math.Between(1,2); 
        } while (new_side === side); 
        side = new_side; 

        switch (side) {
            case 1:
                this.spawnEnemy(this.LightBlueEnemy, 100, this.ShootDelay);
                break;
            case 2: 
                this.spawnEnemy(this.OrangeEnemy, 100, this.ShootDelay);
                break;
            default:
                break;
        }
        this.enemyCount++;
    }

    spawnEnemy(enemy, speed, shootDelay) {
        //Adding unique chromatic scale to each enemy
        const randIndex = Phaser.Math.Between(0, 6);
        //Adding unique chromatic scale to each enemy
        switch(enemy.texture.key){
            case 'LightBlueEnemy':
                this.LightBlueEnemySounds[randIndex].play();
                break;
            case 'OrangeEnemy':
                this.OrangeEnemySounds[randIndex].play();
                break;
             default: 
                break;
        }

        spawnEnemy (this,enemy,this.speed,shootDelay);
    }

//     async checkForNextLevel () {
//         const score = ScoreManager.getScore();
    
//         if (score >= this.levelUpThreshold) {
//             const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
//             const token = localStorage.getItem("authToken");
    
//             console.log("sending level data:", {
//                 levelNumber: 1,
//                 completionTime: completionTime,
//                 score: score,
//                 enemiesKilled: this.enemyCount,
//                 killData: this.killData
//             });
    
//             try {
//                 const response = await axios.post("http://localhost:3000/api/level/save", 
//                     {
//                         levelNumber: 1,
//                         completionTime: completionTime,
//                         score: score,
//                         enemiesKilled: this.enemyCount,
//                         killData: this.killData
//                     },
//                     {
//                         headers: {
//                             Authorization: `${token}`
//                         }
//                     }
//                 );
//                 console.log("Progress saved:", response.data);
//             } catch (err) {
//                 console.error("Error saving progress:", err);
//             }
    
//             // Only after post completes, call checkForNextLevel logic
//             checkForNextLevel(this);
//             this.time.delayedCall(2000, () => {
//                 this.scene.start('Level2Scene'); 
//             });
//         }
//     }
// }
    async checkForNextLevel () {
        const score = ScoreManager.getScore();

        if (score >= this.levelUpThreshold) {
            const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
            const token = localStorage.getItem("authToken");

            console.log("sending level data:", {
                levelNumber: 1,
                completionTime: completionTime,
                score: score,
                enemiesKilled: this.enemyCount,
                killData: this.killData
            });

            try {
                const response = await axios.post("http://localhost:3000/api/level/save", 
                    {
                        levelNumber: 1,
                        completionTime: completionTime,
                        score: score,
                        enemiesKilled: this.enemyCount,
                        killData: this.killData
                    },
                    {
                        headers: {
                            Authorization: `${token}`
                        }
                    }
                );
                console.log("Progress saved:", response.data);
            } catch (err) {
                console.error("Error saving progress:", err);
            }

            // Only after post completes, call checkForNextLevel logic
            checkForNextLevel(this);
            this.time.delayedCall(2000, () => {
                this.scene.start('Level2Scene'); 
            });
        }
    }
}
