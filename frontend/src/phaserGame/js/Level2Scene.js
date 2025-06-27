import Phaser from 'phaser';
import { preloadAssets } from './Preload';
import { createAssets } from './create';
import {enemyShoot, playerHit,updateAssets, enemyHit,onEvent,generateBalancedQueue,handleLevelCompletion} from './gameutils.js'

export default class Level2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2Scene' });    
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
        this.levelUpThreshold = 210
        this.canSpawn = true;

        this.load.image('space', 'assets/space.png');
        let background = this.add.sprite(0, 0, 'space');
        background.setOrigin(0,0)
       
        const levelText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Level 2',
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

        this.enemyTypes = ['LightBlueEnemy', 'OrangeEnemy', 'BlueEnemy'];
        this.levelQueues = {
            level2: generateBalancedQueue(this.enemyTypes, 21, 7),
        };
        this.currentQueue = [...this.levelQueues.level2];
        this.onEvent = onEvent.bind(this);
         
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
    enemyShoot(enemy)  {
        enemyShoot(this,enemy)
    }

    async checkForNextLevel() {
        await handleLevelCompletion(this, 'Level3Scene', 2); 
    }
}

