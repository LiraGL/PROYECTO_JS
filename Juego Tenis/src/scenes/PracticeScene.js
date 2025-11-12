export default class PracticeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PracticeScene' });
  }

  create() {
    // Lógica y display de modo práctica (puede ser muy similar a TennisGameScene)
    this.add.text(400, 60, 'Modo práctica', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);

    // Cuando termines, regresar:
    const returnButton = this.add.text(400, 340, 'Regresar al menú', { font: '24px Arial', fill: '#fff', backgroundColor: '#d7263d', padding: 10 })
      .setOrigin(0.5)
      .setInteractive();
    returnButton.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
