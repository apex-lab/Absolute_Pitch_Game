import Phaser from 'phaser';
import axios from 'axios';
import { preloadAssets } from './Preload.js';
import { createAssets } from './create.js';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'
import ScoreManager from './ScoreTracker'

//We will add the capturing mechanism on this level
export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0;
        this.lastFireTime = 0;
        this.fireRate = 200; 
        this.canSnare = false; 
        this.canShoot = true; 
        this.levelUpThreshold = 250
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
            'Level 2',
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
    onEvent() {
        this.checkForNextLevel(); // Check if conditions to move to the next level are met
        
        let side = Phaser.Math.Between(1, 3);
        let new_side;
        do { 
            new_side = Phaser.Math.Between(1,3); 
        } while (new_side === side); 
        side = new_side;

        switch (side) {
            case 1:
            this.spawnEnemy(this.LightBlueEnemy, 100, this.shootDelay);
                break;
            case 2:
                this.spawnEnemy(this.OrangeEnemy, 100, this.shootDelay);
                break;
            case 3:
                this.spawnEnemy(this.BlueEnemy, 100, this.shootDelay);
                break;
             default:
                console.log("Unexpected side value:", side);
                break;
        }
        this.enemyCount++;
    }

    spawnEnemy(enemy, speed, shootDelay) {
        const randIndex = Phaser.Math.Between(0, 6);
        switch(enemy.texture.key){
            case 'LightBlueEnemy':
                this.LightBlueEnemySounds[randIndex].play();
                break;
            case 'OrangeEnemy':
                this.OrangeEnemySounds[randIndex].play();
                break;
            case 'blue-enemy': 
                this.BlueEnemySounds[randIndex].play();
                break;
            default: 
                console.log("Unexpected enemy value")
                break;
        }
        spawnEnemy (this,enemy,speed,shootDelay);
    }

    checkForNextLevel()  {
        const score = ScoreManager.getScore();
        if (score >= this.levelUpThreshold) {
            const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
    
            const token = localStorage.getItem("authToken");
            
            axios.post("http://localhost:3000/api/level/save", 
                {
                  levelNumber: 2,
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
              )
              .then(response => {
                checkForNextLevel(this);
                console.log("Progress saved:", response.data);
              })
              .catch(err => {
                console.error("Error saving progress:", err);
              });
          
            this.time.delayedCall(2000, () => {
                this.scene.start('Level3Scene'); 
              }, [], this);
            }
        }
}

