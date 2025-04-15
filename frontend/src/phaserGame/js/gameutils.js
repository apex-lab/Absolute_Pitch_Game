import Phaser from 'phaser';
import ScoreManager from './ScoreTracker.js';

//Function to update player key presses and movement
export function updateAssets(scene,time, delta) { 
    //Enables cursor movement for player
    const mouseX = scene.input.mousePointer.worldX;
    const mouseY = scene.input.mousePointer.worldY;
 
    // Calculate the angle between the player and the mouse pointer
    const angle = Phaser.Math.Angle.BetweenPoints(
         scene.player, 
         { x: mouseX, y: mouseY }
     );
    // Set the player rotation to the calculated angle
    scene.player.rotation = angle;
    // creating collision boundaries for player and projectiles 
    scene.physics.add.overlap(scene.enemyBullets, scene.player, scene.playerHit, null, scene);
    scene.physics.add.overlap(scene.bullets, scene.enemies, (enemy, bullets) => {
        captureEnemy(scene, null, bullets, enemy);
    });
    scene.physics.add.overlap(scene.capture, scene.enemies, (enemy, capture) => {
        captureEnemy(scene, capture, null, enemy);
    });
    // enabling projectiles. 
    if (scene.canShoot && scene.wKey.isDown) {
         Shoot(scene,time);  
    }
    if (scene.canSnare && scene.eKey.isDown) {
        fireSnare(scene,time);  
    }
}
//The shoot function for the first type of alein
export function Shoot(scene, time) {
    if (time - scene.lastFireTime > scene.fireRate) {
        const bullet = scene.bullets.get();
        if (bullet) {
            bullet.type = 'type1';
            const angle = Phaser.Math.Angle.Between(scene.player.x, scene.player.y, scene.mouseX, scene.mouseY);
            bullet.fire(scene.player.x, scene.player.y, angle - Math.PI / 2);
            scene.lastFireTime = time;
        }
    }
}
// The shoot function for the second type of alien
export function fireSnare(scene,time) { 
    if (time - scene.lastFireTime > scene.fireRate) {
        const capture = scene.capture.get();
        if (capture) { 
            capture.type = 'type2';
            const angle = Phaser.Math.Angle.Between(scene.player.x, scene.player.y, scene.mouseX, scene.mouseY);
            capture.fire(scene.player.x, scene.player.y, angle - Math.PI/2);
            scene.lastFireTime = time;
        }
    }
}
//Alien Projectiles
export function enemyShoot(scene,enemy) { 
    if (!scene.scene.isActive()) return;
    if (!scene.player || !scene.player.active) return;
    let bullet = scene.enemyBullets.get();
        if (bullet) {
            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, scene.player.x, scene.player.y);
            bullet.fire(enemy.x, enemy.y, angle);
        }
        if (scene.laserSound) {
            scene.laserSound.play();
        }
}

export function enemyHit(scene, bullet, enemy) {
    bullet.destroy();
    if (scene.enemyTimers[enemy]) {
        scene.enemyTimers[enemy].remove();
        delete scene.enemyTimers[enemy];
    }
    scene.enemies = scene.enemies.filter(e => e !== enemy);
    enemy.destroy();
    ScoreManager.addPoints(10);
    updateScoreDisplay(scene);
    scene.checkForNextLevel();
}

export function captureEnemy(scene,capture,bullet,enemy){
    if (enemy) { 
        const enemyCategory = enemy.category;
        const captureType = capture ? capture.type : (bullet ? bullet.type : 'unknown');
    if (scene.enemyTimers[enemy]) {
        scene.enemyTimers[enemy].remove();
        delete scene.enemyTimers[enemy];
    }

    scene.enemies = scene.enemies.filter(e => e !== enemy);

    // Checking projectile and category of enemy. This will be updated in the 
    // future to vary in point deduction and granting. 
    if (enemyCategory === 'E2') {
        if (captureType === 'type2') {
            ScoreManager.addPoints(10);
        } else if (captureType === 'type1') {
            ScoreManager.addPoints(-10);
        }
    } else if (enemyCategory === 'E1') {
        if (captureType === 'type2') {
            ScoreManager.addPoints(-10);
        } else if (captureType === 'type1') {
            ScoreManager.addPoints(10); // Adjust as needed
        }
    }
    //Checking which projectile was fired and destorying it once determined
    if (bullet) { 
        bullet.destroy();
    } else { 
        capture.destroy();
    }
    const timeSinceStart = Math.floor((Date.now() - scene.levelStartTime) / 1000);
    scene.killData.push({
    enemyId: enemy.texture.key,
    killTime: timeSinceStart
    });
        enemy.destroy(); // Destroying the enemy
        updateScoreDisplay(scene);
        scene.checkForNextLevel();
    }
}
//Function to spawn enemy
export function spawnEnemy(scene, enemy, speed){ 
    if (!scene.player || !scene.scene.isActive()) return;
    const ShootDelay = 2000;
    const audioPlayDelay = 3500;

    const spawnTimer = scene.time.delayedCall(audioPlayDelay, () => {
        let newEnemy = scene.physics.add.sprite(enemy.x, enemy.y, enemy.texture.key);
        newEnemy.setScale(enemy.scale);
        newEnemy.setOrigin(enemy.originX, enemy.originY);
        newEnemy.setActive(true).setVisible(true);
        newEnemy.category = enemy.category;
        scene.enemies.push(newEnemy);
        scene.physics.moveToObject(newEnemy, scene.player, speed);

        let shootTimer = scene.time.delayedCall(ShootDelay, () => {
            scene.enemyShoot(newEnemy);
        }, [], this);

        scene.enemyTimers[newEnemy] = shootTimer;

    }, [], scene);

    scene.enemySpawnTimers.push(spawnTimer); 
}

export function updateScoreDisplay(scene) {
    let currentScore = ScoreManager.getScore();
    scene.scoreText.setText('Score: ' + currentScore);
}

export function cleanupScene(scene) {
    // Stop all active enemy fire timers
    for (let timer in scene.enemyTimers) {
        if (scene.enemyTimers.hasOwnProperty(timer)) {
            scene.enemyTimers[timer].remove(true);
            delete scene.enemyTimers[timer];
        }
    }

    scene.enemySpawnTimers.forEach(timer => timer.remove(true));
    scene.enemySpawnTimers = [];

    // Destroy all enemies
    scene.enemies.forEach(enemy => {
        if (enemy?.destroy) enemy.destroy();
    });
    scene.enemies = [];
    // Clear projectile groups
    scene.bullets.clear(true, true);
    scene.capture.clear(true, true);
    scene.enemyBullets.clear(true, true);

    // Stop sounds
    scene.sound.stopAll();
}

export function playerHit(scene, bullet, player) {
    bullet.destroy();
    player.destroy();

    let explosion = scene.add.sprite(scene.player.x, scene.player.y, 'explosion1');
    explosion.setOrigin(0.5,0.5);
    explosion.setScale(5);
    explosion.play('explode');

    let killedText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Player was killed!', {
        fontSize: '50px',
        fill: '#fff'
    });
    killedText.setOrigin(0.5, 0.5);

    // Delay cleanup slightly to let animation/audio play smoothly
    scene.time.delayedCall(300, () => {
        cleanupScene(scene);
        // killedText.destroy();

        ScoreManager.resetScore();
        updateScoreDisplay(scene);

        scene.time.delayedCall(1000, () => {
            killedText.destroy();
            scene.enemyCount = 0;
            scene.scene.restart();
        });
    });
}

export function checkForNextLevel (scene) {
        ScoreManager.setPreviousScore();
        scene.player.destroy()
        cleanupScene(scene);

        let completeText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Level Complete!', {
            fontSize: '40px',
            fill: '#fff'
        });
        completeText.setOrigin(0.5, 0.5)
    
}
    