import Phaser from 'phaser';

export function preloadAssets(scene) {
	// Preloads all /assets for the game
	scene.load.image('space', '/assets/space.png');
	scene.load.spritesheet('claw', '/assets/claw.png', { frameWidth: 12, frameHeight: 14 });
	scene.load.spritesheet('player', '/assets/player.png', { frameWidth: 14, frameHeight: 16 });
	scene.load.spritesheet('BlueEnemy', '/assets/Blue-Enemy.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('GreenEnemy', '/assets/Green-Enemy.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('bullet', '/assets/Bullet.png', { frameWidth: 32, frameHeight: 32 });
	scene.load.spritesheet('AquaFriendly', '/assets/Aqua-Friendly.png', { frameWidth: 32, frameHeight: 32 });
	scene.load.spritesheet('capture', '/assets/capture.png', {frameWidth: 32, frameHeight:32});
    scene.load.image('explosion1', '/assets/explosion1.png', { frameWidth: 32, frameHeight: 32 });
    scene.load.image('explosion2', '/assets/explosion2.png', { frameWidth: 32, frameHeight: 32 });
    scene.load.image('explosion3', '/assets/explosion3.png', { frameWidth: 32, frameHeight: 32 });
	
//Preloading all aliens 
	scene.load.spritesheet('LightBlueEnemy', '/assets/LightBlue-Enemy.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('BrownFriendly', '/assets/Brown-Friendly.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('MagentaFriendly', '/assets/Magenta-Friendly.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('OrangeEnemy', '/assets/Orange-Enemy.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('PinkFriendly', '/assets/Pink-Friendly.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('PurpleEnemy', '/assets/Purple-Enemy.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('LightPurpleFriendly', '/assets/Purple-Friendly.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('RedFriendly', '/assets/Red-Friendly.png', { frameWidth: 30, frameHeight: 30 });
	scene.load.spritesheet('YellowEnemy', '/assets/Yellow-Enemy.png', { frameWidth: 30, frameHeight: 30 });

//Preloading all audio files
    scene.load.audio('LaserEnemy', '/assets/LaserEnemy.wav');
    scene.load.audio('explosion', '/assets/Explosion.wav');
	//Loading A files (Light Blue)
	scene.load.audio('A_Scale1', '/assets/Randomized_Tones/Random_A/A_Scale1.wav');
	scene.load.audio('A_Scale2', '/assets/Randomized_Tones/Random_A/A_Scale2.wav');
	scene.load.audio('A_Scale3', '/assets/Randomized_Tones/Random_A/A_Scale3.wav');
	scene.load.audio('A_Scale4', '/assets/Randomized_Tones/Random_A/A_Scale4.wav');
	scene.load.audio('A_Scale5', '/assets/Randomized_Tones/Random_A/A_Scale5.wav');
	scene.load.audio('A_Scale6', '/assets/Randomized_Tones/Random_A/A_Scale6.wav');
	scene.load.audio('A_Scale7', '/assets/Randomized_Tones/Random_A/A_Scale7.wav');

	//Loading Eb files (orange)
	scene.load.audio('Eb_Scale1', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale1.wav');
	scene.load.audio('Eb_Scale2', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale2.wav');
	scene.load.audio('Eb_Scale3', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale3.wav');
	scene.load.audio('Eb_Scale4', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale4.wav');
	scene.load.audio('Eb_Scale5', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale5.wav');
	scene.load.audio('Eb_Scale6', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale6.wav');
	scene.load.audio('Eb_Scale7', '/assets/Randomized_Tones/Random_EFl/E_Fl_Scale7.wav');

	//Loading C# files (blue) 
	scene.load.audio('CSh_Scale1', '/assets/Randomized_Tones/Random_CSh/CSh_Scale1.wav');
	scene.load.audio('CSh_Scale2', '/assets/Randomized_Tones/Random_CSh/CSh_Scale2.wav');
	scene.load.audio('CSh_Scale3', '/assets/Randomized_Tones/Random_CSh/CSh_Scale3.wav');
	scene.load.audio('CSh_Scale4', '/assets/Randomized_Tones/Random_CSh/CSh_Scale4.wav');
	scene.load.audio('CSh_Scale5', '/assets/Randomized_Tones/Random_CSh/CSh_Scale5.wav');
	scene.load.audio('CSh_Scale6', '/assets/Randomized_Tones/Random_CSh/CSh_Scale6.wav');
	scene.load.audio('CSh_Scale7', '/assets/Randomized_Tones/Random_CSh/CSh_Scale7.wav');

	//Loading G files (yellow)
	scene.load.audio('G_Scale1', '/assets/Randomized_Tones/Random_G/G_Scale1.wav');
	scene.load.audio('G_Scale2', '/assets/Randomized_Tones/Random_G/G_Scale2.wav');
	scene.load.audio('G_Scale3', '/assets/Randomized_Tones/Random_G/G_Scale3.wav');
	scene.load.audio('G_Scale4', '/assets/Randomized_Tones/Random_G/G_Scale4.wav');
	scene.load.audio('G_Scale5', '/assets/Randomized_Tones/Random_G/G_Scale5.wav');
	scene.load.audio('G_Scale6', '/assets/Randomized_Tones/Random_G/G_Scale6.wav');
	scene.load.audio('G_Scale7', '/assets/Randomized_Tones/Random_G/G_Scale7.wav');

	//Loading B files(green)
	scene.load.audio('B_Scale1', '/assets/Randomized_Tones/Random_B/B_Scale1.wav');
	scene.load.audio('B_Scale2', '/assets/Randomized_Tones/Random_B/B_Scale2.wav');
	scene.load.audio('B_Scale3', '/assets/Randomized_Tones/Random_B/B_Scale3.wav');
	scene.load.audio('B_Scale4', '/assets/Randomized_Tones/Random_B/B_Scale4.wav');
	scene.load.audio('B_Scale5', '/assets/Randomized_Tones/Random_B/B_Scale5.wav');
	scene.load.audio('B_Scale6', '/assets/Randomized_Tones/Random_B/B_Scale6.wav');
	scene.load.audio('B_Scale7', '/assets/Randomized_Tones/Random_B/B_Scale7.wav');

	//Loading F files (purple)
	scene.load.audio('F_Scale1', '/assets/Randomized_Tones/Random_F/F_Scale1.wav');
	scene.load.audio('F_Scale2', '/assets/Randomized_Tones/Random_F/F_Scale2.wav');
	scene.load.audio('F_Scale3', '/assets/Randomized_Tones/Random_F/F_Scale3.wav');
	scene.load.audio('F_Scale4', '/assets/Randomized_Tones/Random_F/F_Scale4.wav');
	scene.load.audio('F_Scale5', '/assets/Randomized_Tones/Random_F/F_Scale5.wav');
	scene.load.audio('F_Scale6', '/assets/Randomized_Tones/Random_F/F_Scale6.wav');
	scene.load.audio('F_Scale7', '/assets/Randomized_Tones/Random_F/F_Scale7.wav');

	//Loading Bb files (magenta)
	scene.load.audio('Bb_Scale1', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale1.wav');
	scene.load.audio('Bb_Scale2', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale2.wav');
	scene.load.audio('Bb_Scale3', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale3.wav');
	scene.load.audio('Bb_Scale4', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale4.wav');
	scene.load.audio('Bb_Scale5', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale5.wav');
	scene.load.audio('Bb_Scale6', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale6.wav');
	scene.load.audio('Bb_Scale7', '/assets/Randomized_Tones/Random_BFl/Bfl_Scale7.wav');

	//Loading E files (pink)
	scene.load.audio('E_Scale1', '/assets/Randomized_Tones/Random_E/E_Scale1.wav');
	scene.load.audio('E_Scale2', '/assets/Randomized_Tones/Random_E/E_Scale2.wav');
	scene.load.audio('E_Scale3', '/assets/Randomized_Tones/Random_E/E_Scale3.wav');
	scene.load.audio('E_Scale4', '/assets/Randomized_Tones/Random_E/E_Scale4.wav');
	scene.load.audio('E_Scale5', '/assets/Randomized_Tones/Random_E/E_Scale5.wav');
	scene.load.audio('E_Scale6', '/assets/Randomized_Tones/Random_E/E_Scale6.wav');
	scene.load.audio('E_Scale7', '/assets/Randomized_Tones/Random_E/E_Scale7.wav');

	//Loading D files (aqua)
	scene.load.audio('D_Scale1', '/assets/Randomized_Tones/Random_D/D_Scale1.wav');
	scene.load.audio('D_Scale2', '/assets/Randomized_Tones/Random_D/D_Scale2.wav');
	scene.load.audio('D_Scale3', '/assets/Randomized_Tones/Random_D/D_Scale3.wav');
	scene.load.audio('D_Scale4', '/assets/Randomized_Tones/Random_D/D_Scale4.wav');
	scene.load.audio('D_Scale5', '/assets/Randomized_Tones/Random_D/D_Scale5.wav');
	scene.load.audio('D_Scale6', '/assets/Randomized_Tones/Random_D/D_Scale6.wav');
	scene.load.audio('D_Scale7', '/assets/Randomized_Tones/Random_D/D_Scale7.wav');

	//Loading G# files (lightpurple)
	scene.load.audio('GSh_Scale1', '/assets/Randomized_Tones/Random_GSh/GSh_Scale1.wav');
	scene.load.audio('GSh_Scale2', '/assets/Randomized_Tones/Random_GSh/GSh_Scale2.wav');
	scene.load.audio('GSh_Scale3', '/assets/Randomized_Tones/Random_GSh/GSh_Scale3.wav');
	scene.load.audio('GSh_Scale4', '/assets/Randomized_Tones/Random_GSh/GSh_Scale4.wav');
	scene.load.audio('GSh_Scale5', '/assets/Randomized_Tones/Random_GSh/GSh_Scale5.wav');
	scene.load.audio('GSh_Scale6', '/assets/Randomized_Tones/Random_GSh/GSh_Scale6.wav');
	scene.load.audio('GSh_Scale7', '/assets/Randomized_Tones/Random_GSh/GSh_Scale7.wav');

	//Loading C files (brown)
	scene.load.audio('C_Scale1', '/assets/Randomized_Tones/Random_C/C_Scale1.wav');
	scene.load.audio('C_Scale2', '/assets/Randomized_Tones/Random_C/C_Scale2.wav');
	scene.load.audio('C_Scale3', '/assets/Randomized_Tones/Random_C/C_Scale3.wav');
	scene.load.audio('C_Scale4', '/assets/Randomized_Tones/Random_C/C_Scale4.wav');
	scene.load.audio('C_Scale5', '/assets/Randomized_Tones/Random_C/C_Scale5.wav');
	scene.load.audio('C_Scale6', '/assets/Randomized_Tones/Random_C/C_Scale6.wav');
	scene.load.audio('C_Scale7', '/assets/Randomized_Tones/Random_C/C_Scale7.wav');

	//Loading F# files (red)
	scene.load.audio('FSh_Scale1', '/assets/Randomized_Tones/Random_FSh/FSh_Scale1.wav');
	scene.load.audio('FSh_Scale2', '/assets/Randomized_Tones/Random_FSh/FSh_Scale2.wav');
	scene.load.audio('FSh_Scale3', '/assets/Randomized_Tones/Random_FSh/FSh_Scale3.wav');
	scene.load.audio('FSh_Scale4', '/assets/Randomized_Tones/Random_FSh/FSh_Scale4.wav');
	scene.load.audio('FSh_Scale5', '/assets/Randomized_Tones/Random_FSh/FSh_Scale5.wav');
	scene.load.audio('FSh_Scale6', '/assets/Randomized_Tones/Random_FSh/FSh_Scale6.wav');
	scene.load.audio('FSh_Scale7', '/assets/Randomized_Tones/Random_FSh/FSh_Scale7.wav');
	
	//Loading scrambles
	scene.load.audio('scramble1', '/assets/scrambles/scramble_01.wav');
	scene.load.audio('scramble2', '/assets/scrambles/scramble_02.wav');
	scene.load.audio('scramble3', '/assets/scrambles/scramble_03.wav');
	scene.load.audio('scramble4', '/assets/scrambles/scramble_04.wav');
	scene.load.audio('scramble5', '/assets/scrambles/scramble_05.wav');
	scene.load.audio('scramble6', '/assets/scrambles/scramble_06.wav');
	scene.load.audio('scramble7', '/assets/scrambles/scramble_07.wav');
	scene.load.audio('scramble8', '/assets/scrambles/scramble_08.wav');
	scene.load.audio('scramble9', '/assets/scrambles/scramble_09.wav');
	scene.load.audio('scramble10', '/assets/scrambles/scramble_10.wav');
	scene.load.audio('scramble11', '/assets/scrambles/scramble_11.wav');
	scene.load.audio('scramble12', '/assets/scrambles/scramble_12.wav');
	scene.load.audio('scramble13', '/assets/scrambles/scramble_13.wav');
	scene.load.audio('scramble14', '/assets/scrambles/scramble_14.wav');
	scene.load.audio('scramble15', '/assets/scrambles/scramble_15.wav');
	scene.load.audio('scramble16', '/assets/scrambles/scramble_16.wav');
	scene.load.audio('scramble17', '/assets/scrambles/scramble_17.wav');
	scene.load.audio('scramble18', '/assets/scrambles/scramble_18.wav');
	scene.load.audio('scramble19', '/assets/scrambles/scramble_19.wav');
	scene.load.audio('scramble20', '/assets/scrambles/scramble_20.wav');
}