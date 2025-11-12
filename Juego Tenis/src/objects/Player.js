import { GAME_WIDTH, PADDLE_SPEED, PADDLE_WIDTH, PADDLE_HEIGHT } from '../constant.js';

export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    // Vertical layout: paddle is horizontal (width x height = 80 x 15)
    this.sprite = scene.add.rectangle(x, y, PADDLE_WIDTH, PADDLE_HEIGHT, 0xff6b6b);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setImmovable(true);
    this.speed = PADDLE_SPEED;
    this.maxX = GAME_WIDTH - PADDLE_WIDTH / 2;
    this.minX = PADDLE_WIDTH / 2;
  }

  update(cursors) {
    // In vertical layout, left/right arrows move the paddle horizontally
    const moveLeft = cursors.left.isDown || cursors.a?.isDown;
    const moveRight = cursors.right.isDown || cursors.d?.isDown;

    if (moveLeft && this.sprite.x > this.minX) {
      this.sprite.x -= this.speed;
    }
    if (moveRight && this.sprite.x < this.maxX) {
      this.sprite.x += this.speed;
    }
  }
}