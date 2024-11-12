import Phaser from 'phaser';
import { preloadAssets } from './Preload.js';
import { createAssets } from './create.js';
import {enemyShoot,playerHit,updateAssets, captureEnemy, spawnEnemy,checkForNextLevel} from './gameutils.js'

export default class Level15Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level15Scene' });
        this.mouseX = 0;
        this.mouseY = 0;
        this.enemyTimers = {};
        this.enemyCount = 0;
        this.lastFireTime = 0;
        this.fireRate = 200;
        this.canShoot = true; 
        this.canSnare = true;
        this.levelUpThreshold = 35;
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
        this.checkForNextLevel();
        let side = Phaser.Math.Between(1,10);
        let new_side;
        do { 
            new_side = Phaser.Math.Between(1,10); 
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
                this.spawnEnemy(this.LightBlueEnemy, 100, this.shootDelay);
                break;
            case 4:
                this.spawnEnemy(this.OrangeEnemy, 100, this.shootDelay);
                break;
            case 5: 
                this.spawnEnemy(this.BlueEnemy, 100, this.shootDelay);
                break;
            case 6: 
                this.spawnEnemy(this.AquaFriendly, 100, this.shootDelay);
                break;
            case 7: 
                this.spawnEnemy(this.YellowEnemy, 100, this.shootDelay);
                break;
            case 8: 
                this.spawnEnemy(this.LightPurpleFriendly, 100, this.shootDelay);
                break;
            case 9: 
                this.spawnEnemy(this.GreenEnemy, 100, this.shootDelay); 
                break;
            case 10: 
                this.spawnEnemy(this.BrownFriendly, 100, this.shootDelay);
                break;
            case 11: 
                this.spawnEnemy(this.PurpleEnemy, 100, this.shootDelay); 
                break; 
            case 12: 
                this.spawnEnemy(this.RedFriendly, 1001, this.shootDelay); 
                break; 
            default:
                console.log("Unexpected side value:", side); // Handle unexpected values of 'side'
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
           case 'LightBlueEnemy': 
                console.log("Playing sound:", this.LightBlueEnemySounds[randIndex].key); 
                this.LightBlueEnemySounds[randIndex].play(); 
                break;
            case 'OrangeEnemy': 
                console.log("Playing sound:", this.OrangeEnemySounds[randIndex].key); 
                this.OrangeEnemySounds[randIndex].play(); 
                break;
            case 'blue-enemy':
                this.BlueEnemySounds[randIndex].play(); 
                break;
            case 'AquaFriendly':
                this.AquaFriendlySounds[randIndex].play(); 
                break;
            case 'YellowEnemy':
                this.YellowEnemySounds[randIndex].play();
                break; 
            case 'LightPurpleFriendly': 
                this.LightPurpleFriendlySounds[randIndex].play();
                break;
            case 'green-enemy': 
                this.GreenEnemySounds[randIndex].play();
                break;
            case 'BrownFriendly': 
                this.BrownFriendlySounds[randIndex].play();
                break;
            case 'PurpleEnemy': 
                this.PurpleEnemySounds[randIndex].play();
                break;
            case 'RedFriendly':
                this.RedFriendlySounds[randIndex].play();
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
                this.scene.start('TitleScreen'); 
            }, [], this);
        }
    }
}