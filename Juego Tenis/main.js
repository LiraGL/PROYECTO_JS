// main.js

import MenuScene from './src/scenes/MenuScene.js';
import TennisGameScene from './src/scenes/TennisGameScene.js';
import ScoreScene from './src/scenes/ScoreScene.js';
import PracticeScene from './src/scenes/PracticeScene.js';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 800,
  parent: 'tennis-game-container',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
 scene: [MenuScene, TennisGameScene, ScoreScene, PracticeScene],};

const game = new Phaser.Game(config);
