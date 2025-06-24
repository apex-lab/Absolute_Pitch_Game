import Phaser from 'phaser';
import axiosInstance from './api'
import { preloadAssets } from './Preload';
import { createAssets } from './create';
import {enemyShoot, playerHit,updateAssets, enemyHit, spawnEnemy,checkForNextLevel,generateBalancedQueue} from './gameutils.js'
import ScoreManager from './ScoreTracker'

export default class Level14Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level14Scene' });
        
    }
    preload() {
        preloadAssets(this);
    }
    create() {
        this.levelStarted = false;
        this.fireRate = 200;
        this.bullet2 = true;
        this.bullet1 = false;
        this.lastFireTime = 0;
        this.enemyTimers = {};
        this.speed = 300;
        this.levelUpThreshold = 1400;
        this.canSpawn = true
        this.load.image('space', 'assets/space.png');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0,0)
        
        const levelText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Level 14',
            {
                fontSize: '48px',
                fill: '#ffffff',
            }
        ).setOrigin(0.5);

        this.time.delayedCall(2000, () => {
            levelText.destroy();
            this.startLevel(); 
        });
    }

     startLevel() {
        this.levelStarted = true;
        this.levelStartTime = Date.now();
        this.killData = []; 
        this.enemyCount = 0; 
        createAssets(this);

        this.enemyTypes = ['MagentaFriendly', 'PinkFriendly','LightBlueEnemy', 'OrangeEnemy','BlueEnemy','AquaFriendly', 'YellowEnemy', 'LightPurpleFriendly', 'GreenEnemy', 'BrownFriendly'];
            this.levelQueues = {
                Level14Scene: generateBalancedQueue(this.enemyTypes, 70, 7),
            };
            this.currentQueue = [...this.levelQueues.level14];

            if (this.timedEvent) {
                this.timedEvent.remove();
            }

            this.timedEvent = this.time.addEvent({
                delay: 4000,
                callback: this.onEvent,
                callbackScope: this,
                loop: true
        });

    }
    update(time,delta) {
        if (!this.levelStarted) return; 
        updateAssets(this,time, delta)
    }
    playerHit(bullet, player) {
        playerHit(this, bullet, player)
    }
    enemyHit(projectile, enemy) {
        enemyHit(this, projectile,enemy);
    }
    enemyShoot(enemy) {
        enemyShoot(this,enemy)
    }
      onEvent() {
        this.checkForNextLevel();
        
        if (!this.currentQueue || this.currentQueue.length === 0) return;

        if (!this.canSpawn) return;  
        this.canSpawn = false;

        const nextEnemy = this.currentQueue.shift();
        spawnEnemy(this, nextEnemy, this.speed).then(() => {
            this.canSpawn = true;
            if (!this.scene,!this.sys || !this.sys.isActive()) return;
            this.time.delayedCall(500, () => this.onEvent());
        });
    }
    async checkForNextLevel () {
        const score = ScoreManager.getScore();

        if (score >= this.levelUpThreshold) {
            const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
            // const token = localStorage.getItem("authToken");

            // console.log("sending level data:", {
            //     levelNumber: 14,
            //     completionTime: completionTime,
            //     score: score,
            //     enemiesKilled: this.enemyCount,
            //     killData: this.killData
            // });
            // try {
            //     const response = await axios.post("http://localhost:3000/api/level/save", 
            //         {
            //             levelNumber: 1,
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
                this.scene.start('Level15Scene'); 
            });
            checkForNextLevel(this);
        }
    }
}