// This will be the main game file
// Currently all scenes are on this file, but will change later 
// so that each scene is its own file for readablity. 
// Title Scene
// Need to add option for username input
import Phaser from 'phaser';
import TitleScene from './TitleScene';
import InstructionScene from './InstructionScene';
import Level1Scene from './Level1Scene';
import Level2Scene from './Level2Scene'
import Level3Scene from './Level3Scene';
import Level4Scene from './Level4Scene';
import Level5Scene from './Level5Scene';
import Level6Scene from './Level6Scene';
import Level7Scene from './Level7Scene';
import Level8Scene from './Level8Scene';
import Level9Scene from './Level9Scene';
import Level10Scene from './Level10Scene';
import Level11Scene from './Level11Scene';
import Level12Scene from './Level12Scene';
import Level13Scene from './Level13Scene';
import Level14Scene from './Level14Scene';
import Level15Scene from './Level15Scene';
import Instruction2Scene from './Instruction2Scene';
import Instruction3Scene from './Instruction3Scene';

export const config = {
	type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [TitleScene, InstructionScene, Level1Scene, Level2Scene, Level3Scene, Level4Scene, Level5Scene,Instruction2Scene, Level6Scene, Level7Scene, Level8Scene, Level9Scene ,Level10Scene, Level11Scene, Level12Scene, Level13Scene, Level14Scene, Level15Scene, Instruction3Scene],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
};

const initGame = () => new Phaser.Game(config); 

export default initGame
