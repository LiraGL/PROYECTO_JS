export default class MenuUI {
  constructor(scene) {
    this.scene = scene;
    // Título
    this.title = scene.add.text(400, 120, 'Tenis 2D', {
      font: 'bold 48px Arial',
      fill: '#2176ff'
    }).setOrigin(0.5);

    // Botón principal
    this.playButton = scene.add.text(400, 240, 'JUGAR', {
      font: '32px Arial',
      fill: '#ffe066',
      backgroundColor: '#2176ff',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive();

    this.playButton.on('pointerdown', () => {
      scene.scene.start('TennisGameScene');
    });

    // Puedes agregar más botones para práctica, ajustes, etc.
  }
}
