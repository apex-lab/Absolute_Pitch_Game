import Phaser from 'phaser';
import axios from 'axios';
import { preloadAssets } from './Preload';
import { createAssets } from './create';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel,generateBalancedQueue} from './gameutils.js'
import ScoreManager from './ScoreTracker'

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.fireRate = 200;
        this.canSnare = false; 
        this.canShoot = true; 
        this.lastFireTime = 0;
        this.enemyTimers = {};
        this.levelUpThreshold = 130;
        this.speed = 300;
        this.killData = [];
    }
    preload() {
        preloadAssets(this);
    }

    create(){
    this.levelStarted = false;
    this.fireRate = 200;
    this.canSnare = false;
    this.canShoot = true;
    this.lastFireTime = 0;
    this.enemyTimers = {};
    this.speed = 300;
    this.killData = [];

    this.load.image('space', 'assets/space.png');
    let background = this.add.sprite(0, 0, 'space');
    background.setOrigin(0, 0);

    const levelText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'Level 1',
        { fontSize: '48px', fill: '#ffffff' }
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

    this.enemyTypes = ['LightBlueEnemy', 'OrangeEnemy'];
    this.levelQueues = {
        level1: generateBalancedQueue(this.enemyTypes, 14, 7),
    };
    this.currentQueue = [...this.levelQueues.level1];
    
    if (this.timedEvent) {
        this.timedEvent.remove();
        console.log("Old timer removed.");
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
    CaptureEnemy(capture, bullet, enemy) {
        captureEnemy(this, capture,bullet,enemy);
    }
    enemyShoot(enemy) {
        enemyShoot(this,enemy)
    }

    onEvent() {
    this.checkForNextLevel();
    if (!this.currentQueue || this.currentQueue.length === 0) return;
    const nextEnemy = this.currentQueue.shift();
    spawnEnemy(this, nextEnemy, this.speed);
    console.log("Spawning enemy:", nextEnemy);
}

    async checkForNextLevel (retries = 5, delay = 300) {
        const score = ScoreManager.getScore();

        if (score >= this.levelUpThreshold) {
            const completionTime = Math.floor((Date.now() - this.levelStartTime) / 1000);
            // const token = localStorage.getItem("authToken");
            // if (!token && retries > 0) {
            //     console.warn("Token missing. Retrying...");
            //     this.time.delayedCall(delay, () => {
            //         this.checkForNextLevel(retries - 1, delay);
            //     });
            //     return;
            // }
    
            // if (!token) {
            //     console.error("Auth token still missing after retries.");
            //     return;
            // }

            // console.log("sending level data:", {
            //     levelNumber: 1,
            //     completionTime: completionTime,
            //     score: score,
            //     enemiesKilled: this.enemyCount,
            //     killData: this.killData
            // });

            // try {
            //     const response = await axiosInstance.post("http://localhost:3000/api/level/save", 
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
            checkForNextLevel(this);
            this.time.delayedCall(1000, () => {
                this.scene.start('Level2Scene'); 
            });
            
        }
    }
}
