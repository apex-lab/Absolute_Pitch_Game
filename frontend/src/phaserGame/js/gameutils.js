import Phaser from 'phaser';
import ScoreManager from './ScoreTracker.js';

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
        console.log('Collision with enemy:', enemy); // debugging purposes 
        console.log('Enemy category during collision:', enemy.category); //debugging purposes
        captureEnemy(scene, null, bullets, enemy);
    });

    scene.physics.add.overlap(scene.capture, scene.enemies, (enemy, capture) => {
        console.log('Collision with enemy:', enemy); //debugging purposes
        console.log('Enemy category during collision:', enemy.category); //debugging purposes
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

export function enemyShoot(scene,enemy) { 
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
        console.log('Enemies in scene:', scene.enemies);
        console.log("in the if clause");
        const enemyCategory = enemy.category;
        console.log(enemyCategory);
        const captureType = capture ? capture.type : (bullet ? bullet.type : 'unknown');
        console.log('Projectile type:', captureType);

    if (scene.enemyTimers[enemy]) {
        scene.enemyTimers[enemy].remove();
        delete scene.enemyTimers[enemy];
    }

    scene.enemies = scene.enemies.filter(e => e !== enemy);

    // Checking projectile and category of enemy. This will be updated in the 
    // future to vary in point deduction and granting. 
    if (enemyCategory === 'E2') {
        if (captureType === 'type2') {
            console.log("Correct projectile for E2 enemy");
            ScoreManager.addPoints(10);
        } else if (captureType === 'type1') {
            console.log("Incorrect projectile for E2 enemy");
            ScoreManager.addPoints(-10);
        }
    } else if (enemyCategory === 'E1') {
        if (captureType === 'type2') {
            console.log("Incorrect projectile for E1 enemy");
            ScoreManager.addPoints(-10);
        } else if (captureType === 'type1') {
            console.log("Correct projectile for E1 enemy");
            ScoreManager.addPoints(10); // Adjust as needed
        }
    }
    //Checking which projectile was fired and destorying it once determined
    if (bullet) { 
        bullet.destroy();
    } else { 
        capture.destroy();
    }
        enemy.destroy(); // Destroying the enemy
        updateScoreDisplay(scene);
        scene.checkForNextLevel();
    }
}
export function spawnEnemy(scene, enemy, speed){ 
    const ShootDelay = 3000;
    const audioPlayDelay = 3000;
    scene.time.delayedCall(audioPlayDelay, () => {
        let newEnemy = scene.physics.add.sprite(enemy.x, enemy.y, enemy.texture.key);
        newEnemy.setScale(enemy.scale);
        newEnemy.setOrigin(enemy.originX, enemy.originY);
        newEnemy.setActive(true).setVisible(true);
        newEnemy.category = enemy.category;
        scene.enemies.push(newEnemy);

        scene.physics.moveToObject(newEnemy, scene.player, speed);
        let ShootTimer = scene.time.delayedCall(ShootDelay, () => scene.enemyShoot(newEnemy), [], this);
        scene.enemyTimers[newEnemy] = ShootTimer;
    }, [], scene);
}

export function updateScoreDisplay(scene) {
    let currentScore = ScoreManager.getScore();
    scene.scoreText.setText('Score: ' + currentScore);
}

export function playerHit(scene, bullet, player) { 
    bullet.destroy();
    player.destroy();
    //console.log(resetScore)
    scene.explosion.play();
    // Ensure the explosion appears centered exactly where the player is
    let explosion = scene.add.sprite(player.x, player.y, 'explosion1');
    explosion.setOrigin(0.5, 0.5); // This centers the explosion on the player's current position
    explosion.setScale(7); // Adjust the scale as necessary
    explosion.play('explode'); // Play the explosion animation
    explosion.setScrollFactor(0); // Optional, ensures it does not move with the camera if the camera is dynamic
   

    for (let timer in scene.enemyTimers) {
        if (scene.enemyTimers.hasOwnProperty(timer)) {
            scene.enemyTimers[timer].remove(true); 
            delete scene.enemyTimers[timer];
        }
    }
    scene.sound.stopAll();
    scene.enemies.forEach(enemy => enemy.destroy());
    scene.timedEvent.remove();

    let killedText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Player was killed!', {
        fontSize: '40px',
        fill: '#fff'
    });
    killedText.setOrigin(0.5, 0.5);  // Center the text
    scene.time.delayedCall(1500, () => {
        killedText.destroy();  // Remove the text after 1.5 seconds
        }, [], scene);

    const delayDuration = 3000

    { scene.time.delayedCall(delayDuration, () => {
        scene.enemyCount = 0;
        ScoreManager.resetScore();
        updateScoreDisplay(scene);
            // Restart the scene
            scene.scene.restart();
        }, [], scene);
    }
}

export function checkForNextLevel (scene) {
    console.log(scene.enemyCount);
        ScoreManager.setPreviousScore();

        scene.player.destroy()
        let completeText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Level Complete!', {
            fontSize: '40px',
            fill: '#fff'
        });
        completeText.setOrigin(0.5, 0.5);  // Center the text
}