import Bullet from './bullet';
import Capture from './claw';
import ScoreManager from './ScoreTracker';
import Phaser from 'phaser';
import { captureEnemy } from './gameutils.js';
//Side Annotations 
    // Bottom Left - 1 
    // Middle Left - 2
    // Top Left - 3 
    // Top Right - 4 
    // Middle Right - 5
    // Bottom Right - 6

    // Get the width and height of the camera view
 

export function createAssets(scene) {
    const camera = scene.cameras.main ;
    const width = camera.width;
    const height = camera.height;
    
    scene.ports = {
        topLeft: { x: camera.worldView.x, y: camera.worldView.y },
        topRight: { x: camera.worldView.x + width, y: camera.worldView.y },
        bottomLeft: { x: camera.worldView.x, y: camera.worldView.y + height },
        bottomRight: { x: camera.worldView.x + width, y: camera.worldView.y + height },
        middleLeft: { x: camera.worldView.x, y:camera.worldView.y+height/2 },
        middleRight: { x:camera.worldView.x + width, y: camera.worldView.y + height/2 }
        }


    const initialDelay = 4000; 
    

    // Background
    let background = scene.add.sprite(0, 0, 'space');
    background.setOrigin(0, 0); 

    // Score text
    scene.scoreText = scene.add.text(scene.cameras.main.centerX, 10, 'Score: ' + ScoreManager.getScore(), { fontSize: '32px', fill: '#fff' });
    scene.scoreText.setOrigin(0.5, 0);

    //Player
    scene.player = scene.physics.add.sprite(scene.cameras.main.centerX, scene.cameras.main.centerY, 'player', 0);
    scene.player.setScale(3); 
    scene.player.setOrigin(.5,.5);

    
    scene.timedEvent = scene.time.addEvent({ delay: initialDelay, callback: scene.onEvent, callbackScope: scene, loop: true });
    
    scene.capture = scene.physics.add.group({
        classType: Capture,
        runChildUpdate: true,
        maxSize: 10
        });

    scene.bullets = scene.physics.add.group({
        classType: Bullet,
        runChildUpdate: true,
        maxSize: 3,
    });

    scene.enemyBullets = scene.physics.add.group({
        classType: Bullet,
        runChildUpdate: true,
        maxSize: 3
    });
    
    scene.enemies = scene.physics.add.group();

    scene.physics.add.overlap(scene.enemyBullets, scene.player, scene.playerHit, null, scene);

    scene.physics.add.overlap(scene.bullets, scene.enemies, (bullet,enemy) => {
        captureEnemy(scene, null, bullet, enemy);
    });

    scene.physics.add.overlap(scene.capture, scene.enemies, (enemy, capture) => {
        captureEnemy(scene, capture, null, enemy);
    });

    scene.enemySpawnTimers = [];
    scene.enemyTimers = {};
    scene.enemyCount = 0;
   

    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.wKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    scene.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    
    scene.rotationState = {
    leftHeldTime: 0,
    rightHeldTime: 0,
    lastLeftRotation: 0,
    lastRightRotation: 0,
    delay: 200,    // ms before repeat starts
    interval: 150  // ms between repeats
    };
    
    scene.anims.create({
        key: 'explode',
        frames: [
            { key: 'explosion1' },
            { key: 'explosion2' },
            { key: 'explosion3' },
            { key: 'explosion4' }
        ],
        frameRate: 8,
        repeat: 0,
        hideOnComplete: true
    });

    //scene.laserSound = scene.sound.add('LaserEnemy');
    scene.explosion = scene.sound.add('explosion');

//Map of enemies 
    scene.enemyTemplates = {
    LightBlueEnemy: {
        key: 'LightBlueEnemy',
        category: 'E1',
        port: 'bottomLeft',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['A_Scale1','A_Scale2','A_Scale3','A_Scale4','A_Scale5','A_Scale6','A_Scale7',]
    },
    OrangeEnemy: {
        key: 'OrangeEnemy',
        category: 'E1',
        port: 'topRight',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['Eb_Scale1','Eb_Scale2','Eb_Scale3','Eb_Scale4','Eb_Scale5','Eb_Scale6','Eb_Scale7',]
    },
    BlueEnemy: {
        key: 'blue-enemy',
        category: 'E1',
        port: 'topLeft',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['CSh_Scale1','CSh_Scale2','CSh_Scale3','CSh_Scale4','CSh_Scale5','CSh_Scale6','CSh_Scale7',]
    },
    YellowEnemy: {
        key: 'YellowEnemy',
        category: 'E1',
        port: 'bottomRight',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['G_Scale1','G_Scale2','G_Scale3','G_Scale4','G_Scale5','G_Scale6','G_Scale7',]    
    },
    GreenEnemy: {
        key: 'green-enemy',
        category: 'E1',
        port: 'middleLeft',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['B_Scale1','B_Scale2','B_Scale3','B_Scale4','B_Scale5','B_Scale6','B_Scale7',]
    },
    PurpleEnemy: {
        key: 'PurpleEnemy',
        category: 'E1',
        port: 'middleRight',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['F_Scale1','F_Scale2','F_Scale3','F_Scale4','F_Scale5','F_Scale6','F_Scale7',]
    },
    MagentaFriendly: {
        key: 'MagentaFriendly',
        category: 'E2',
        port: 'bottomLeft',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['Bb_Scale1','Bb_Scale2','Bb_Scale3','Bb_Scale4','Bb_Scale5','Bb_Scale6','Bb_Scale7',]   
    },
    PinkFriendly: {
        key: 'PinkFriendly',
        category: 'E2',
        port: 'topRight',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['E_Scale1','E_Scale2','E_Scale3','E_Scale4','E_Scale5','E_Scale6','E_Scale7',]
    },
    AquaFriendly: {
        key: 'AquaFriendly',
        category: 'E2',
        port: 'topLeft',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['D_Scale1','D_Scale2','D_Scale3','D_Scale4','D_Scale5','D_Scale6','D_Scale7',]
    },
    LightPurpleFriendly: {
        key: 'LightPurpleFriendly',
        category: 'E2',
        port: 'bottomRight',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['GSh_Scale1','GSh_Scale2','GSh_Scale3','GSh_Scale4','GSh_Scale5','GSh_Scale6','GSh_Scale7',]
    },
    BrownFriendly: {
        key: 'BrownFriendly',
        category: 'E2',
        port: 'middleLeft',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['C_Scale1','C_Scale2','C_Scale3','C_Scale4','C_Scale5','C_Scale6','C_Scale7',
        ]   
    },
    RedFriendly: {
        key: 'RedFriendly',
        category: 'E2',
        port: 'middleRight',
        scale: 1.4,
        origin: 0.5,
        soundSet: ['FSh_Scale1','FSh_Scale2','FSh_Scale3','FSh_Scale4','FSh_Scale5','FSh_Scale6','FSh_Scale7',]
    }   
    };
}

