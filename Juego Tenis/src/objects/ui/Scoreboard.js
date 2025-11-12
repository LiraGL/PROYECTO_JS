export default class Scoreboard {
  constructor(scene, x, y) {
    this.scene = scene;
    // Texto principal del marcador (sets y juegos)
    this.text = scene.add.text(x, y, 'Jugador: 0  |  IA: 0', {
      font: '28px Arial Bold',
      fill: '#fff',
      align: 'center'
    }).setOrigin(0.5);
  }

  setScore(playerScore, aiScore) {
    this.text.setText(`Jugador: ${playerScore}  |  IA: ${aiScore}`);
  }
}
