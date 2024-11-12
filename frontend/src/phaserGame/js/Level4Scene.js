import Phaser from 'phaser';
import { preloadAssets } from './Preload.js';
import { createAssets } from './create.js';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'


export default class Level4Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level4Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0;
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.canSnare = false; 
        this.canShoot = true; 
        this.levelUpThreshold = 15
    }
    preload() {
        preloadAssets(this);
    }
    create() {
        createAssets(this);
    }
    update(time,delta) {
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
        
        let side = Phaser.Math.Between(1, 5);
        let new_side;
        do { 
            new_side = Phaser.Math.Between(1,5); 
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
                this.LightBlueEnemySounds[randIndex].play();
                break;
            case 'OrangeEnemy':
                this.OrangeEnemySounds[randIndex].play();
                break;
            case 'blue-enemy': 
                this.BlueEnemySounds[randIndex].play();
                break;
            case 'YellowEnemy':
                this.YellowEnemySounds[randIndex].play();
                break;
            case 'green-enemy':
                this.GreenEnemySounds[randIndex].play();
                break;
            default: 
                console.log("Unexpected enemy value")
                break;
        }
        spawnEnemy (this,enemy,speed,shootDelay);
    }

    checkForNextLevel() {
        if (this.enemyCount >= this.levelUpThreshold) {
            checkForNextLevel(this);
            this.time.delayedCall(3000, () => {
                this.scene.start('Level5Scene'); 
            }, [], this); 
        }
    }
}