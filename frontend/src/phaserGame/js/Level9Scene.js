import Phaser from 'phaser';
import { preloadAssets } from './Preload.js';
import { createAssets } from './create.js';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'

export default class Level9Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level9Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0;
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.canShoot = false; 
        this.canSnare = true;
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
        let side = Phaser.Math.Between(1,5);
        let new_side;
        do { 
            new_side = Phaser.Math.Between(1,5); 
        } while (new_side === side); 
        side = new_side; 
        switch (side) {
            case 1:
                this.spawnEnemy(this.MagentaFriendly, 100, this.ShootDelay);
                break;
            case 2: 
                this.spawnEnemy(this.PinkFriendly, 100, this.ShootDelay);
                break;
            case 3: 
                this.spawnEnemy(this.AquaFriendly, 100, this.ShootDelay);
                break;
            case 4:
                this.spawnEnemy(this.LightPurpleFriendly, 100, this.ShootDelay); 
                break;
            case 5: 
                this.spawnEnemy(this.BrownFriendly, 100, this.ShootDelay);
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
            case 'MagentaFriendly':
                console.log("Playing sound:", this.MagentaFriendlySounds[randIndex].key);
                this.MagentaFriendlySounds[randIndex].play();
                break;
            case 'PinkFriendly':
                console.log("Playing sound:", this.PinkFriendlySounds[randIndex].key);
                this.PinkFriendlySounds[randIndex].play();
                break;
            case 'AquaFriendly': 
                console.log("Playing sound:", this.AquaFriendlySounds[randIndex].key);
                this.AquaFriendlySounds[randIndex].play();
                break; 
            case 'LightPurpleFriendly': 
                this.LightPurpleFriendlySounds[randIndex].play();
                break;
            case 'BrownFriendly': 
                this.BrownFriendlySounds[randIndex].play();
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
                this.scene.start('Level10Scene'); 
            }, [], this);
        }
    }
}