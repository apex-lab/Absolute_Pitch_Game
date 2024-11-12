import Phaser from 'phaser';
import { preloadAssets } from './Preload.js';
import { createAssets } from './create.js';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'

export default class Level7Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level7Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0;
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.canSnare = true; 
        this.canShoot = false;
        this.levelUpThreshold = 12;
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
        
        let side = Phaser.Math.Between(1, 3); // Initialize the 'side' variable with a random value between 1 and 3
        let new_side;
        
        do { 
            new_side = Phaser.Math.Between(1, 3); // Generate a new random side
        } while (new_side === side); // Ensure the new side is different from the initial one
        
        side = new_side; // Reassign 'side' to the new value after the loop completes
    
        // Now use 'side' in the switch statement
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
            default:
                console.log("Unexpected side value:", side); // Handle unexpected values of 'side'
                break;
        }
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
            default:
                console.log("Unexpected enemy value"); 
                break;
        }

        spawnEnemy (this,enemy,speed,shootDelay);
    }

    checkForNextLevel() {
        if (this.enemyCount >= this.levelUpThreshold) {
            checkForNextLevel(this);
            this.time.delayedCall(3000, () => {
                this.scene.start('Level8Scene'); 
            }, [], this);
        }
    }
}