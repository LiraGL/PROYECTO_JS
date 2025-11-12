import EndGameUI from '../objects/ui/EndGameUI.js';

export default class ScoreScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ScoreScene' });
  }

  init(data) {
    this.playerScore = data.playerScore || 0;
    this.aiScore = data.aiScore || 0;
  }

  create() {
    // Background
    this.add.rectangle(400, 200, 800, 400, 0x166e27);

    // Title
    this.add.text(400, 100, '¡Fin del partido!' , { font: 'bold 32px Arial', fill: '#fff' }).setOrigin(0.5);

    // Scores
    this.add.text(400, 170, `Jugador: ${this.playerScore}  |  IA: ${this.aiScore}`, { font: '28px Arial', fill: '#ffe066' }).setOrigin(0.5);

    // Winner message
    let winnerText = 'Empate';
    if (this.playerScore > this.aiScore) {
      winnerText = '¡Ganaste!';
    } else if (this.aiScore > this.playerScore) {
      winnerText = 'La IA ganó';
    }
    this.add.text(400, 220, winnerText, { font: '24px Arial', fill: '#fff' }).setOrigin(0.5);

    // Menu button
    const menuButton = this.add.text(400, 280, 'Volver al Menú', { font: '24px Arial', fill: '#fff', backgroundColor: '#2176ff', padding: 10 })
      .setOrigin(0.5)
      .setInteractive();
    menuButton.on('pointerdown', () => this.scene.start('MenuScene'));

    // Hover effect
    menuButton.on('pointerover', () => {
      menuButton.setBackgroundColor('#4a90e2');
    });
    menuButton.on('pointerout', () => {
      menuButton.setBackgroundColor('#2176ff');
    });
  }
}
