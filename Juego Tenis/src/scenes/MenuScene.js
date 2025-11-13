export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Background
    this.add.rectangle(200, 400, 400, 800, 0x166e27);

    // Título del juego
this.add.text(200, 120, 'Tenis 2D', {      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Botón de inicio - crear rectángulo y texto por separado
    const buttonBg = this.add.rectangle(200, 240, 120, 50, 0xffffff);
const playButton = this.add.text(200, 240, 'JUGAR', {      font: '24px Arial',
      fill: '#166e27'
    })
    .setOrigin(0.5)
    .setInteractive();

    playButton.on('pointerdown', () => {
      this.scene.start('TennisGameScene');
    });

    // Hover effect
    playButton.on('pointerover', () => {
      buttonBg.setFillStyle(0xffe066);
    });

    playButton.on('pointerout', () => {
      buttonBg.setFillStyle(0xffffff);
    });
  }
}
