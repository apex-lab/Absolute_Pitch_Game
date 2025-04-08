import Phaser from 'phaser';
import { preloadAssets } from './Preload';
import { createAssets } from './create';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0; 
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.canSnare = false; 
        this.canShoot = true; 
        this.levelUpThreshold = 6
        this.speed = 300
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
    
    //Note: this.enemies.length may be useful for the study to see how many attempts it takes for players to 
    //complete a given level. 
    checkForNextLevel () {
        if (this.enemyCount >= this.levelUpThreshold) {
            checkForNextLevel(this);
            this.time.delayedCall(2000, () => {
                this.scene.start('Level2Scene'); 
            }, [], this);
        }
    }
}