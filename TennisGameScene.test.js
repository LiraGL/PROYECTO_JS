import Phaser from 'phaser';
import TennisGameScene from './Juego Tenis/src/scenes/TennisGameScene.js';

jest.mock('./Juego Tenis/src/objects/ui/utils/PhysicsUtils.js', () => ({
  calculateBounce: jest.fn(),
}));

describe('TennisGameScene', () => {
  it('should call createPowerExplosion when a power shot is made', () => {
    const scene = new TennisGameScene();
    scene.add = {
      circle: jest.fn().mockReturnThis(),
    };
    scene.tweens = {
      add: jest.fn(),
    };
    scene.time = {
      now: 0,
    };
    scene.powerShotActive = true;
    scene.powerShotReady = true;
    scene.createPowerExplosion = jest.fn();

    // Mock the ballSprite and racketSprite arguments
    const ballSprite = { x: 100, y: 200, body: { velocity: { x: 1, y: 1 }, setVelocity: jest.fn() } };
    const racketSprite = { x: 100, y: 220 };

    scene.handleRacketHit(ballSprite, racketSprite);
    expect(scene.createPowerExplosion).toHaveBeenCalled();
  });
});
