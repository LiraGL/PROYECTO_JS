import { GAME_WIDTH, AI_SPEED, PADDLE_WIDTH, PADDLE_HEIGHT } from '../constant.js';

export default class AI {
  constructor(scene, x, y, difficulty = 1) {
    this.scene = scene;
    // Vertical layout: paddle is horizontal (width x height = 80 x 15)
    this.sprite = scene.add.rectangle(x, y, PADDLE_WIDTH, PADDLE_HEIGHT, 0x4ecdc4);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setImmovable(true);
    this.speed = AI_SPEED * difficulty;
    this.maxX = GAME_WIDTH - PADDLE_WIDTH / 2;
    this.minX = PADDLE_WIDTH / 2;
    this.difficulty = difficulty;
    this.reactionDelay = Math.max(10 - difficulty * 2, 0);
    this.delayCounter = 0;
    this.errorMargin = 40 / difficulty; // Add an error margin for more human-like movement
  }

  update(ballSprite) {
    this.delayCounter++;
    
    if (this.delayCounter < this.reactionDelay) {
      return;
    }
    
    this.delayCounter = 0;
    
    // Add a random error to the ball's position to make the AI less perfect
    const error = (Math.random() - 0.5) * this.errorMargin;
    const targetX = ballSprite.x + error;

    const paddleX = this.sprite.x;
    const threshold = 35 * (2 - this.difficulty * 0.5); // Harder = smaller threshold

    if (targetX < paddleX - threshold && this.sprite.x > this.minX) {
      this.sprite.x -= this.speed;
    } else if (targetX > paddleX + threshold && this.sprite.x < this.maxX) {
      this.sprite.x += this.speed;
    }
  }
}
