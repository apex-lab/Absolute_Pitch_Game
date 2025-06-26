import Phaser from 'phaser';
import axiosInstance from './api'
import { preloadAssets } from './Preload';
import { createAssets } from './create';
import {enemyShoot, playerHit,updateAssets, enemyHit, spawnEnemy,checkForNextLevel,generateBalancedQueue,handleLevelCompletion} from './gameutils.js'
import ScoreManager from './ScoreTracker'

//We will add the capturing mechanism on this level
export default class Level3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level3Scene' });   
    }
    preload() {
        preloadAssets(this);
    }
    create() {
        this.levelStarted = false;
        this.fireRate = 200;
        this.bullet2 = false;
        this.bullet1 = true;
        this.lastFireTime = 0;
        this.enemyTimers = {};
        this.speed = 300;
        this.levelUpThreshold = 280;
        this.canSpawn = true;

        this.load.image('space', 'assets/space.png');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0,0)

        const levelText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Level 3',
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

        this.enemyTypes = ['LightBlueEnemy', 'OrangeEnemy', 'BlueEnemy', 'YellowEnemy'];
                this.levelQueues = {
                    level3: generateBalancedQueue(this.enemyTypes, 28, 7),
                };
                this.currentQueue = [...this.levelQueues.level3];
        
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
    
   async checkForNextLevel() {
        await handleLevelCompletion(this, 'Level4Scene', 3); 
    } 
}