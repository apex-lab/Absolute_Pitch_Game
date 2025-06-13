import Phaser from 'phaser';
import ScoreManager from './ScoreTracker.js';
import axios from 'axios';

//Function to update player key presses and movement
// This is fine do not change this
export function updateAssets(scene,time, delta) { 
    // Arrow keys for movement 
    const ROTATION_STEP = Phaser.Math.DegToRad(30);
    const { left, right } = scene.cursors;
    const state = scene.rotationState;

    // Left Key 
    if (left.isDown) {
        state.leftHeldTime += delta;

        if (
            Phaser.Input.Keyboard.JustDown(left) || 
            (state.leftHeldTime > state.delay && time - state.lastLeftRotation > state.interval)
        ) {
            scene.player.rotation -= ROTATION_STEP;
            state.lastLeftRotation = time;
        }
    } else {
        state.leftHeldTime = 0;
    }

    // Right Key
    if (right.isDown) {
        state.rightHeldTime += delta;

        if (
            Phaser.Input.Keyboard.JustDown(right) || 
            (state.rightHeldTime > state.delay && time - state.lastRightRotation > state.interval)
        ) {
            scene.player.rotation += ROTATION_STEP;
            state.lastRightRotation = time;
        }
    } else {
        state.rightHeldTime = 0;
    }

    // W Key for shooting
    if (scene.canShoot && scene.wKey.isDown) {
         Shoot(scene,time);  
    }
    // E Key for shooting
    if (scene.canSnare && scene.eKey.isDown) {
        fireSnare(scene,time);  
    }
}

// I might be able to combine these two functions into one, but for now I will leave them separate
export function Shoot(scene, time) {
    if (time - scene.lastFireTime > scene.fireRate) {
        const bullet = scene.bullets.get();
        if (bullet) {
            bullet.type = 'type1';
            const angle = scene.player.rotation - Math.PI / 2
            bullet.fire(scene.player.x, scene.player.y, angle);
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
             const angle = scene.player.rotation - Math.PI / 2
            capture.fire(scene.player.x, scene.player.y, angle);
            scene.lastFireTime = time;
        }
    }
}

//Problems emerge because of the following functions
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
    scene.enemies.remove(enemy, true, true);
    const timeSinceStart = Math.floor((Date.now() - scene.levelStartTime) / 1000);
    scene.killData.push({
    enemyId: enemy.texture.key,
    killTime: timeSinceStart
    });
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

    scene.enemies.remove(enemy, true, true);

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
            ScoreManager.addPoints(10); 
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
//Mayor problems here
export function spawnEnemy(scene, enemyKey, speed) {
    const def = scene.enemyTemplates[enemyKey];
    const port = scene.ports[def.port];

    const enemy = scene.enemies.get(scene.player.x, scene.player.y, def.key);
    if (!enemy) return;

    enemy.setTexture(def.key);
    enemy.setPosition(port.x, port.y);
    enemy.setActive(true).setVisible(true);
    enemy.category = def.category;

    // Ensure physics body is enabled
    if (!enemy.body) {
        scene.physics.add.existing(enemy);  // fallback in case it's missing
    } else {
        enemy.body.enable = true;
    }

    const SoundKey = Phaser.Utils.Array.GetRandom(def.soundSet);
    const sound = scene.sound.add(SoundKey);

    const delay = 3500;
    sound.play();
    sound.once('complete', () => {
    console.log('Sound finished');
});
    console.log('Scene is active:', scene.scene.isActive());
    scene.time.delayedCall(delay, () => {
        console.log(`Moving enemy toward player at (${scene.player.x}, ${scene.player.y})`);
        scene.physics.moveToObject(enemy, scene.player, speed);

        // Add shoot behavior after delay
        scene.enemyTimers[enemy] = scene.time.delayedCall(2000, () => scene.enemyShoot(enemy));
    });

    return enemy;
}

export function generateBalancedQueue(enemyTypes, totalCount, maxPerType) {
    const queue = [];
    const counts = {};

    while (queue.length < totalCount) {
        const pick = Phaser.Utils.Array.GetRandom(enemyTypes);
        counts[pick] = (counts[pick] || 0) + 1;

        if (counts[pick] <= maxPerType) {
        queue.push(pick);
        }
    }

    return queue;
}

// This is fine
export function updateScoreDisplay(scene) {
    let currentScore = ScoreManager.getScore();
    scene.scoreText.setText('Score: ' + currentScore);
}

// Potential problems with this function
export function cleanupScene(scene) {
    for (let timer in scene.enemyTimers) {
        if (scene.enemyTimers.hasOwnProperty(timer)) {
            scene.enemyTimers[timer].remove(true);
            delete scene.enemyTimers[timer];
        }
    }

    scene.enemySpawnTimers.forEach(timer => timer.remove(true));
    scene.enemySpawnTimers = [];
    scene.enemies = [];

    scene.bullets.clear(true, true);
    scene.capture.clear(true, true);
    scene.enemyBullets.clear(true, true);

    // Stop sounds
    if (scene.sound) {
        scene.sound.stopAll();
    }
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
        cleanupScene(scene);
        ScoreManager.setPreviousScore();
        scene.player.destroy()
    

        let completeText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Level Complete!', {
            fontSize: '40px',
            fill: '#fff'
        });
        completeText.setOrigin(0.5, 0.5)
    
}

// export async function refreshAuthToken() {
//     const refreshToken = localStorage.getItem('refreshToken');
//     if (!refreshToken) {
//         console.error('No refresh token available.');
//         return null;
//     }

//     try {
//         const response = await axios.post('http://localhost:3000/api/users/refresh', {
//             refreshToken
//         });

//         const newAccessToken = response.data.accessToken;
//         localStorage.setItem('authToken', newAccessToken); // Update the access token
//         return newAccessToken;
//     } catch (err) {
//         console.error('Failed to refresh auth token:', err.response?.data || err.message);
//         return null;
//     }
// }