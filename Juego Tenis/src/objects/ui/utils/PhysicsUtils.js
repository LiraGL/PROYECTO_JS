import { MAX_BALL_SPEED } from '../../../constant.js';

export function calculateBounce(ballSprite, racketSprite) {
  const ballY = ballSprite.y;
  const racketY = racketSprite.y;
  const racketHeight = 80;
  
  // Calculate hit position on racket (-1 to 1)
  const relativeIntersectY = (racketY - ballY) / (racketHeight / 2);
  const normalizedIntersect = Math.max(-1, Math.min(1, relativeIntersectY));
  
  // Calculate bounce angle (up to 70 degrees)
  const bounceAngle = normalizedIntersect * 70;
  
  // Current speed
  const currentSpeed = Math.sqrt(
    ballSprite.body.velocity.x ** 2 + ballSprite.body.velocity.y ** 2
  );
  
  // Slightly increase speed on each hit (up to max)
  const newSpeed = Math.min(currentSpeed * 1.02, MAX_BALL_SPEED);
  const speedRatio = newSpeed / currentSpeed;
  
  // Calculate new velocity
  const baseVelocity = currentSpeed * speedRatio;
  const newVelocityX = -ballSprite.body.velocity.x * speedRatio;
  const newVelocityY = baseVelocity * Math.sin(Phaser.Math.DegToRad(bounceAngle));
  
  ballSprite.body.setVelocity(newVelocityX, newVelocityY);
}