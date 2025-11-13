import { MAX_BALL_SPEED, PADDLE_WIDTH } from '../../../constant.js';

export function calculateBounce(ballSprite, racketSprite) {
  // --- 1. Calculate Hit Position ---
  // The relative position where the ball hit the racket.
  // -1 for the far left edge, 0 for the center, 1 for the far right edge.
  const relativeIntersectX = (ballSprite.x - racketSprite.x) / (PADDLE_WIDTH / 2);
  // Clamp the value between -1 and 1 to handle edge cases.
  const normalizedIntersect = Math.max(-1, Math.min(1, relativeIntersectX));

  // --- 2. Calculate Bounce Angle ---
  // The maximum angle the ball can bounce off at (e.g., 60 degrees).
  // A hit at the center results in a 0-degree angle (straight back).
  // A hit at the edge results in the maximum angle.
  const maxBounceAngle = 60; // in degrees
  const bounceAngle = normalizedIntersect * maxBounceAngle;

  // --- 3. Calculate New Speed ---
  // Get the current speed of the ball.
  const currentSpeed = Math.sqrt(
    ballSprite.body.velocity.x ** 2 + ballSprite.body.velocity.y ** 2
  );

  // Increase speed slightly on each hit to make the game more exciting.
  // Clamp the speed at MAX_BALL_SPEED.
  const newSpeed = Math.min(currentSpeed * 1.05, MAX_BALL_SPEED);

  // --- 4. Calculate New Velocity based on Angle and Speed ---
  // Determine the vertical direction of the ball after the bounce.
  // It should be the opposite of the current vertical velocity.
  const direction = ballSprite.body.velocity.y > 0 ? -1 : 1;

  // Convert the bounce angle to radians for trigonometric functions.
  const angleInRad = Phaser.Math.DegToRad(bounceAngle);

  // Calculate the new X and Y velocities.
  // The angle determines the distribution between vertical (cos) and horizontal (sin) speed.
  const newVelocityX = newSpeed * Math.sin(angleInRad);
  const newVelocityY = direction * newSpeed * Math.cos(angleInRad);

  // Set the new velocity on the ball's physics body.
  ballSprite.body.setVelocity(newVelocityX, newVelocityY);
}
