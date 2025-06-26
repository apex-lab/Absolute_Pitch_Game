import Phaser from 'phaser';
import ScoreManager from './ScoreTracker.js';
import axiosInstance from './api'

//Function to update player key presses and movement
export function updateAssets(scene,time, delta) { 
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

    if (scene.bullet1 && scene.wKey.isDown) {
        fireProjectile(scene, time, scene.projectiles, 'type1'); 
    }
    if (scene.bullet2 && scene.eKey.isDown) {
        fireProjectile(scene, time, scene.projectiles, 'type2');  
    }
}

export function fireProjectile(scene, time, group, type){
    if (time - scene.lastFireTime > scene.fireRate) {
        const projectile = group.get();
        if (projectile) {
            projectile.type = type;
            const angle = scene.player.rotation - Math.PI / 2;
            projectile.fire(scene.player.x, scene.player.y, angle);
            scene.lastFireTime = time;
        }
    }
}

export function enemyShoot(scene,enemy){ 
    if (!scene.scene.isActive()) return;
    if (!scene.player || !scene.player.active) return;
    let bullet = scene.enemyBullets.get();
        if (bullet) {
            bullet.shooter = enemy;
            let angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, scene.player.x, scene.player.y);
            bullet.fire(enemy.x, enemy.y, angle);
        }
        if (scene.laserSound) {
            scene.laserSound.play();
        }
}

export function enemyHit(scene, projectile, enemy) {
    if (!enemy.collision) { 
        return;
    }
    const type = projectile?.type ?? 'unknown';
    const category = enemy.category ?? 'unknown';

    if (scene.enemyTimers[enemy]) {
        scene.enemyTimers[enemy].remove();
        delete scene.enemyTimers[enemy];
    }

    if (category === 'E2') {
        ScoreManager.addPoints(type === 'type2' ? 10 : -10);
    } else if (category === 'E1') {
        ScoreManager.addPoints(type === 'type1' ? 10 : -10);
    } else {
        ScoreManager.addPoints(10);
    }

    scene.player.setRotation(0);
    projectile?.destroy();

    const timeSinceStart = Math.floor((Date.now() - scene.levelStartTime) / 1000);
    scene.killData.push({
        enemyId: enemy.texture.key,
        killTime: timeSinceStart
    });

    if (enemy.active) {
        scene.enemies.remove(enemy, true, true); 
        enemy.destroy();
    }
    updateScoreDisplay(scene);
    scene.checkForNextLevel();
}

export function spawnEnemy(scene, enemyKey, speed) {

    return new Promise((resolve) => {
        const def = scene.enemyTemplates[enemyKey];
        const port = scene.ports[def.port];
        if (!def) return resolve();

        const enemy = scene.enemies.get(scene.player.x, scene.player.y, def.key);
        if (!enemy) return resolve();

        enemy.setTexture(def.key);
        enemy.setPosition(port.x, port.y);
        enemy.category = def.category ?? 'unknown';
        enemy.setVisible(false).setActive(false);

        if (!enemy.body) {
            scene.physics.add.existing(enemy);
        } else {
            enemy.body.enable = true;
        }

        const scrambleKey = Phaser.Utils.Array.GetRandom(scene.toneScrambles);
        const soundKey = Phaser.Utils.Array.GetRandom(def.soundSet);
        const tones = scene.sound.add(scrambleKey);
        const sound = scene.sound.add(soundKey);

        tones.play();
        enemy.collision = false;
        scene.time.delayedCall(3000, () => {
            if (!scene.sys.isActive() || !scene.player.active) {
            return;
        }
            if (tones.isPlaying) {
                tones.stop();
            }
            sound.play();
            sound.once('complete', () => {
                scene.time.delayedCall(1000, () => {
                    scene.physics.moveToObject(enemy, scene.player, speed);
                    enemy.setVisible(true).setActive(true);
                    enemy.collision = true;
                    scene.enemyTimers[enemy] = scene.time.delayedCall(2000, () => scene.enemyShoot(enemy));
                    resolve();  
                });
            });
        });
    });
}
export function onEvent() {
    if (!this.currentQueue || this.currentQueue.length === 0) return;
    if (!this.canSpawn) return;

    this.canSpawn = false;

    const nextEnemy = this.currentQueue.shift();
    spawnEnemy(this, nextEnemy, this.speed).then(() => {
        this.canSpawn = true;
        if (!this.scene || !this.sys || !this.sys.isActive()) return;
        this.time.delayedCall(500, () => onEvent.call(this)); // 
    });
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

export function updateScoreDisplay(scene) {
    let currentScore = ScoreManager.getScore();
    scene.scoreText.setText('Score: ' + currentScore);
}
export function playerHit(scene, bullet, player) {
    
    if (bullet.shooter) { 
        bullet.shooter.destroy();
        scene.enemies.remove(bullet.shooter);
    }

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

        ScoreManager.resetScore();
        updateScoreDisplay(scene);

        scene.time.delayedCall(1000, () => {
            killedText.destroy();
            scene.enemyCount = 0;
            scene.scene.restart();
        });
    });
}

export function cleanupScene(scene) {
    scene.sound.stopAll();
    for (let timer in scene.enemyTimers) {
        if (scene.enemyTimers.hasOwnProperty(timer)) {
            scene.enemyTimers[timer].remove(true);
            delete scene.enemyTimers[timer];
        }
    }

    scene.enemySpawnTimers.forEach(timer => timer.remove(true));
    scene.enemySpawnTimers = [];
    scene.enemies = [];
    scene.enemyBullets.clear(true, true);
    scene.projectiles.clear(true, true);
    scene.timedEvent.remove(true);
}

export function checkForNextLevel(scene) {
    cleanupScene(scene);
    ScoreManager.setPreviousScore();
    
    if (scene.player) {
        scene.player.destroy();
    }

    const completeText = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY,
        'Level Complete!',
        {
            fontSize: '40px',
            fill: '#fff',
        }
    );
    completeText.setOrigin(0.5);
}

export async function handleLevelCompletion(scene, nextSceneName, levelNumber) {
    const score = ScoreManager.getScore();
    if (score >= scene.levelUpThreshold) {
        const completionTime = Math.floor((Date.now() - scene.levelStartTime) / 1000);
        const token = localStorage.getItem("authToken");

        if (!token) {
            console.error("Auth token missing - cannot save progress.");
            return;
        }

        const payload = {
            levelNumber,
            completionTime,
            score,
            enemiesKilled: scene.enemyCount,
            killData: scene.killData
        };

        try {
            const response = await axiosInstance.post("http://localhost:5000/api/level/save", payload, {
                headers: { Authorization: token }
            });
            console.log("Progress saved:", response.data);
        } catch (err) {
            console.error("Error saving progress:", err);
        }

        checkForNextLevel(scene); 

        scene.time.delayedCall(1000, () => {
            scene.scene.start(nextSceneName);
        });
    }
}