import { Scene } from "phaser";

export class GameClear extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameclear_text: Phaser.GameObjects.Text;

  constructor() {
    super("GameClear");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(352, 228, "background");
    this.background.setAlpha(0.5);

    this.gameclear_text = this.add.text(352, 228, "Game Clear", {
      fontFamily: "Arial Black",
      fontSize: 64,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.gameclear_text.setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
