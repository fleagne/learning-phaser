import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // ブートシーンは通常、ゲームロゴや背景など、プリローダーに必要なアセットをロードするために使用する
    // ブートシーン自体にはプリローダーがないため、 アセットのファイルサイズは小さければ小さいほど良い
    this.load.image("background", "assets/bg.png");
  }

  create() {
    // "Preloader" に移動する
    this.scene.start("Preloader");
  }
}
