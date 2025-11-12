import { BALL_SPEED } from '../constant.js';

export default class Ball {
  constructor(scene, x, y, spriteKey) {
    this.scene = scene;
    // Create ball as a circle (more reliable for collisions)
    this.sprite = scene.add.circle(x, y, 10, 0xffff00);
    this.sprite.setStrokeStyle(2, 0xffffff); // White border to make it more visible
    
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(false); // No world collision
    this.sprite.body.setBounce(1, 1);
    this.sprite.body.setDrag(0, 0); // No air resistance
    this.sprite.body.setFriction(0, 0); // No friction
    
    this.initialX = x;
    this.initialY = y;
    this.speed = BALL_SPEED;
  }

  serve(toSide) {
    // toSide: 'player' means serving TO player (ball goes down from AI), 'ai' means serving TO ai (ball goes up from player)
    const direction = toSide === 'player' ? 1 : -1; // 1 = down toward player, -1 = up toward AI
    // Smaller angle range to keep serve more centered
    const angle = Phaser.Math.Between(-15, 15); // Reduced from -30 to 30
    const radians = Phaser.Math.DegToRad(angle);
    
    // Calculate velocity components - ensure majority of speed goes vertical
    const vx = this.speed * 0.4 * Math.sin(radians); // Reduce horizontal component
    const vy = direction * this.speed * 0.95 * Math.cos(radians); // Majority goes vertical
    
    // Debug log
    console.log(`Serving to ${toSide}: direction=${direction}, angle=${angle}, vx=${vx}, vy=${vy}`);
    
    this.sprite.body.setVelocity(vx, vy);
  }

  reset() {
    this.sprite.setPosition(this.initialX, this.initialY);
    this.sprite.body.setVelocity(0, 0);
  }

  getSpeed() {
    return Math.sqrt(
      this.sprite.body.velocity.x ** 2 + this.sprite.body.velocity.y ** 2
    );
  }
}