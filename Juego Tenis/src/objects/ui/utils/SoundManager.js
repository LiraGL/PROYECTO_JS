export default class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {
      hit: scene.sound.add('hit'),
      score: scene.sound.add('score'),
      menu: scene.sound.add('menu')
      // Agrega aquí más sonidos
    };
  }

  play(soundKey) {
    if (this.sounds[soundKey]) {
      this.sounds[soundKey].play();
    }
  }

  stop(soundKey) {
    if (this.sounds[soundKey]) {
      this.sounds[soundKey].stop();
    }
  }
}
