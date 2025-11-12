import Player from '../objects/Player.js';
import AI from '../objects/AI.js';
import Ball from '../objects/Ball.js';
import { tennisScore, getGameWinner } from '../objects/ui/utils/ScoringSystem.js';
import { calculateBounce } from '../objects/ui/utils/PhysicsUtils.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../constant.js';

export default class TennisGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TennisGameScene' });
  }

  init(data) {
    this.difficulty = data?.difficulty || 1;
  }

  preload() {
    this.load.image('ball', 'assets/img/Tennisball.png');
  }

  create() {
    // Draw professional tennis court background - vertical layout
    // Dark green base court
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a4d2e);
    
    // Gradient effect - darker at top and bottom (depth perception)
    this.add.rectangle(GAME_WIDTH / 2, 0, GAME_WIDTH, GAME_HEIGHT * 0.15, 0x0d3820).setAlpha(0.4);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT * 0.15, 0x0d3820).setAlpha(0.4);
    
    // Subtle shadow effect at edges
    this.add.rectangle(8, GAME_HEIGHT / 2, 16, GAME_HEIGHT, 0x000000).setAlpha(0.2);
    this.add.rectangle(GAME_WIDTH - 8, GAME_HEIGHT / 2, 16, GAME_HEIGHT, 0x000000).setAlpha(0.2);

    // ===== OUTER DOUBLES SIDELINES (furthest boundaries) =====
    this.add.rectangle(8, GAME_HEIGHT / 2, 2, GAME_HEIGHT, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH - 8, GAME_HEIGHT / 2, 2, GAME_HEIGHT, 0xffffff).setDepth(1);

    // ===== OUTER BASELINES =====
    this.add.rectangle(GAME_WIDTH / 2, 8, GAME_WIDTH - 16, 2, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 8, GAME_WIDTH - 16, 2, 0xffffff).setDepth(1);

    // ===== SINGLES SIDELINES (inner vertical lines) =====
    const singlesLineX1 = 50;
    const singlesLineX2 = GAME_WIDTH - 50;
    this.add.rectangle(singlesLineX1, GAME_HEIGHT / 2, 2, GAME_HEIGHT - 16, 0xffffff).setDepth(1);
    this.add.rectangle(singlesLineX2, GAME_HEIGHT / 2, 2, GAME_HEIGHT - 16, 0xffffff).setDepth(1);

    // ===== CENTER SERVICE LINE (vertical net) - PROFESSIONAL STYLE =====
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 3, GAME_HEIGHT, 0xffffff).setDepth(2);

    // ===== SERVICE LINES (horizontal) - Professional spacing =====
    const serviceLineY1 = 150;  // Service line on AI side
    const serviceLineY2 = GAME_HEIGHT - 150;  // Service line on player side
    
    this.add.rectangle(GAME_WIDTH / 2, serviceLineY1, GAME_WIDTH - 16, 2, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 2, serviceLineY2, GAME_WIDTH - 16, 2, 0xffffff).setDepth(1);

    // ===== SERVICE BOX LINES (vertical - divide service boxes left/right) =====
    this.add.rectangle(GAME_WIDTH / 4, serviceLineY1, 2, 140, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 4, serviceLineY2, 2, 140, 0xffffff).setDepth(1);
    
    this.add.rectangle((3 * GAME_WIDTH) / 4, serviceLineY1, 2, 140, 0xffffff).setDepth(1);
    this.add.rectangle((3 * GAME_WIDTH) / 4, serviceLineY2, 2, 140, 0xffffff).setDepth(1);

    // ===== CENTER MARKS (thick marks at key points) =====
    // At service lines
    this.add.rectangle(GAME_WIDTH / 2, serviceLineY1, 2, 20, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 2, serviceLineY2, 2, 20, 0xffffff).setDepth(1);
    
    // At baselines
    this.add.rectangle(GAME_WIDTH / 2, 8, 2, 25, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 8, 2, 25, 0xffffff).setDepth(1);

    // ===== CORNER MARKS (at doubles sidelines + baselines) =====
    const cornerMarkLength = 25;
    const cornerMarkWidth = 2;
    
    // Top-left corner
    this.add.rectangle(8, 8 + cornerMarkLength / 2, cornerMarkWidth, cornerMarkLength, 0xffffff).setDepth(1);
    this.add.rectangle(8 + cornerMarkLength / 2, 8, cornerMarkLength, cornerMarkWidth, 0xffffff).setDepth(1);
    
    // Top-right corner
    this.add.rectangle(GAME_WIDTH - 8, 8 + cornerMarkLength / 2, cornerMarkWidth, cornerMarkLength, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH - 8 - cornerMarkLength / 2, 8, cornerMarkLength, cornerMarkWidth, 0xffffff).setDepth(1);
    
    // Bottom-left corner
    this.add.rectangle(8, GAME_HEIGHT - 8 - cornerMarkLength / 2, cornerMarkWidth, cornerMarkLength, 0xffffff).setDepth(1);
    this.add.rectangle(8 + cornerMarkLength / 2, GAME_HEIGHT - 8, cornerMarkLength, cornerMarkWidth, 0xffffff).setDepth(1);
    
    // Bottom-right corner
    this.add.rectangle(GAME_WIDTH - 8, GAME_HEIGHT - 8 - cornerMarkLength / 2, cornerMarkWidth, cornerMarkLength, 0xffffff).setDepth(1);
    this.add.rectangle(GAME_WIDTH - 8 - cornerMarkLength / 2, GAME_HEIGHT - 8, cornerMarkLength, cornerMarkWidth, 0xffffff).setDepth(1);

    // ===== SERVICE BOX CORNER MARKS (at intersections) =====
    const sbCornerMarkLen = 12;
    const sbCornerMarkWid = 1;
    
    // Left service box - top corners
    this.add.rectangle(singlesLineX1, serviceLineY1, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 4, serviceLineY1, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    
    // Left service box - bottom corners
    this.add.rectangle(singlesLineX1, serviceLineY2, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    this.add.rectangle(GAME_WIDTH / 4, serviceLineY2, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    
    // Right service box - top corners
    this.add.rectangle((3 * GAME_WIDTH) / 4, serviceLineY1, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    this.add.rectangle(singlesLineX2, serviceLineY1, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    
    // Right service box - bottom corners
    this.add.rectangle((3 * GAME_WIDTH) / 4, serviceLineY2, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);
    this.add.rectangle(singlesLineX2, serviceLineY2, sbCornerMarkWid, sbCornerMarkLen, 0xcccccc).setAlpha(0.6).setDepth(1);

    // ===== COURT TEXTURE / VISUAL DEPTH =====
    // Subtle horizontal lines for grass court texture (optional)
    for (let i = 0; i < GAME_HEIGHT; i += 8) {
      this.add.rectangle(GAME_WIDTH / 2, i, GAME_WIDTH, 1, 0x000000).setAlpha(0.05).setDepth(0);
    }
    
    // Add subtle vignette effect - darker edges
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000).setAlpha(0).setDepth(10); // Placeholder for visual effect

    // Players and Ball - Vertical layout
    // Player paddle at bottom, AI paddle at top
    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - 30);
    this.ai = new AI(this, GAME_WIDTH / 2, 30, this.difficulty);
    this.ball = new Ball(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ball');

    // Collisions
    this.physics.add.collider(this.ball.sprite, this.player.sprite, this.handleRacketHit, null, this);
    this.physics.add.collider(this.ball.sprite, this.ai.sprite, this.handleRacketHit, null, this);

    // Score display - moved to top
    this.playerPoints = 0;
    this.aiPoints = 0;
    this.scoreText = this.add.text(GAME_WIDTH / 2, 15, tennisScore(this.playerPoints, this.aiPoints),
      { fontFamily: 'Arial', fontSize: '24px', fontStyle: 'bold', color: '#ffffff', align: 'center' }
    ).setOrigin(0.5);

    // Speed indicator
    this.speedText = this.add.text(GAME_WIDTH / 2, 760, 'Speed: 300',
      { fontFamily: 'Arial', fontSize: '12px', color: '#ffff00', align: 'center' }
    ).setOrigin(0.5);

    // Debug text - ball position
    this.debugText = this.add.text(GAME_WIDTH / 2, 740, '',
      { fontFamily: 'Arial', fontSize: '10px', color: '#00ff00', align: 'center' }
    ).setOrigin(0.5);

    // Power meter for shots
    this.powerMeter = null;
    this.powerBar = null;
    this.powerActive = false;
    this.powerLevel = 0;
    this.maxPower = 100;
    
    // Player labels - at top and bottom
    this.add.text(GAME_WIDTH / 2, 8, 'CPU', { fontSize: '11px', color: '#4ecdc4', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 8, 'PLAYER', { fontSize: '11px', color: '#ff6b6b', fontStyle: 'bold' }).setOrigin(0.5);

    // Tutorial/Controls display
    this.showControls();

    // Create interactive hit button
    this.createHitButton();

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Serve logic
    this.serveTo = 'player';
    this.isServing = true;
    this.rallies = 0;
    this.maxRallies = 0;
    this.spacePressed = false;
    
    // Power shot system
    this.powerShotActive = false;
    this.powerShotCharge = 0;
    this.maxPowerCharge = 100;
    this.powerShotReady = false;
    this.lastPowerShotTime = 0;
    this.powerShotCooldown = 2000; // 2 second cooldown
  }

  showControls() {
    // Tutorial text at top
    const tutorialStyle = { fontSize: '11px', color: '#ffff00', fontStyle: 'bold', align: 'center' };
    this.add.text(GAME_WIDTH / 2, 80, 'CONTROLS: ← → Move | SPACE Serve | X Power Shot | H Help',
      tutorialStyle
    ).setOrigin(0.5);
  }

  createHitButton() {
    // Create Hit button for mobile/easier control - positioned for vertical layout
    const buttonX = 60;
    const buttonY = GAME_HEIGHT - 50;
    const buttonWidth = 80;
    const buttonHeight = 40;

    // Button background
    const hitButton = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0xff6b6b, 0.8);
    hitButton.setInteractive({ useHandCursor: true });
    hitButton.setDepth(50);

    // Button text
    const hitText = this.add.text(buttonX, buttonY, 'HIT\n[SPACE]',
      { fontSize: '12px', color: '#ffffff', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5).setDepth(51);

    // Button hover effect
    hitButton.on('pointerover', () => {
      hitButton.setFillStyle(0xff8888, 0.9);
      hitText.setFill('#ffff00');
    });

    hitButton.on('pointerout', () => {
      hitButton.setFillStyle(0xff6b6b, 0.8);
      hitText.setFill('#ffffff');
    });

    // Button click - trigger a hit
    hitButton.on('pointerdown', () => {
      this.simulateHit();
      hitButton.setScale(0.9);
    });

    hitButton.on('pointerup', () => {
      hitButton.setScale(1);
    });

    // Store reference for animation
    this.hitButton = hitButton;
    this.hitButtonText = hitText;

    // Create Power Shot button - positioned for vertical layout
    const powerButtonX = GAME_WIDTH - 60;
    const powerButtonY = GAME_HEIGHT - 50;
    const powerButtonWidth = 80;
    const powerButtonHeight = 40;

    const powerButton = this.add.rectangle(powerButtonX, powerButtonY, powerButtonWidth, powerButtonHeight, 0xff00ff, 0.8);
    powerButton.setInteractive({ useHandCursor: true });
    powerButton.setDepth(50);

    const powerText = this.add.text(powerButtonX, powerButtonY, 'POWER\n[X]',
      { fontSize: '11px', color: '#ffffff', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5).setDepth(51);

    // Power button hover effect
    powerButton.on('pointerover', () => {
      powerButton.setFillStyle(0xff66ff, 0.9);
      powerText.setFill('#ffff00');
    });

    powerButton.on('pointerout', () => {
      powerButton.setFillStyle(0xff00ff, 0.8);
      powerText.setFill('#ffffff');
    });

    // Power button click
    powerButton.on('pointerdown', () => {
      this.handlePowerShot();
      powerButton.setScale(0.9);
    });

    powerButton.on('pointerup', () => {
      powerButton.setScale(1);
    });

    this.powerButton = powerButton;
    this.powerButtonText = powerText;

    // DEBUG: Test Serve button - to verify if serveBall works at all
    const testButtonX = GAME_WIDTH / 2;
    const testButtonY = GAME_HEIGHT - 50;
    const testButtonWidth = 70;
    const testButtonHeight = 40;

    const testButton = this.add.rectangle(testButtonX, testButtonY, testButtonWidth, testButtonHeight, 0x00ff00, 0.8);
    testButton.setInteractive({ useHandCursor: true });
    testButton.setDepth(50);

    const testText = this.add.text(testButtonX, testButtonY, 'TEST\nSERVE',
      { fontSize: '10px', color: '#000000', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5).setDepth(51);

    testButton.on('pointerdown', () => {
      console.log('TEST SERVE BUTTON CLICKED');
      this.serveBall();
    });
  }

  simulateHit() {
    // Move player paddle left slightly to simulate a hit
    const originalX = this.player.sprite.x;
    if (this.player.sprite.x > 40) {
      this.player.sprite.x -= 15;
      
      // Reset after a short delay
      this.time.delayedCall(100, () => {
        this.player.sprite.x = originalX;
      });
    }
  }

  serveBall() {
    console.log(`serveBall() called - serving to ${this.serveTo}`);
    console.log(`Ball sprite exists: ${this.ball && this.ball.sprite ? 'YES' : 'NO'}`);
    console.log(`Ball position before serve: (${this.ball.sprite.x}, ${this.ball.sprite.y})`);
    console.log(`Ball velocity before serve: (${this.ball.sprite.body.velocity.x}, ${this.ball.sprite.body.velocity.y})`);
    
    this.ball.serve(this.serveTo);
    
    console.log(`Ball velocity after serve: (${this.ball.sprite.body.velocity.x}, ${this.ball.sprite.body.velocity.y})`);
    
    this.isServing = false;
    this.rallies = 0;
  }

  handlePowerShot() {
    // Check if power shot is on cooldown
    const currentTime = this.time.now;
    if (currentTime - this.lastPowerShotTime < this.powerShotCooldown) {
      return;
    }

    this.powerShotActive = true;
    this.powerShotCharge = 0;
    this.powerShotReady = false;

    // Create power shot indicator
    const indicator = this.add.rectangle(this.player.sprite.x, this.player.sprite.y - 30, 30, 10, 0xffff00);
    indicator.setDepth(10);

    // Charge animation
    const chargeInterval = this.time.addTimer({
      delay: 50,
      callback: () => {
        this.powerShotCharge += 5;
        indicator.width = Math.min(this.powerShotCharge, this.maxPowerCharge);
        indicator.setFillStyle(this.powerShotCharge > 80 ? 0xff00ff : 0xffff00);

        if (this.powerShotCharge >= this.maxPowerCharge) {
          this.powerShotReady = true;
          chargeInterval.destroy();
        }
      },
      repeat: 19
    });
  }

  handleRacketHit(ballSprite, racketSprite) {
    const isPowerShot = this.powerShotActive && this.powerShotReady;
    
    if (isPowerShot) {
      // Power shot: ball moves faster and with more spin
      this.createPowerShotEffect(ballSprite.x, ballSprite.y);
      calculateBounce(ballSprite, racketSprite);
      
      // Boost ball speed significantly
      ballSprite.body.setVelocity(
        ballSprite.body.velocity.x * 1.5,
        ballSprite.body.velocity.y * 1.5
      );
      
      this.powerShotActive = false;
      this.lastPowerShotTime = this.time.now;
      
      // Create explosion effect
      this.createPowerExplosion(ballSprite.x, ballSprite.y);
    } else {
      calculateBounce(ballSprite, racketSprite);
      this.createHitEffect(ballSprite.x, ballSprite.y);
    }
    
    this.rallies++;
    this.maxRallies = Math.max(this.maxRallies, this.rallies);
    
    // Flash effect on hit
    this.tweens.add({
      targets: ballSprite,
      alpha: { from: 1, to: 0.7 },
      duration: 50,
      yoyo: true,
      ease: 'Power2'
    });
  }

  createHitEffect(x, y) {
    // Create visual effect when ball is hit
    const circle = this.add.circle(x, y, 10, 0xffff00, 0.6);
    this.tweens.add({
      targets: circle,
      radius: 20,
      alpha: 0,
      duration: 300,
      onComplete: () => circle.destroy()
    });
  }

  createPowerShotEffect(x, y) {
    // Create special effect for power shots
    for (let i = 0; i < 3; i++) {
      const circle = this.add.circle(x, y, 5, 0xff00ff, 0.8);
      this.tweens.add({
        targets: circle,
        x: x + Phaser.Math.Between(-50, 50),
        y: y + Phaser.Math.Between(-50, 50),
        alpha: 0,
        scale: 2,
        duration: 400,
        ease: 'Power2.out',
        onComplete: () => circle.destroy()
      });
    }
  }
  
	
	// Auto-start first serve
	this.time.delayedCall(500, () => {
	  if (this.isServing && this.ball.sprite.body.velocity.x === 0 && this.ball.sprite.body.velocity.y === 0) {
	    this.serveBall();
	  }
	});
  createPowerExplosion(x, y) {
    // Create explosion particles
    for (let i = 0; i < 5; i++) {
      const particle = this.add.rectangle(
        x,
        y,
        8,
        8,
        0xff6b6b
      );
      
      const angle = (i / 5) * Math.PI * 2;
      const velocity = 3;
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * 60,
        y: y + Math.sin(angle) * 60,
        alpha: 0,
        scale: 0,
        duration: 400,
        ease: 'Power2.out',
        onComplete: () => particle.destroy()
      });
    }
  }

  update() {
    this.player.update(this.cursors);
    this.ai.update(this.ball.sprite);

    // Handle SPACE key for serving - detect in update loop
    if (this.spaceKey.isDown && !this.spacePressed && this.isServing) {
      console.log('SPACE detected in update - serving');
      this.serveBall();
      this.spacePressed = true;
    }
    if (this.spaceKey.isUp) {
      this.spacePressed = false;
    }

    // Handle power shot input (X key) - only trigger once per press
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey('X'), 300)) {
      if (!this.powerShotActive) {
        this.handlePowerShot();
      }
    }

    const ballSpeed = this.ball.getSpeed();
    this.speedText.setText(`Speed: ${Math.round(ballSpeed)}`);

    // Debug text - show ball position and velocity
    const ballVel = this.ball.sprite.body.velocity;
    this.debugText.setText(`Pos: (${Math.round(this.ball.sprite.x)}, ${Math.round(this.ball.sprite.y)}) | Vel: (${Math.round(ballVel.x)}, ${Math.round(ballVel.y)})`);

    // Create ball trail effect
    if (ballSpeed > 50) {
      this.createBallTrail();
    }

    const b = this.ball.sprite.getBounds();
    
    // Top: AI scores (ball goes out top)
    if (b.top < 0) {
      this.aiPoints++;
      this.updateScore();
      this.serveTo = 'player';
      this.isServing = true;
      this.ball.reset();
      this.rallies = 0;
      this.checkWin();
    } 
    // Bottom: Player scores (ball goes out bottom)
    else if (b.bottom > GAME_HEIGHT) {
      this.playerPoints++;
      this.updateScore();
      this.serveTo = 'ai';
      this.isServing = true;
      this.ball.reset();
      this.rallies = 0;
      this.checkWin();
    }
    
    // Left/Right: Out of bounds (no point, just reset)
    if (b.left < 0 || b.right > GAME_WIDTH) {
      this.isServing = true;
      this.ball.reset();
      this.rallies = 0;
    }
  }

  createBallTrail() {
    // Create visual trail behind the ball
    const trail = this.add.circle(
      this.ball.sprite.x,
      this.ball.sprite.y,
      4,
      0xffff00,
      0.4
    );
    
    this.tweens.add({
      targets: trail,
      alpha: 0,
      scale: 0.5,
      duration: 200,
      onComplete: () => trail.destroy()
    });
  }

  updateScore() {
    this.scoreText.setText(tennisScore(this.playerPoints, this.aiPoints));
    
    // Animate score update
    this.tweens.add({
      targets: this.scoreText,
      scale: { from: 1, to: 1.2 },
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Show rally count
    if (this.rallies > 0) {
      this.createRallyText();
    }
  }

  createRallyText() {
    const rallyText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, `Rally: ${this.rallies}`,
      { fontSize: '16px', color: '#ffff00', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5);
    
    this.tweens.add({
      targets: rallyText,
      y: rallyText.y - 30,
      alpha: 0,
      duration: 1000,
      onComplete: () => rallyText.destroy()
    });
  }

  checkWin() {
    const winner = getGameWinner(this.playerPoints, this.aiPoints);
    if (winner) {
      this.scene.start('ScoreScene', {
        playerScore: this.playerPoints,
        aiScore: this.aiPoints,
        winner: winner,
        maxRallies: this.maxRallies,
        difficulty: this.difficulty
      });
    }
  }

  showHelpMenu() {
    // Create help overlay
    const helpBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 350, 280, 0x000000, 0.8);
    helpBg.setDepth(100);

    const helpStyle = { fontSize: '13px', color: '#ffff00', fontStyle: 'bold', align: 'center' };
    const helpTitleStyle = { fontSize: '16px', color: '#ff6b6b', fontStyle: 'bold', align: 'center' };

    // Title
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120, 'CONTROLS GUIDE',
      helpTitleStyle
    ).setOrigin(0.5).setDepth(101);

    // Controls info
    const controlsText = [
      '↑ / ↓ - Move Paddle',
      'SPACE - Serve Ball',
      'X - Power Shot',
      'P - Pause Game',
      'H - Help (this menu)',
      '',
      'POWER SHOT: Hold X to charge',
      'Red/Purple bar = Ready!',
      'Ball moves 1.5x faster',
      '',
      'First to 5 Points Wins!'
    ];

    let yOffset = GAME_HEIGHT / 2 - 100;
    controlsText.forEach(text => {
      const textColor = text.includes('Power') || text.includes('Ready') ? '#ff00ff' : '#ffff00';
      this.add.text(GAME_WIDTH / 2, yOffset, text,
        { fontSize: '11px', color: textColor, align: 'center' }
      ).setOrigin(0.5).setDepth(101);
      yOffset += 18;
    });

    // Close instruction
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, 'Press H to Close',
      { fontSize: '12px', color: '#00ff00', fontStyle: 'bold', align: 'center' }
    ).setOrigin(0.5).setDepth(101);

    // Close on next H press
    const helpCloseEvent = this.input.keyboard.once('keydown-H', () => {
      helpBg.destroy();
    });

    // Destroy help after 10 seconds if not closed
    this.time.delayedCall(10000, () => {
      if (helpBg.active) helpBg.destroy();
    });
  }
}
