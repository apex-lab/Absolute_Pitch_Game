import Bullet from './bullet';
import Capture from './claw';
import ScoreManager from './ScoreTracker';
import Phaser from 'phaser';
//Side Annotations 
    // Bottom Left - 1 
    // Middle Left - 2
    // Top Left - 3 
    // Top Right - 4 
    // Middle Right - 5
    // Bottom Right - 6
function getScreenCorners(camera) {
    // Get the width and height of the camera view
    const width = camera.width;
    const height = camera.height;
    
    // Calculate the corner positions
    const topLeft = { x: camera.worldView.x, y: camera.worldView.y };
    const topRight = { x: camera.worldView.x + width, y: camera.worldView.y };
    const bottomLeft = { x: camera.worldView.x, y: camera.worldView.y + height };
    const bottomRight = { x: camera.worldView.x + width, y: camera.worldView.y + height };
    const middleLeft = { x: camera.worldView.x, y:camera.worldView.y+height/2 };
    const middleRight = { x:camera.worldView.x + width, y: camera.worldView.y + height/2

    };
    return { topLeft, topRight, bottomLeft, bottomRight, middleLeft,middleRight};
}

export function createAssets(scene) {
    const camera = scene.cameras.main ;
    const corners = getScreenCorners(camera);

    //Reset game intervals if player is killed
    const initialDelay = 4000; 
    scene.enemyCount = 0;
    scene.enemies = []

    // Setting up the background
    let background = scene.add.sprite(0, 0, 'space');
    background.setOrigin(0, 0); // Centers the background to center of screen 

    // Setting up the score text
    scene.scoreText = scene.add.text(scene.cameras.main.centerX, 10, 'Score: ' + ScoreManager.getScore(), { fontSize: '32px', fill: '#fff' });
    scene.scoreText.setOrigin(0.5, 0);

    // Creating Player
    scene.player = scene.physics.add.sprite(scene.cameras.main.centerX, scene.cameras.main.centerY, 'player', 0);
    scene.player.setScale(3); // Scaling the player
    scene.cursor = scene.input.activePointer; 
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
    //Creating bullet objects for enemies
    scene.enemyBullets = scene.physics.add.group({
        classType: Bullet,
        runChildUpdate: true,
        maxSize: 3
    });
    
    scene.enemySpawnTimers = []; 
    // Set up keyboard input
    scene.wKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    scene.eKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
    // Add an update loop to check for key presses
    scene.input.on('pointermove', (pointer) => {
        scene.mouseX = pointer.x;
        scene.mouseY = pointer.y;
    });
    
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

//Creating all aliens
    /*  Creating Light Blue Alien
        Note A and comes in from 1*/
        scene.LightBlueEnemy = scene.physics.add.sprite(corners.bottomLeft.x, corners.bottomLeft.y, 'LightBlueEnemy', 0);
        scene.LightBlueEnemy.setScale(1.4);
        scene.LightBlueEnemy.setOrigin(0.5,0.5); 
        scene.LightBlueEnemy.setVisible(false).setActive(false);
        scene.LightBlueEnemy.category = 'E1'
        scene.LightBlueEnemySounds = [
            scene.sound.add('A_Scale1'),
            scene.sound.add('A_Scale2'),
            scene.sound.add('A_Scale3'),
            scene.sound.add('A_Scale4'),
            scene.sound.add('A_Scale5'),
            scene.sound.add('A_Scale6'),
            scene.sound.add('A_Scale7')
        ]
    /*  Creating Orange Alien 
        Note Eb and comes in from 4*/
        scene.OrangeEnemy = scene.physics.add.sprite(corners.topRight.x, corners.topRight.y, 'OrangeEnemy', 0);
        scene.OrangeEnemy.setScale(1.4);
        scene.OrangeEnemy.setOrigin(0.5,0.5);
        scene.OrangeEnemy.setVisible(false).setActive(false);
        scene.OrangeEnemy.category = 'E1'
        scene.OrangeEnemySounds = [ 
            scene.sound.add('Eb_Scale1'),
            scene.sound.add('Eb_Scale2'),
            scene.sound.add('Eb_Scale3'),
            scene.sound.add('Eb_Scale3'),
            scene.sound.add('Eb_Scale4'),
            scene.sound.add('Eb_Scale5'),
            scene.sound.add('Eb_Scale6'),
            scene.sound.add('Eb_Scale7')
        ]
    /* Creating Blue Enemy
        //Note C# and comes in from 3 */
        scene.BlueEnemy = scene.physics.add.sprite(corners.topLeft.x, corners.topLeft.y, 'blue-enemy', 0);
        scene.BlueEnemy.setScale(1.4);
        scene.BlueEnemy.setOrigin(0.5,0.5);
        scene.BlueEnemy.setVisible(false).setActive(false);
        scene.BlueEnemy.category = 'E1'
        scene.BlueEnemySounds = [ 
            scene.sound.add('CSh_Scale1'),
            scene.sound.add('CSh_Scale2'),
            scene.sound.add('CSh_Scale3'),
            scene.sound.add('CSh_Scale3'),
            scene.sound.add('CSh_Scale4'),
            scene.sound.add('CSh_Scale5'),
            scene.sound.add('CSh_Scale6'),
            scene.sound.add('CSh_Scale7')
        ]

     /*  Creating Yellow Alien 
        Note G and comes in from 6 */
        scene.YellowEnemy = scene.physics.add.sprite(corners.bottomRight.x, corners.bottomRight.y, 'YellowEnemy',0);
        scene.YellowEnemy.setScale(1.4);
        scene.YellowEnemy.setOrigin(0.5,0.5); 
        scene.YellowEnemy.setVisible(false).setActive(false);
        scene.YellowEnemy.category = 'E1'
        scene.YellowEnemySounds = [ 
            scene.sound.add('G_Scale1'),
            scene.sound.add('G_Scale2'),
            scene.sound.add('G_Scale3'),
            scene.sound.add('G_Scale4'),
            scene.sound.add('G_Scale5'),
            scene.sound.add('G_Scale6'),
            scene.sound.add('G_Scale7'),     
        ]
    /*  Creating Green Enemy
        Note B and comes in from 2 */
        scene.GreenEnemy = scene.physics.add.sprite(corners.middleLeft.x, corners.middleLeft.y , 'green-enemy', 0);
        scene.GreenEnemy.setScale(1.4);
        scene.GreenEnemy.setOrigin(0.5,0.5);
        scene.GreenEnemy.setVisible(false).setActive(false);
        scene.GreenEnemy.category = 'E1'
        scene.GreenEnemySounds = [ 
            scene.sound.add('B_Scale1'),
            scene.sound.add('B_Scale2'),
            scene.sound.add('B_Scale3'),
            scene.sound.add('B_Scale4'),
            scene.sound.add('B_Scale5'),
            scene.sound.add('B_Scale6'),
            scene.sound.add('B_Scale7'),     
        ]
    
    /*  Creating Purple Alien 
        Note F and comes in from 5 */
        scene.PurpleEnemy = scene.physics.add.sprite(corners.middleRight.x, corners.middleRight.y, 'PurpleEnemy',0);
        scene.PurpleEnemy.setScale(1.4);
        scene.PurpleEnemy.setOrigin(0.5,0.5); 
        scene.PurpleEnemy.setVisible(false).setActive(false);
        scene.PurpleEnemy.category = 'E1'
        scene.PurpleEnemySounds = [ 
            scene.sound.add('F_Scale1'),
            scene.sound.add('F_Scale2'),
            scene.sound.add('F_Scale3'),
            scene.sound.add('F_Scale4'),
            scene.sound.add('F_Scale5'),
            scene.sound.add('F_Scale6'),
            scene.sound.add('F_Scale7'),     
        ]
    /*  Creating Magenta Alien 
        Note Bb and comes in from 1 */
        scene.MagentaFriendly = scene.physics.add.sprite(corners.bottomLeft.x, corners.bottomLeft.y,'MagentaFriendly', 0 ); 
        scene.MagentaFriendly.setScale(1.4); 
        scene.MagentaFriendly.setOrigin(0.5,0.5);
        scene.MagentaFriendly.setVisible(false).setActive(false);
        scene.MagentaFriendly.category = 'E2'
        scene.MagentaFriendlySounds = [ 
            scene.sound.add('Bb_Scale1'),
            scene.sound.add('Bb_Scale2'),
            scene.sound.add('Bb_Scale3'),
            scene.sound.add('Bb_Scale4'),
            scene.sound.add('Bb_Scale5'),
            scene.sound.add('Bb_Scale6'),
            scene.sound.add('Bb_Scale7'),     
        ]
    /*  Creating Pink Alien 
        Note E and comes in from 4 */
        scene.PinkFriendly = scene.physics.add.sprite(corners.topRight.x , corners.topRight.y,'PinkFriendly', 0 ); 
        scene.PinkFriendly.setScale(1.4); 
        scene.PinkFriendly.setOrigin(0.5,0.5);
        scene.PinkFriendly.setVisible(false).setActive(false);
        scene.PinkFriendly.category = 'E2'
        scene.PinkFriendlySounds = [ 
            scene.sound.add('E_Scale1'),
            scene.sound.add('E_Scale2'),
            scene.sound.add('E_Scale3'),
            scene.sound.add('E_Scale4'),
            scene.sound.add('E_Scale5'),
            scene.sound.add('E_Scale6'),
            scene.sound.add('E_Scale7'),     
        ]
    /*  Creating Aqua Alien 
        Note D and comes in from 3 */
        scene.AquaFriendly = scene.physics.add.sprite(corners.topLeft.x, corners.topLeft.y, 'AquaFriendly', 0);
        scene.AquaFriendly.setScale(1.4);
        scene.AquaFriendly.setOrigin(0.5,0.5);
        scene.AquaFriendly.setVisible(false).setActive(false);
        scene.AquaFriendly.category = 'E2'
        scene.AquaFriendlySounds = [ 
            scene.sound.add('D_Scale1'),
            scene.sound.add('D_Scale2'),
            scene.sound.add('D_Scale3'),
            scene.sound.add('D_Scale4'),
            scene.sound.add('D_Scale5'),
            scene.sound.add('D_Scale6'),
            scene.sound.add('D_Scale7'),  
        ]
    /*  Creating Light Purple Alien 
        Note G# and comes in from 6 */
        scene.LightPurpleFriendly = scene.physics.add.sprite(corners.bottomRight.x, corners.bottomRight.y, 'LightPurpleFriendly',0);
        scene.LightPurpleFriendly.setScale(1.4);
        scene.LightPurpleFriendly.setOrigin(0.5,0.5);
        scene.LightPurpleFriendly.setVisible(false).setActive(false);
        scene.LightPurpleFriendly.category = 'E2'
        scene.LightPurpleFriendlySounds = [ 
            scene.sound.add('GSh_Scale1'),
            scene.sound.add('GSh_Scale2'),
            scene.sound.add('GSh_Scale3'),
            scene.sound.add('GSh_Scale4'),
            scene.sound.add('GSh_Scale5'),
            scene.sound.add('GSh_Scale6'),
            scene.sound.add('GSh_Scale7'),  
        ] 

    /*  Creating Brown Alien 
        Note C and comes in from 2 */
        scene.BrownFriendly = scene.physics.add.sprite(corners.middleLeft.x, corners.middleRight.y, 'BrownFriendly', 0); 
        scene.BrownFriendly.setScale(1.4);
        scene.BrownFriendly.setOrigin(0.5,0.5); 
        scene.BrownFriendly.setVisible(false).setActive(false);
        scene.BrownFriendly.category = 'E2'
        scene.BrownFriendlySounds = [ 
            scene.sound.add('C_Scale1'),
            scene.sound.add('C_Scale2'),
            scene.sound.add('C_Scale3'),
            scene.sound.add('C_Scale4'),
            scene.sound.add('C_Scale5'),
            scene.sound.add('C_Scale6'),
            scene.sound.add('C_Scale7'),  
        ] 
    
    /*  Creating Red Alien 
        Note F# and comes in from 5 */
        scene.RedFriendly = scene.physics.add.sprite(corners.middleRight.x, corners.middleRight.y, 'RedFriendly',0);
        scene.RedFriendly.setScale(1.4);
        scene.RedFriendly.setOrigin(0.5,0.5); 
        scene.RedFriendly.setVisible(false).setActive(false);
        scene.RedFriendly.category = 'E2'
        scene.RedFriendlySounds = [ 
            scene.sound.add('FSh_Scale1'),
            scene.sound.add('FSh_Scale2'),
            scene.sound.add('FSh_Scale3'),
            scene.sound.add('FSh_Scale4'),
            scene.sound.add('FSh_Scale5'),
            scene.sound.add('FSh_Scale6'),
            scene.sound.add('FSh_Scale7'),  
        ]  
}

