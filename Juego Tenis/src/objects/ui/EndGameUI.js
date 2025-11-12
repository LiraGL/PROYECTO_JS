export default class EndGameUI {
  constructor(scene, playerScore, aiScore) {
    this.scene = scene;

    this.header = scene.add.text(400, 100, '¡Fin del Partido!', {
      font: 'bold 32px Arial', fill: '#d7263d'
    }).setOrigin(0.5);

    this.scoreText = scene.add.text(400, 170, `Jugador: ${playerScore}  |  IA: ${aiScore}`, {
      font: '28px Arial', fill: '#ffe066'
    }).setOrigin(0.5);

    this.menuButton = scene.add.text(400, 260, 'Volver al Menú', {
      font: '24px Arial', fill: '#fff', backgroundColor: '#2176ff', padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setInteractive();

    this.menuButton.on('pointerdown', () => {
      scene.scene.start('MenuScene');
    });
  }
}
